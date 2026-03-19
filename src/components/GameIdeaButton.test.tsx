import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render, userEvent } from '../test/test-utils'
import GameIdeaButton from './GameIdeaButton'

vi.mock('../utils/sounds', () => ({
  isMuted: vi.fn(() => false),
  toggleMute: vi.fn(() => true),
}))

describe('GameIdeaButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the FAB button', () => {
    render(<GameIdeaButton />)
    expect(screen.getByLabelText('Menu')).toBeInTheDocument()
  })

  it('expands menu on click', async () => {
    const user = userEvent.setup()
    render(<GameIdeaButton />)

    await user.click(screen.getByLabelText('Menu'))
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  it('shows info, sound, and language buttons when expanded', async () => {
    const user = userEvent.setup()
    render(<GameIdeaButton />)

    await user.click(screen.getByLabelText('Menu'))
    expect(screen.getByLabelText('How to Play')).toBeInTheDocument()
    expect(screen.getByLabelText('Mute sounds')).toBeInTheDocument()
  })

  it('shows language toggle button', async () => {
    const user = userEvent.setup()
    render(<GameIdeaButton />)

    await user.click(screen.getByLabelText('Menu'))
    // In English, the language toggle shows Arabic text
    expect(screen.getByTitle('عربي')).toBeInTheDocument()
  })

  it('opens How to Play dialog', async () => {
    const user = userEvent.setup()
    render(<GameIdeaButton />)

    await user.click(screen.getByLabelText('Menu'))
    await user.click(screen.getByLabelText('How to Play'))

    expect(screen.getByRole('dialog', { name: 'How to Play' })).toBeInTheDocument()
    expect(screen.getByText('What is it?')).toBeInTheDocument()
    expect(screen.getByText('How it works')).toBeInTheDocument()
    expect(screen.getByText('Rules')).toBeInTheDocument()
    expect(screen.getByText('Tips')).toBeInTheDocument()
  })

  it('closes How to Play dialog with Got it! button', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<GameIdeaButton />)

    await user.click(screen.getByLabelText('Menu'))
    await user.click(screen.getByLabelText('How to Play'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByText('Got it!'))
    vi.advanceTimersByTime(300)
    vi.useRealTimers()

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('collapses menu on second click', async () => {
    const user = userEvent.setup()
    render(<GameIdeaButton />)

    await user.click(screen.getByLabelText('Menu'))
    expect(screen.getByLabelText('Close')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Close'))
    expect(screen.getByLabelText('Menu')).toBeInTheDocument()
  })

  it('has aria-expanded attribute', async () => {
    const user = userEvent.setup()
    render(<GameIdeaButton />)

    const fab = screen.getByLabelText('Menu')
    expect(fab).toHaveAttribute('aria-expanded', 'false')

    await user.click(fab)
    expect(screen.getByLabelText('Close')).toHaveAttribute('aria-expanded', 'true')
  })
})
