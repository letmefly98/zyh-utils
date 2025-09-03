import { describe, expect, it } from 'vitest'
import { getLength } from './getLength.mjs'

describe('getLength', () => {
  it('normal string case', () => {
    expect(getLength('abc')).toBe(3)
    expect('𠮷'.length).toBe(2)
    expect(getLength('𠮷')).toBe(1)
    expect('😃'.length).toBe(2)
    expect(getLength('😃')).toBe(1)
    expect('👨‍👩‍👦'.length).toBe(8)
    expect(getLength('👨‍👩‍👦')).toBe(5) // ??
  })

  it('normal array case', () => {
    expect(getLength([])).toBe(0)
    expect(getLength([1, 'a', undefined])).toBe(3)
    expect(getLength(Array.from({ length: 5 }))).toBe(5)
    // eslint-disable-next-line unicorn/no-new-array
    expect(getLength(new Array(5))).toBe(0)
  })

  it('normal object case', () => {
    expect(getLength({})).toBe(0)
    expect(getLength({ a: 1, b: 2 })).toBe(2)
  })
})
