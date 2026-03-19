import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render, userEvent } from '../test/test-utils'
import AddPlayersForm from './AddPlayersForm'

describe('AddPlayersForm', () => {
  const defaultProps = {
    existingNames: ['Alice', 'Bob'],
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  it('renders the form with input and buttons', () => {
    render(<AddPlayersForm {...defaultProps} />)
    expect(screen.getByLabelText('Enter a name...')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Add & Draw')).toBeInTheDocument()
  })

  it('adds a new player name', async () => {
    const user = userEvent.setup()
    render(<AddPlayersForm {...defaultProps} />)

    await user.type(screen.getByLabelText('Enter a name...'), 'Carol')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('prevents duplicate names (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<AddPlayersForm {...defaultProps} />)

    await user.type(screen.getByLabelText('Enter a name...'), 'alice')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Name already exists')
  })

  it('disables confirm button when fewer than 2 players', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<AddPlayersForm {...defaultProps} onConfirm={onConfirm} />)

    // Add only 1 player
    await user.type(screen.getByLabelText('Enter a name...'), 'Carol')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByText('Add & Draw')).toBeDisabled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm with names when >= 2 added', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<AddPlayersForm {...defaultProps} onConfirm={onConfirm} />)

    await user.type(screen.getByLabelText('Enter a name...'), 'Carol')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    await user.type(screen.getByLabelText('Enter a name...'), 'Dave')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    await user.click(screen.getByText('Add & Draw'))
    expect(onConfirm).toHaveBeenCalledWith(['Carol', 'Dave'])
  })

  it('calls onCancel when cancel clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<AddPlayersForm {...defaultProps} onCancel={onCancel} />)

    await user.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('can remove an added player', async () => {
    const user = userEvent.setup()
    render(<AddPlayersForm {...defaultProps} />)

    await user.type(screen.getByLabelText('Enter a name...'), 'Carol')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Carol')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Remove Carol'))
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })
})
