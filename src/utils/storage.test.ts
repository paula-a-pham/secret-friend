import { describe, it, expect } from 'vitest'
import { loadGame, saveGame, clearGame } from './storage'
import type { GameState } from '../types'

const mockGame: GameState = {
  phase: 'draw',
  participants: ['Alice', 'Bob', 'Carol'],
  pin: '1234',
  assignments: { Alice: 'Bob' },
  drawn: ['Alice'],
  pool: ['Carol'],
}

describe('storage', () => {
  it('loadGame returns null when nothing is saved', () => {
    expect(loadGame()).toBeNull()
  })

  it('saveGame and loadGame round-trip correctly', () => {
    saveGame(mockGame)
    const loaded = loadGame()
    expect(loaded).toEqual(mockGame)
  })

  it('clearGame removes the saved game', () => {
    saveGame(mockGame)
    expect(loadGame()).not.toBeNull()
    clearGame()
    expect(loadGame()).toBeNull()
  })

  it('loadGame returns null for invalid JSON', () => {
    localStorage.setItem('secret-friend-game', 'not-json{{{')
    expect(loadGame()).toBeNull()
  })

  it('saveGame overwrites previous save', () => {
    saveGame(mockGame)
    const updated = { ...mockGame, pin: '5678' }
    saveGame(updated)
    expect(loadGame()!.pin).toBe('5678')
  })
})
