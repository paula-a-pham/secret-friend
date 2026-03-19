import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render, userEvent } from '../test/test-utils'
import DrawScreen from './DrawScreen'
import type { GameState } from '../types'

vi.mock('../utils/sounds', () => ({
  playTick: vi.fn(),
  playReveal: vi.fn(),
  playSuccess: vi.fn(),
}))

vi.mock('../utils/haptics', () => ({
  tapVibrate: vi.fn(),
}))

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

const makeGame = (overrides: Partial<GameState> = {}): GameState => ({
  phase: 'draw',
  participants: ['Alice', 'Bob', 'Carol'],
  pin: '1234',
  assignments: {},
  drawn: [],
  pool: ['Alice', 'Bob', 'Carol'],
  ...overrides,
})

describe('DrawScreen', () => {
  const defaultProps = {
    game: makeGame(),
    onAccept: vi.fn(),
    onComplete: vi.fn(),
    onAddPlayer: vi.fn(),
    onRemovePlayer: vi.fn(),
    onBack: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('List phase', () => {
    it('renders all participants', () => {
      render(<DrawScreen {...defaultProps} />)
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
      expect(screen.getByText('Carol')).toBeInTheDocument()
    })

    it('shows draw progress', () => {
      render(<DrawScreen {...defaultProps} />)
      expect(screen.getByText('0 of 3 have drawn')).toBeInTheDocument()
    })

    it('shows progress bar', () => {
      render(<DrawScreen {...defaultProps} />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows updated progress when some have drawn', () => {
      const game = makeGame({ drawn: ['Alice'], assignments: { Alice: 'Bob' } })
      render(<DrawScreen {...defaultProps} game={game} />)
      expect(screen.getByText('1 of 3 have drawn')).toBeInTheDocument()
    })

    it('marks drawn participants with checkmark', () => {
      const game = makeGame({ drawn: ['Alice'], assignments: { Alice: 'Bob' } })
      render(<DrawScreen {...defaultProps} game={game} />)
      expect(screen.getByLabelText('Alice has already drawn')).toBeInTheDocument()
    })

    it('shows tap to draw for undrawn participants', () => {
      render(<DrawScreen {...defaultProps} />)
      expect(screen.getByLabelText('Alice — tap to draw')).toBeInTheDocument()
    })

    it('shows add player form', () => {
      render(<DrawScreen {...defaultProps} />)
      expect(screen.getByPlaceholderText('Add new player...')).toBeInTheDocument()
    })

    it('adds a new player via form', async () => {
      const onAddPlayer = vi.fn()
      const user = userEvent.setup()
      render(<DrawScreen {...defaultProps} onAddPlayer={onAddPlayer} />)

      await user.type(screen.getByPlaceholderText('Add new player...'), 'Dave')
      await user.click(screen.getByRole('button', { name: 'Add' }))
      expect(onAddPlayer).toHaveBeenCalledWith('Dave')
    })

    it('shows error for duplicate player name', async () => {
      const user = userEvent.setup()
      render(<DrawScreen {...defaultProps} />)

      await user.type(screen.getByPlaceholderText('Add new player...'), 'Alice')
      await user.click(screen.getByRole('button', { name: 'Add' }))
      expect(screen.getByRole('alert')).toHaveTextContent('Name already exists')
    })

    it('shows remove button when > 3 participants', () => {
      const game = makeGame({
        participants: ['Alice', 'Bob', 'Carol', 'Dave'],
        pool: ['Alice', 'Bob', 'Carol', 'Dave'],
      })
      render(<DrawScreen {...defaultProps} game={game} />)
      expect(screen.getByLabelText('Remove Alice')).toBeInTheDocument()
    })

    it('hides remove button when exactly 3 participants', () => {
      render(<DrawScreen {...defaultProps} />)
      expect(screen.queryByLabelText('Remove Alice')).not.toBeInTheDocument()
    })

    it('calls onBack when back button clicked', async () => {
      const onBack = vi.fn()
      const user = userEvent.setup()
      render(<DrawScreen {...defaultProps} onBack={onBack} />)

      await user.click(screen.getByLabelText('Go back to home'))
      expect(onBack).toHaveBeenCalled()
    })
  })

  describe('All drawn state', () => {
    it('shows view results button when all drawn', () => {
      const game = makeGame({
        drawn: ['Alice', 'Bob', 'Carol'],
        assignments: { Alice: 'Bob', Bob: 'Carol', Carol: 'Alice' },
        pool: [],
      })
      render(<DrawScreen {...defaultProps} game={game} />)
      expect(screen.getByText(/All Done/)).toBeInTheDocument()
    })

    it('hides add player form when all drawn', () => {
      const game = makeGame({
        drawn: ['Alice', 'Bob', 'Carol'],
        assignments: { Alice: 'Bob', Bob: 'Carol', Carol: 'Alice' },
        pool: [],
      })
      render(<DrawScreen {...defaultProps} game={game} />)
      expect(screen.queryByPlaceholderText('Add new player...')).not.toBeInTheDocument()
    })
  })

  describe('Privacy phase', () => {
    it('shows privacy screen when a player taps to draw', async () => {
      const user = userEvent.setup()
      render(<DrawScreen {...defaultProps} />)

      await user.click(screen.getByLabelText('Alice — tap to draw'))
      expect(screen.getByText('Hand the device to')).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    it('shows draw button with player name', async () => {
      const user = userEvent.setup()
      render(<DrawScreen {...defaultProps} />)

      await user.click(screen.getByLabelText('Alice — tap to draw'))
      expect(screen.getByText("I'm Alice — Draw!")).toBeInTheDocument()
    })
  })
})
