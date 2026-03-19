export type GamePhase = 'home' | 'setup-pin' | 'setup-players' | 'draw' | 'results'

export interface Assignments {
  [giver: string]: string
}

export interface GameState {
  phase: GamePhase
  participants: string[]
  pin: string
  assignments: Assignments
  drawn: string[]
  pool: string[]
  _hasSave?: boolean
  _fromResults?: boolean
}
