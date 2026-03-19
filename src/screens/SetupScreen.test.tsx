import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render, userEvent } from '../test/test-utils'
import SetupScreen from './SetupScreen'

vi.mock('../utils/sounds', () => ({
  playSuccess: vi.fn(),
}))

describe('SetupScreen', () => {
  const defaultProps = {
    step: 'pin' as const,
    onPinSet: vi.fn(),
    onStart: vi.fn(),
    onBack: vi.fn(),
    onBackToPin: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PIN step', () => {
    it('renders PIN setup screen', () => {
      render(<SetupScreen {...defaultProps} />)
      expect(screen.getByText('Set Organizer PIN')).toBeInTheDocument()
      expect(screen.getByText(/need this to view/i)).toBeInTheDocument()
    })

    it('has a back button', () => {
      render(<SetupScreen {...defaultProps} />)
      expect(screen.getByLabelText('Go back to home')).toBeInTheDocument()
    })

    it('calls onBack when back button clicked', async () => {
      const onBack = vi.fn()
      const user = userEvent.setup()
      render(<SetupScreen {...defaultProps} onBack={onBack} />)

      await user.click(screen.getByLabelText('Go back to home'))
      expect(onBack).toHaveBeenCalled()
    })

    it('shows PIN Set! after PIN completion', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SetupScreen {...defaultProps} />)

      const inputs = screen.getAllByRole('textbox')
      await user.click(inputs[0])
      await user.keyboard('5678')

      expect(screen.getByText('PIN Set!')).toBeInTheDocument()
      vi.useRealTimers()
    })

    it('calls onPinSet after delay', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const onPinSet = vi.fn()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SetupScreen {...defaultProps} onPinSet={onPinSet} />)

      const inputs = screen.getAllByRole('textbox')
      await user.click(inputs[0])
      await user.keyboard('1234')

      vi.advanceTimersByTime(900)
      expect(onPinSet).toHaveBeenCalledWith('1234')
      vi.useRealTimers()
    })
  })

  describe('Players step', () => {
    const playersProps = {
      ...defaultProps,
      step: 'players' as const,
      pin: '1234',
    }

    it('renders participants form', () => {
      render(<SetupScreen {...playersProps} />)
      expect(screen.getByText('Add Participants')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter a name...')).toBeInTheDocument()
    })

    it('adds participants', async () => {
      const user = userEvent.setup()
      render(<SetupScreen {...playersProps} />)

      const input = screen.getByPlaceholderText('Enter a name...')
      await user.type(input, 'Alice')
      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText(/participant added/i)).toBeInTheDocument()
    })

    it('prevents duplicate names (case-insensitive)', async () => {
      const user = userEvent.setup()
      render(<SetupScreen {...playersProps} />)

      const input = screen.getByPlaceholderText('Enter a name...')
      await user.type(input, 'Alice')
      await user.click(screen.getByRole('button', { name: 'Add' }))
      await user.type(input, 'alice')
      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(screen.getByRole('alert')).toHaveTextContent('Name already added')
    })

    it('shows need at least 3 message', async () => {
      const user = userEvent.setup()
      render(<SetupScreen {...playersProps} />)

      const input = screen.getByPlaceholderText('Enter a name...')
      await user.type(input, 'Alice')
      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(screen.getByText(/need at least 3/i)).toBeInTheDocument()
    })

    it('disables start button with < 3 participants', async () => {
      const user = userEvent.setup()
      render(<SetupScreen {...playersProps} />)

      const input = screen.getByPlaceholderText('Enter a name...')
      await user.type(input, 'Alice')
      await user.click(screen.getByRole('button', { name: 'Add' }))
      await user.type(input, 'Bob')
      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(screen.getByText('Start Drawing!')).toBeDisabled()
      expect(screen.getByText(/need at least 3/i)).toBeInTheDocument()
    })

    it('calls onStart with 3+ participants', async () => {
      const onStart = vi.fn()
      const user = userEvent.setup()
      render(<SetupScreen {...playersProps} onStart={onStart} />)

      const input = screen.getByPlaceholderText('Enter a name...')
      for (const name of ['Alice', 'Bob', 'Carol']) {
        await user.type(input, name)
        await user.click(screen.getByRole('button', { name: 'Add' }))
      }

      await user.click(screen.getByText('Start Drawing!'))
      expect(onStart).toHaveBeenCalledWith(['Alice', 'Bob', 'Carol'], '1234')
    })

    it('removes a participant', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<SetupScreen {...playersProps} />)

      const input = screen.getByPlaceholderText('Enter a name...')
      await user.type(input, 'Alice')
      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(screen.getByText('Alice')).toBeInTheDocument()
      await user.click(screen.getByLabelText('Remove Alice'))

      vi.advanceTimersByTime(300)
      await waitFor(() => {
        expect(screen.queryByText('Alice')).not.toBeInTheDocument()
      })
      vi.useRealTimers()
    })

    it('calls onBackToPin when back clicked', async () => {
      const onBackToPin = vi.fn()
      const user = userEvent.setup()
      render(<SetupScreen {...playersProps} onBackToPin={onBackToPin} />)

      await user.click(screen.getByLabelText('Go back to PIN setup'))
      expect(onBackToPin).toHaveBeenCalled()
    })
  })
})
