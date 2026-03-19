import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock AudioContext at the module level before importing sounds
const mockOscillator = () => ({
  connect: vi.fn(),
  type: 'sine' as OscillatorType,
  frequency: { value: 0 },
  start: vi.fn(),
  stop: vi.fn(),
})

const mockGainNode = () => ({
  connect: vi.fn(),
  gain: {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
})

let oscillators: ReturnType<typeof mockOscillator>[] = []
let gainNodes: ReturnType<typeof mockGainNode>[] = []
let mockResume: ReturnType<typeof vi.fn>
let mockState: string

function installMockAudioContext() {
  oscillators = []
  gainNodes = []
  mockResume = vi.fn()
  mockState = 'running'

  const MockAudioContext = vi.fn(function (this: Record<string, unknown>) {
    this.currentTime = 0
    this.destination = {}
    this.resume = mockResume
    Object.defineProperty(this, 'state', {
      get: () => mockState,
      configurable: true,
    })
    this.createOscillator = vi.fn(() => {
      const osc = mockOscillator()
      oscillators.push(osc)
      return osc
    })
    this.createGain = vi.fn(() => {
      const gain = mockGainNode()
      gainNodes.push(gain)
      return gain
    })
  })

  vi.stubGlobal('AudioContext', MockAudioContext)
}

describe('sounds', () => {
  beforeEach(async () => {
    // Reset modules to clear cached AudioContext and muted state
    vi.resetModules()
    installMockAudioContext()
  })

  it('starts unmuted by default', async () => {
    const { isMuted } = await import('./sounds')
    expect(isMuted()).toBe(false)
  })

  it('toggleMute toggles the muted state', async () => {
    const { isMuted, toggleMute } = await import('./sounds')
    expect(isMuted()).toBe(false)
    const result = toggleMute()
    expect(result).toBe(true)
    expect(isMuted()).toBe(true)
  })

  it('toggleMute persists to localStorage', async () => {
    const { toggleMute } = await import('./sounds')
    toggleMute() // mute
    expect(localStorage.getItem('soundMuted')).toBe('true')
    toggleMute() // unmute
    expect(localStorage.getItem('soundMuted')).toBe('false')
  })

  it('double toggle returns to original state', async () => {
    const { isMuted, toggleMute } = await import('./sounds')
    toggleMute()
    toggleMute()
    expect(isMuted()).toBe(false)
  })

  describe('playTick', () => {
    it('creates an oscillator when not muted', async () => {
      const { playTick } = await import('./sounds')
      playTick()
      expect(oscillators).toHaveLength(1)
      expect(gainNodes).toHaveLength(1)
    })

    it('connects oscillator to gain and gain to destination', async () => {
      const { playTick } = await import('./sounds')
      playTick()
      expect(oscillators[0].connect).toHaveBeenCalledWith(gainNodes[0])
      expect(gainNodes[0].connect).toHaveBeenCalled()
    })

    it('does not create extra oscillators when called rapidly within 120ms', async () => {
      const { playTick } = await import('./sounds')
      vi.spyOn(performance, 'now').mockReturnValue(1000)
      playTick()
      expect(oscillators).toHaveLength(1)

      // Second call within 120ms should be throttled
      vi.spyOn(performance, 'now').mockReturnValue(1050)
      playTick()
      expect(oscillators).toHaveLength(1)

      // Third call at boundary should still be throttled
      vi.spyOn(performance, 'now').mockReturnValue(1119)
      playTick()
      expect(oscillators).toHaveLength(1)
    })

    it('allows a new oscillator after 120ms have passed', async () => {
      const { playTick } = await import('./sounds')
      vi.spyOn(performance, 'now').mockReturnValue(1000)
      playTick()
      expect(oscillators).toHaveLength(1)

      vi.spyOn(performance, 'now').mockReturnValue(1120)
      playTick()
      expect(oscillators).toHaveLength(2)
    })
  })

  describe('playReveal', () => {
    it('creates multiple oscillators for the melody', async () => {
      const { playReveal } = await import('./sounds')
      playReveal()
      expect(oscillators).toHaveLength(3)
      expect(gainNodes).toHaveLength(3)
    })

    it('connects each oscillator to its own gain node', async () => {
      const { playReveal } = await import('./sounds')
      playReveal()
      for (let i = 0; i < 3; i++) {
        expect(oscillators[i].connect).toHaveBeenCalledWith(gainNodes[i])
        expect(gainNodes[i].connect).toHaveBeenCalled()
      }
    })
  })

  describe('playFlip', () => {
    it('creates an oscillator when not muted', async () => {
      const { playFlip } = await import('./sounds')
      playFlip()
      expect(oscillators).toHaveLength(1)
      expect(gainNodes).toHaveLength(1)
    })

    it('connects oscillator to gain and gain to destination', async () => {
      const { playFlip } = await import('./sounds')
      playFlip()
      expect(oscillators[0].connect).toHaveBeenCalledWith(gainNodes[0])
      expect(gainNodes[0].connect).toHaveBeenCalled()
    })
  })

  describe('playSuccess', () => {
    it('creates multiple oscillators for the success melody', async () => {
      const { playSuccess } = await import('./sounds')
      playSuccess()
      expect(oscillators).toHaveLength(4)
      expect(gainNodes).toHaveLength(4)
    })

    it('connects each oscillator to its own gain node', async () => {
      const { playSuccess } = await import('./sounds')
      playSuccess()
      for (let i = 0; i < 4; i++) {
        expect(oscillators[i].connect).toHaveBeenCalledWith(gainNodes[i])
        expect(gainNodes[i].connect).toHaveBeenCalled()
      }
    })
  })

  describe('muted behavior', () => {
    it('playTick does not create an oscillator when muted', async () => {
      const { toggleMute, playTick } = await import('./sounds')
      toggleMute()
      playTick()
      expect(oscillators).toHaveLength(0)
    })

    it('playReveal does not create oscillators when muted', async () => {
      const { toggleMute, playReveal } = await import('./sounds')
      toggleMute()
      playReveal()
      expect(oscillators).toHaveLength(0)
    })

    it('playFlip does not create an oscillator when muted', async () => {
      const { toggleMute, playFlip } = await import('./sounds')
      toggleMute()
      playFlip()
      expect(oscillators).toHaveLength(0)
    })

    it('playSuccess does not create oscillators when muted', async () => {
      const { toggleMute, playSuccess } = await import('./sounds')
      toggleMute()
      playSuccess()
      expect(oscillators).toHaveLength(0)
    })
  })

  describe('error handling', () => {
    it('playTick does not throw when AudioContext is unavailable', async () => {
      vi.stubGlobal('AudioContext', undefined)
      const { playTick } = await import('./sounds')
      expect(() => playTick()).not.toThrow()
    })

    it('playReveal does not throw when AudioContext is unavailable', async () => {
      vi.stubGlobal('AudioContext', undefined)
      const { playReveal } = await import('./sounds')
      expect(() => playReveal()).not.toThrow()
    })

    it('playFlip does not throw when AudioContext is unavailable', async () => {
      vi.stubGlobal('AudioContext', undefined)
      const { playFlip } = await import('./sounds')
      expect(() => playFlip()).not.toThrow()
    })

    it('playSuccess does not throw when AudioContext is unavailable', async () => {
      vi.stubGlobal('AudioContext', undefined)
      const { playSuccess } = await import('./sounds')
      expect(() => playSuccess()).not.toThrow()
    })
  })

  describe('AudioContext lazy creation', () => {
    it('resumes a suspended AudioContext', async () => {
      mockState = 'suspended'
      const { playFlip } = await import('./sounds')
      playFlip()
      expect(mockResume).toHaveBeenCalled()
    })
  })
})
