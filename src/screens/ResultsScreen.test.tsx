import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render, userEvent } from '../test/test-utils'
import ResultsScreen from './ResultsScreen'
import type { GameState } from '../types'

vi.mock('../utils/sounds', () => ({
  playFlip: vi.fn(),
  playSuccess: vi.fn(),
}))

vi.mock('../utils/haptics', () => ({
  tapVibrate: vi.fn(),
}))

const makeGame = (): GameState => ({
  phase: 'results',
  participants: ['Alice', 'Bob', 'Carol'],
  pin: '1234',
  assignments: { Alice: 'Bob', Bob: 'Carol', Carol: 'Alice' },
  drawn: ['Alice', 'Bob', 'Carol'],
  pool: [],
})

describe('ResultsScreen', () => {
  const defaultProps = {
    game: makeGame(),
    onBack: vi.fn(),
    onAddPlayers: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Locked state (PIN entry)', () => {
    it('shows PIN entry screen', () => {
      render(<ResultsScreen {...defaultProps} />)
      expect(screen.getByText('View Results')).toBeInTheDocument()
      expect(screen.getByText('Enter the organizer PIN to see all secret friends')).toBeInTheDocument()
    })

    it('renders 4 PIN input fields', () => {
      render(<ResultsScreen {...defaultProps} />)
      expect(screen.getAllByRole('textbox')).toHaveLength(4)
    })

    it('shows wrong PIN error for incorrect code', async () => {
      const user = userEvent.setup()
      render(<ResultsScreen {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      await user.click(inputs[0])
      await user.keyboard('0000')

      expect(screen.getByText('Wrong PIN')).toBeInTheDocument()
    })

    it('shows Unlocked! for correct PIN', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ResultsScreen {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      await user.click(inputs[0])
      await user.keyboard('1234')

      expect(screen.getByText('Unlocked!')).toBeInTheDocument()
      vi.useRealTimers()
    })

    it('calls onBack from locked screen', async () => {
      const onBack = vi.fn()
      const user = userEvent.setup()
      render(<ResultsScreen {...defaultProps} onBack={onBack} />)

      await user.click(screen.getByLabelText('Go back to home'))
      expect(onBack).toHaveBeenCalled()
    })
  })

  describe('Unlocked state', () => {
    async function renderUnlocked() {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const timedUser = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<ResultsScreen {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      await timedUser.click(inputs[0])
      await timedUser.keyboard('1234')

      // Advance past the 800ms setTimeout that sets unlocked=true
      vi.advanceTimersByTime(900)
      vi.useRealTimers()

      // Wait for React to render the unlocked view
      await waitFor(() => {
        expect(screen.getByText('Secret Friends')).toBeInTheDocument()
      })
    }

    it('shows all matches title', async () => {
      await renderUnlocked()
      expect(screen.getByText('Secret Friends')).toBeInTheDocument()
    })

    it('shows flip cards for all participants', async () => {
      await renderUnlocked()
      expect(screen.getByText('Tap a card to reveal the secret friend')).toBeInTheDocument()
      expect(screen.getByLabelText("Reveal Alice's secret friend")).toBeInTheDocument()
      expect(screen.getByLabelText("Reveal Bob's secret friend")).toBeInTheDocument()
      expect(screen.getByLabelText("Reveal Carol's secret friend")).toBeInTheDocument()
    })

    it('toggles card reveal on click', async () => {
      await renderUnlocked()
      const user = userEvent.setup()
      const card = screen.getByLabelText("Reveal Alice's secret friend")
      await user.click(card)

      expect(screen.getByLabelText('Alice gives to Bob')).toBeInTheDocument()
    })

    it('shows add new players button', async () => {
      await renderUnlocked()
      expect(screen.getByText('+ Add New Players')).toBeInTheDocument()
    })

    it('shows add players form when button clicked', async () => {
      await renderUnlocked()
      const user = userEvent.setup()
      await user.click(screen.getByText('+ Add New Players'))
      expect(screen.getByText('Add New Players')).toBeInTheDocument()
    })

    it('shows home button', async () => {
      await renderUnlocked()
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
  })
})
