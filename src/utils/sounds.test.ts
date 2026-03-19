import { describe, it, expect, beforeEach } from 'vitest'
import { isMuted, toggleMute } from './sounds'

describe('sounds', () => {
  beforeEach(() => {
    // Reset muted state by toggling if needed
    while (isMuted()) toggleMute()
  })

  it('starts unmuted by default', () => {
    expect(isMuted()).toBe(false)
  })

  it('toggleMute toggles the muted state', () => {
    expect(isMuted()).toBe(false)
    const result = toggleMute()
    expect(result).toBe(true)
    expect(isMuted()).toBe(true)
  })

  it('toggleMute persists to localStorage', () => {
    toggleMute() // mute
    expect(localStorage.getItem('soundMuted')).toBe('true')
    toggleMute() // unmute
    expect(localStorage.getItem('soundMuted')).toBe('false')
  })

  it('double toggle returns to original state', () => {
    toggleMute()
    toggleMute()
    expect(isMuted()).toBe(false)
  })
})
