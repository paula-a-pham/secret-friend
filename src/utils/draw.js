export function getAvailableRecipients(pool, currentPerson, assignments) {
  // Belt and suspenders: pool should be correct, but also
  // exclude anyone who is already assigned as someone's secret friend
  const alreadyAssigned = new Set(Object.values(assignments))
  return pool.filter((p) => p !== currentPerson && !alreadyAssigned.has(p))
}

export function drawRandom(available) {
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

export function performSwap(assignments, currentPerson) {
  // Last person can only draw themselves — swap with a random previous giver
  const givers = Object.keys(assignments)
  if (givers.length === 0) return null

  const swapWith = givers[Math.floor(Math.random() * givers.length)]
  const theirRecipient = assignments[swapWith]

  // swapWith now gets currentPerson, currentPerson gets theirRecipient
  return {
    drawnName: theirRecipient,
    updatedAssignments: {
      ...assignments,
      [swapWith]: currentPerson,
    },
  }
}
