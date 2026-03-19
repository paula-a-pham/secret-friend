import type { Assignments } from '../types'

export function getAvailableRecipients(pool: string[], currentPerson: string, assignments: Assignments): string[] {
  const alreadyAssigned = new Set(Object.values(assignments))
  return pool.filter((p) => p !== currentPerson && !alreadyAssigned.has(p))
}

export function drawRandom(available: string[]): string | null {
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

export function performSwap(assignments: Assignments, currentPerson: string): { drawnName: string; updatedAssignments: Assignments } | null {
  const givers = Object.keys(assignments)
  if (givers.length === 0) return null

  const swapWith = givers[Math.floor(Math.random() * givers.length)]
  const theirRecipient = assignments[swapWith]

  return {
    drawnName: theirRecipient,
    updatedAssignments: {
      ...assignments,
      [swapWith]: currentPerson,
    },
  }
}
