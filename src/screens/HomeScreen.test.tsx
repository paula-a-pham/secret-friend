import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render, userEvent } from '../test/test-utils'
import HomeScreen from './HomeScreen'

describe('HomeScreen', () => {
  const defaultProps = {
    onNewGame: vi.fn(),
    onContinue: vi.fn(),
    onReset: vi.fn(),
    hasSavedGame: false,
  }

  it('renders the title and tagline', () => {
    render(<HomeScreen {...defaultProps} />)
    expect(screen.getByText('Secret Friend')).toBeInTheDocument()
    expect(screen.getByText('Draw names, exchange gifts, have fun!')).toBeInTheDocument()
  })

  it('renders the start new game button', () => {
    render(<HomeScreen {...defaultProps} />)
    expect(screen.getByText('Start New Game')).toBeInTheDocument()
  })

  it('calls onNewGame when start button clicked', async () => {
    const onNewGame = vi.fn()
    const user = userEvent.setup()
    render(<HomeScreen {...defaultProps} onNewGame={onNewGame} />)

    await user.click(screen.getByText('Start New Game'))
    expect(onNewGame).toHaveBeenCalled()
  })

  it('shows continue and reset when saved game exists', () => {
    render(<HomeScreen {...defaultProps} hasSavedGame={true} />)
    expect(screen.getByText('Continue Game')).toBeInTheDocument()
    expect(screen.getByText('Reset Everything')).toBeInTheDocument()
  })

  it('hides continue and reset when no saved game', () => {
    render(<HomeScreen {...defaultProps} hasSavedGame={false} />)
    expect(screen.queryByText('Continue Game')).not.toBeInTheDocument()
    expect(screen.queryByText('Reset Everything')).not.toBeInTheDocument()
  })

  it('calls onContinue when continue button clicked', async () => {
    const onContinue = vi.fn()
    const user = userEvent.setup()
    render(<HomeScreen {...defaultProps} hasSavedGame={true} onContinue={onContinue} />)

    await user.click(screen.getByText('Continue Game'))
    expect(onContinue).toHaveBeenCalled()
  })

  it('shows confirmation dialog on reset click', async () => {
    const user = userEvent.setup()
    render(<HomeScreen {...defaultProps} hasSavedGame={true} />)

    await user.click(screen.getByText('Reset Everything'))
    expect(screen.getByText('This will delete your saved game. Are you sure?')).toBeInTheDocument()
  })

  it('has navigation landmark', () => {
    render(<HomeScreen {...defaultProps} />)
    expect(screen.getByRole('navigation', { name: 'Game options' })).toBeInTheDocument()
  })
})
