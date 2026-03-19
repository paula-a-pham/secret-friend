import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
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

  describe('Shuffle and reveal phases', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('shows reveal with drawn name and action buttons after drawing', async () => {
      // Use a game state where only 1 recipient is available so animation is skipped
      // Carol is the last to draw; Alice->Bob and Bob->Alice already assigned,
      // so only Carol is left in pool and the only available recipient for Carol is Alice
      // Actually: pool has only Carol left unassigned as recipient. Let's set it up
      // so that the available list has exactly 1 name => skips animation, goes to reveal.
      const game = makeGame({
        participants: ['Alice', 'Bob', 'Carol'],
        drawn: ['Alice', 'Bob'],
        assignments: { Alice: 'Carol', Bob: 'Alice' },
        pool: ['Alice', 'Bob', 'Carol'],
      })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<DrawScreen {...defaultProps} game={game} />)

      // Carol taps to draw
      await user.click(screen.getByLabelText('Carol — tap to draw'))
      // Now on privacy screen, click draw button
      await user.click(screen.getByText("I'm Carol — Draw!"))

      // Only Bob is available (Alice->Carol, Bob->Alice already assigned, pool minus already-assigned).
      // getAvailableRecipients filters pool: not currentPerson (Carol) and not already a value in assignments (Carol, Alice).
      // So available = pool.filter(p => p !== 'Carol' && !{'Carol','Alice'}.has(p)) => ['Bob']
      // poolForDisplay.length === 1, so animation is skipped, goes straight to reveal.
      await waitFor(() => {
        expect(screen.getByText('Your secret friend is')).toBeInTheDocument()
      })
      expect(screen.getByText('Bob')).toBeInTheDocument()
      expect(screen.getByText('Draw Again')).toBeInTheDocument()
      expect(screen.getByText('Accept')).toBeInTheDocument()
    })

    it('transitions from shuffling to reveal after animation completes', async () => {
      // With 3 participants and no prior draws, there are 2 available recipients
      // so the shuffle animation will run (poolForDisplay.length > 1).
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<DrawScreen {...defaultProps} />)

      await user.click(screen.getByLabelText('Alice — tap to draw'))
      await user.click(screen.getByText("I'm Alice — Draw!"))

      // The animation uses Date.now() and requestAnimationFrame with SHUFFLE_DURATION=2000ms
      // Advance past the shuffle duration
      vi.advanceTimersByTime(2500)

      await waitFor(() => {
        expect(screen.getByText('Your secret friend is')).toBeInTheDocument()
      })
      // The revealed name should be one of the other participants
      const revealedName = screen.getByRole('status').textContent?.replace(/🎉/g, '').trim()
      expect(['Bob', 'Carol']).toContain(revealedName)
      expect(screen.getByText('Accept')).toBeInTheDocument()
      expect(screen.getByText('Draw Again')).toBeInTheDocument()
    })
  })

  describe('Accept flow', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('calls onAccept with correct args and returns to list phase', async () => {
      const onAccept = vi.fn()
      // Set up so only 1 available recipient (skip animation)
      const game = makeGame({
        participants: ['Alice', 'Bob', 'Carol'],
        drawn: ['Alice', 'Bob'],
        assignments: { Alice: 'Carol', Bob: 'Alice' },
        pool: ['Alice', 'Bob', 'Carol'],
      })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<DrawScreen {...defaultProps} game={game} onAccept={onAccept} />)

      // Carol draws
      await user.click(screen.getByLabelText('Carol — tap to draw'))
      await user.click(screen.getByText("I'm Carol — Draw!"))

      await waitFor(() => {
        expect(screen.getByText('Accept')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Accept'))

      // onAccept should be called with (person, recipient, swapData)
      // Carol draws Bob (only available), no swap needed so swapData is null
      expect(onAccept).toHaveBeenCalledWith('Carol', 'Bob', null)

      // Should return to list phase showing participants
      expect(screen.getByText('Draw Names')).toBeInTheDocument()
    })
  })

  describe('Remove player during draw', () => {
    it('calls onRemovePlayer when clicking remove button on a 4-player game', async () => {
      const onRemovePlayer = vi.fn()
      const game = makeGame({
        participants: ['Alice', 'Bob', 'Carol', 'Dave'],
        pool: ['Alice', 'Bob', 'Carol', 'Dave'],
      })
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<DrawScreen {...defaultProps} game={game} onRemovePlayer={onRemovePlayer} />)

      await user.click(screen.getByLabelText('Remove Dave'))

      // The component uses a 250ms setTimeout before calling onRemovePlayer
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(onRemovePlayer).toHaveBeenCalledWith('Dave')
      })

      vi.useRealTimers()
    })
  })

  describe('Complete flow', () => {
    it('calls onComplete when clicking All Done button', async () => {
      const onComplete = vi.fn()
      const game = makeGame({
        drawn: ['Alice', 'Bob', 'Carol'],
        assignments: { Alice: 'Bob', Bob: 'Carol', Carol: 'Alice' },
        pool: [],
      })
      const user = userEvent.setup()
      render(<DrawScreen {...defaultProps} game={game} onComplete={onComplete} />)

      await user.click(screen.getByText(/All Done/))
      expect(onComplete).toHaveBeenCalled()
    })
  })

  describe('Leave confirmation', () => {
    it('shows confirmation modal when back is clicked with draws in progress', async () => {
      const game = makeGame({
        drawn: ['Alice'],
        assignments: { Alice: 'Bob' },
      })
      const user = userEvent.setup()
      render(<DrawScreen {...defaultProps} game={game} />)

      await user.click(screen.getByLabelText('Go back to home'))

      // Modal should appear with confirmation message
      await waitFor(() => {
        expect(screen.getByText('Your drawing progress will be lost. Are you sure?')).toBeInTheDocument()
      })
      expect(screen.getByText('Leave')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('calls onBack when Leave is clicked in the confirmation modal', async () => {
      const onBack = vi.fn()
      const game = makeGame({
        drawn: ['Alice'],
        assignments: { Alice: 'Bob' },
      })
      const user = userEvent.setup()
      render(<DrawScreen {...defaultProps} game={game} onBack={onBack} />)

      await user.click(screen.getByLabelText('Go back to home'))

      await waitFor(() => {
        expect(screen.getByText('Leave')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Leave'))
      expect(onBack).toHaveBeenCalled()
    })

    it('closes modal without leaving when Cancel is clicked', async () => {
      const onBack = vi.fn()
      const game = makeGame({
        drawn: ['Alice'],
        assignments: { Alice: 'Bob' },
      })
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<DrawScreen {...defaultProps} game={game} onBack={onBack} />)

      await user.click(screen.getByLabelText('Go back to home'))

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Cancel'))

      // Modal close has a 250ms animation timeout
      vi.advanceTimersByTime(300)

      // onBack should NOT have been called
      expect(onBack).not.toHaveBeenCalled()
      // Should still be on the list phase
      expect(screen.getByText('Draw Names')).toBeInTheDocument()

      vi.useRealTimers()
    })
  })
})
