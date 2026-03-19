import { describe, it, expect } from 'vitest'
import { translations } from './translations'

describe('translations', () => {
  const enKeys = Object.keys(translations.en)
  const arKeys = Object.keys(translations.ar)

  it('has English translations', () => {
    expect(enKeys.length).toBeGreaterThan(0)
  })

  it('has Arabic translations', () => {
    expect(arKeys.length).toBeGreaterThan(0)
  })

  it('Arabic has all English keys', () => {
    const missing = enKeys.filter(k => !arKeys.includes(k))
    expect(missing).toEqual([])
  })

  it('English has all Arabic keys', () => {
    const extra = arKeys.filter(k => !enKeys.includes(k))
    expect(extra).toEqual([])
  })

  it('no empty translation values in English', () => {
    const empty = enKeys.filter(k => !translations.en[k].trim())
    expect(empty).toEqual([])
  })

  it('no empty translation values in Arabic', () => {
    const empty = arKeys.filter(k => !translations.ar[k].trim())
    expect(empty).toEqual([])
  })

  it('placeholder params in English have matching Arabic equivalents', () => {
    for (const key of enKeys) {
      const enParams = translations.en[key].match(/\{(\w+)\}/g) || []
      const arParams = translations.ar[key]?.match(/\{(\w+)\}/g) || []
      if (enParams.length > 0) {
        expect(arParams.sort()).toEqual(enParams.sort())
      }
    }
  })
})
