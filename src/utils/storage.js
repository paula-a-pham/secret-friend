const STORAGE_KEY = 'secret-friend-game'

export function loadGame() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveGame(game) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
  } catch {
    // Storage full or unavailable
  }
}

export function clearGame() {
  localStorage.removeItem(STORAGE_KEY)
}
