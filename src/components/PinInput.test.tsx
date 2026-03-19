import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render, userEvent } from '../test/test-utils'
import PinInput from './PinInput'

describe('PinInput', () => {
  it('renders 4 input fields by default', () => {
    const onComplete = vi.fn()
    render(<PinInput onComplete={onComplete} />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(4)
  })

  it('renders custom number of inputs', () => {
    const onComplete = vi.fn()
    render(<PinInput length={6} onComplete={onComplete} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('calls onComplete when all digits entered', async () => {
    const onComplete = vi.fn()
    const user = userEvent.setup()
    render(<PinInput onComplete={onComplete} />)

    const inputs = screen.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.keyboard('1234')

    expect(onComplete).toHaveBeenCalledWith('1234')
  })

  it('rejects non-numeric input', async () => {
    const onComplete = vi.fn()
    const user = userEvent.setup()
    render(<PinInput onComplete={onComplete} />)

    const inputs = screen.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.keyboard('abcd')

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('displays error message', () => {
    const onComplete = vi.fn()
    render(<PinInput onComplete={onComplete} error="Wrong PIN" errorKey={1} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Wrong PIN')
  })

  it('has ARIA labels for each digit', () => {
    const onComplete = vi.fn()
    render(<PinInput onComplete={onComplete} />)
    expect(screen.getByLabelText('PIN digit 1')).toBeInTheDocument()
    expect(screen.getByLabelText('PIN digit 4')).toBeInTheDocument()
  })
})
