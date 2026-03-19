import { describe, it, expect, vi } from 'vitest'
import { getAvailableRecipients, drawRandom, performSwap } from './draw'

describe('getAvailableRecipients', () => {
  it('excludes the current person from the pool', () => {
    const result = getAvailableRecipients(['Alice', 'Bob', 'Carol'], 'Alice', {})
    expect(result).toEqual(['Bob', 'Carol'])
  })

  it('excludes already-assigned recipients', () => {
    // Carol is already assigned as a recipient, so she's excluded
    const result = getAvailableRecipients(
      ['Alice', 'Bob', 'Carol', 'Dave'],
      'Alice',
      { Bob: 'Carol' }
    )
    expect(result).toEqual(['Bob', 'Dave'])
  })

  it('returns empty array when no valid recipients', () => {
    const result = getAvailableRecipients(
      ['Alice', 'Bob'],
      'Alice',
      { Carol: 'Bob' }
    )
    expect(result).toEqual([])
  })

  it('handles empty pool', () => {
    expect(getAvailableRecipients([], 'Alice', {})).toEqual([])
  })

  it('handles all participants already assigned', () => {
    const result = getAvailableRecipients(
      ['Alice', 'Bob', 'Carol'],
      'Alice',
      { Dave: 'Bob', Eve: 'Carol' }
    )
    expect(result).toEqual([])
  })
})

describe('drawRandom', () => {
  it('returns null for empty array', () => {
    expect(drawRandom([])).toBeNull()
  })

  it('returns the only element for single-element array', () => {
    expect(drawRandom(['Alice'])).toBe('Alice')
  })

  it('returns an element from the array', () => {
    const pool = ['Alice', 'Bob', 'Carol']
    const result = drawRandom(pool)
    expect(pool).toContain(result)
  })

  it('uses Math.random for selection', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const result = drawRandom(['A', 'B', 'C'])
    expect(result).toBe('B') // floor(0.5 * 3) = 1
    vi.restoreAllMocks()
  })
})

describe('performSwap', () => {
  it('returns null when no existing assignments', () => {
    expect(performSwap({}, 'Alice')).toBeNull()
  })

  it('swaps the current person with an existing giver', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // picks first giver
    const result = performSwap({ Bob: 'Carol' }, 'Alice')

    expect(result).not.toBeNull()
    expect(result!.drawnName).toBe('Carol') // Alice gets Bob's recipient
    expect(result!.updatedAssignments.Bob).toBe('Alice') // Bob now gives to Alice
    vi.restoreAllMocks()
  })

  it('preserves other assignments during swap', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const result = performSwap(
      { Bob: 'Carol', Dave: 'Eve' },
      'Alice'
    )

    expect(result!.updatedAssignments.Dave).toBe('Eve') // unchanged
    expect(result!.updatedAssignments.Bob).toBe('Alice') // swapped
    expect(result!.drawnName).toBe('Carol')
    vi.restoreAllMocks()
  })
})
