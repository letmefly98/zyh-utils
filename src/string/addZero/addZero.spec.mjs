import { describe, expect, it } from 'vitest'
import { addZero } from './addZero.mjs'

describe('addZero', () => {
  it('normal case', () => {
    expect(addZero(1)).toBe('01')
    expect(addZero(10)).toBe('10')
    expect(addZero(12, 3)).toBe('012')
    expect(addZero(123, 2)).toBe('123')
    expect(addZero(0)).toBe('00')
  })

  it('unexpected argument', () => {
    expect(addZero(undefined)).toBe('')
    expect(addZero(Number.NaN)).toBe('')
    expect(addZero(null)).toBe('')
    expect(addZero('')).toBe('00')
    expect(addZero('ab')).toBe('ab')
    expect(addZero('ab', 3)).toBe('0ab')
    expect(addZero(12, -1)).toBe('12')
    expect(addZero(12, null)).toBe('12')
  })
})
