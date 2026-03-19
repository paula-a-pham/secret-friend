import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import * as storage from './utils/storage'

vi.mock('./utils/sounds', () => ({
  isMuted: () => false,
  toggleMute: () => true,
  playTick: vi.fn(),
  playReveal: vi.fn(),
  playFlip: vi.fn(),
  playSuccess: vi.fn(),
}))

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

describe('App', () => {
  beforeEach(() => {
    storage.clearGame()
  })

  it('renders home screen by default', async () => {
    render(<App />)
    expect(await screen.findByText('Secret Friend')).toBeInTheDocument()
    expect(screen.getByText('Start New Game')).toBeInTheDocument()
  })

  it('navigates to PIN setup on "Start New Game"', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByText('Start New Game'))
    expect(await screen.findByText('Set Organizer PIN')).toBeInTheDocument()
  })

  it('navigates home → PIN → players → draw flow', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Start new game
    await user.click(await screen.findByText('Start New Game'))
    expect(await screen.findByText('Set Organizer PIN')).toBeInTheDocument()

    // Enter PIN: 1234
    const pinInputs = screen.getAllByRole('textbox')
    await user.type(pinInputs[0], '1')
    await user.type(pinInputs[1], '2')
    await user.type(pinInputs[2], '3')
    await user.type(pinInputs[3], '4')

    // Wait for PIN set animation
    expect(await screen.findByText('Add Participants', {}, { timeout: 2000 })).toBeInTheDocument()
  })

  it('shows "Continue Game" when saved game exists', async () => {
    storage.saveGame({
      phase: 'draw',
      participants: ['Alice', 'Bob', 'Carol'],
      pin: '1234',
      assignments: {},
      drawn: [],
      pool: ['Alice', 'Bob', 'Carol'],
    })
    render(<App />)
    expect(await screen.findByText('Continue Game')).toBeInTheDocument()
  })

  it('restores saved game on "Continue Game"', async () => {
    const user = userEvent.setup()
    storage.saveGame({
      phase: 'draw',
      participants: ['Alice', 'Bob', 'Carol'],
      pin: '1234',
      assignments: {},
      drawn: [],
      pool: ['Alice', 'Bob', 'Carol'],
    })
    render(<App />)
    await user.click(await screen.findByText('Continue Game'))
    expect(await screen.findByText('Draw Names')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('resets saved game on confirm reset', async () => {
    const user = userEvent.setup()
    storage.saveGame({
      phase: 'draw',
      participants: ['Alice', 'Bob', 'Carol'],
      pin: '1234',
      assignments: {},
      drawn: [],
      pool: ['Alice', 'Bob', 'Carol'],
    })
    render(<App />)
    await user.click(await screen.findByText('Reset Everything'))

    // Confirm dialog appears
    const dialog = screen.getByRole('alertdialog')
    await user.click(within(dialog).getByText('Reset'))

    // Back to home with no continue button
    await vi.waitFor(() => {
      expect(screen.getByText('Start New Game')).toBeInTheDocument()
      expect(screen.queryByText('Continue Game')).not.toBeInTheDocument()
    })
  })

  it('navigates back to home from PIN setup', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByText('Start New Game'))
    expect(await screen.findByText('Set Organizer PIN')).toBeInTheDocument()

    await user.click(screen.getByText('Back'))
    expect(await screen.findByText('Secret Friend')).toBeInTheDocument()
  })

  it('adds players and starts draw phase', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Go to PIN setup
    await user.click(await screen.findByText('Start New Game'))

    // Enter PIN
    const pinInputs = await screen.findAllByRole('textbox')
    await user.type(pinInputs[0], '1')
    await user.type(pinInputs[1], '2')
    await user.type(pinInputs[2], '3')
    await user.type(pinInputs[3], '4')

    // Wait for players step
    expect(await screen.findByText('Add Participants', {}, { timeout: 2000 })).toBeInTheDocument()

    // Add 3 players
    const nameInput = screen.getByPlaceholderText('Enter a name...')
    await user.type(nameInput, 'Alice')
    await user.click(screen.getByText('Add'))

    await user.type(nameInput, 'Bob')
    await user.click(screen.getByText('Add'))

    await user.type(nameInput, 'Carol')
    await user.click(screen.getByText('Add'))

    // Start drawing
    await user.click(screen.getByText('Start Drawing!'))
    expect(await screen.findByText('Draw Names')).toBeInTheDocument()
  })

  it('persists game state during draw phase', async () => {
    const saveSpy = vi.spyOn(storage, 'saveGame')
    const user = userEvent.setup()
    render(<App />)

    // Start and set up a game
    await user.click(await screen.findByText('Start New Game'))
    const pinInputs = await screen.findAllByRole('textbox')
    await user.type(pinInputs[0], '1')
    await user.type(pinInputs[1], '2')
    await user.type(pinInputs[2], '3')
    await user.type(pinInputs[3], '4')

    expect(await screen.findByText('Add Participants', {}, { timeout: 2000 })).toBeInTheDocument()

    const nameInput = screen.getByPlaceholderText('Enter a name...')
    await user.type(nameInput, 'Alice')
    await user.click(screen.getByText('Add'))
    await user.type(nameInput, 'Bob')
    await user.click(screen.getByText('Add'))
    await user.type(nameInput, 'Carol')
    await user.click(screen.getByText('Add'))

    await user.click(screen.getByText('Start Drawing!'))
    await screen.findByText('Draw Names')

    // Game should be saved since we're in draw phase
    expect(saveSpy).toHaveBeenCalled()
    saveSpy.mockRestore()
  })
})
