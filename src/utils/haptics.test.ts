import { describe, it, expect, vi } from 'vitest'
import { tapVibrate, revealVibrate, successVibrate } from './haptics'

describe('haptics', () => {
  it('tapVibrate calls navigator.vibrate with 10', () => {
    const spy = vi.spyOn(navigator, 'vibrate')
    tapVibrate()
    expect(spy).toHaveBeenCalledWith(10)
  })

  it('revealVibrate calls navigator.vibrate with pattern', () => {
    const spy = vi.spyOn(navigator, 'vibrate')
    revealVibrate()
    expect(spy).toHaveBeenCalledWith([30, 50, 30])
  })

  it('successVibrate calls navigator.vibrate with pattern', () => {
    const spy = vi.spyOn(navigator, 'vibrate')
    successVibrate()
    expect(spy).toHaveBeenCalledWith([50, 30, 50, 30, 100])
  })
})
