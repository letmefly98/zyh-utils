import { describe, expect, it } from 'vitest'
import { createNumberArray } from './createNumberArray.mjs'

describe('createNumberArray', () => {
  it('normal case', () => {
    expect(createNumberArray(3)).toEqual([0, 1, 2])
    expect(createNumberArray(3, 10)).toEqual([10, 11, 12])
  })

  it('unexpected length argument', async () => {
    expect(createNumberArray(undefined)).toEqual([])
    expect(createNumberArray(null)).toEqual([])
    expect(createNumberArray(Number.NaN)).toEqual([])
    expect(createNumberArray('abc')).toEqual([])
    expect(createNumberArray('3')).toEqual([0, 1, 2])
  })

  it('unexpected start argument', async () => {
    expect(createNumberArray(3, null)).toEqual([0, 1, 2])
    expect(createNumberArray(3, Number.NaN)).toEqual([Number.NaN, Number.NaN, Number.NaN])
    expect(createNumberArray(3, 'abc')).toEqual(['abc0', 'abc1', 'abc2'])
    expect(createNumberArray(3, '3')).toEqual(['30', '31', '32'])
  })
})
