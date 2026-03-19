import type { GameState } from '../types'

const STORAGE_KEY = 'secret-friend-game'

export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveGame(game: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
  } catch {
    // Storage full or unavailable
  }
}

export function clearGame(): void {
  localStorage.removeItem(STORAGE_KEY)
}
