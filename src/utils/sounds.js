let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playNote(freq, duration, volume = 0.1, type = 'sine', delay = 0) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, c.currentTime + delay)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration)
    osc.start(c.currentTime + delay)
    osc.stop(c.currentTime + delay + duration)
  } catch {
    // Audio not supported
  }
}

// Throttled tick — at most once per 120ms to avoid flooding the audio graph
let lastTick = 0
export function playTick() {
  const now = performance.now()
  if (now - lastTick < 120) return
  lastTick = now
  playNote(800, 0.04, 0.06)
}

export function playReveal() {
  playNote(523, 0.25, 0.1, 'sine', 0)
  playNote(659, 0.25, 0.1, 'sine', 0.12)
  playNote(784, 0.3, 0.12, 'sine', 0.24)
}

export function playFlip() {
  playNote(400, 0.1, 0.05)
}

export function playSuccess() {
  playNote(523, 0.15, 0.08, 'sine', 0)
  playNote(659, 0.15, 0.08, 'sine', 0.1)
  playNote(784, 0.15, 0.08, 'sine', 0.2)
  playNote(1047, 0.3, 0.1, 'sine', 0.3)
}
