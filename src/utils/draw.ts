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
  // Filter out givers whose recipient is currentPerson — swapping with them
  // would cause currentPerson to draw themselves
  const eligible = givers.filter((g) => assignments[g] !== currentPerson)
  if (eligible.length === 0) return null

  const swapWith = eligible[Math.floor(Math.random() * eligible.length)]
  const theirRecipient = assignments[swapWith]

  return {
    drawnName: theirRecipient,
    updatedAssignments: {
      ...assignments,
      [swapWith]: currentPerson,
    },
  }
}
