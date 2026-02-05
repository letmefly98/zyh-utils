import { describe, expect, it } from 'vitest'
import { createArray } from './createArray.mjs'

describe('createArray', () => {
  it('normal case', () => {
    expect(createArray(3)).toEqual([0, 1, 2])
    expect(createArray(3, 10)).toEqual([10, 11, 12])
  })

  it('expected format argument', async () => {
    expect(createArray(2, i => `${i}`)).toEqual(['0', '1'])
    expect(createArray(2, 1, i => `${i}月`)).toEqual(['1月', '2月'])
  })

  it('unexpected length argument', async () => {
    expect(createArray(undefined)).toEqual([])
    expect(createArray(null)).toEqual([])
    expect(createArray(Number.NaN)).toEqual([])
    expect(createArray('abc')).toEqual([])
    expect(createArray('3')).toEqual([0, 1, 2])
  })

  it('unexpected start argument', async () => {
    expect(createArray(3, null)).toEqual([0, 1, 2])
    expect(createArray(3, Number.NaN)).toEqual([Number.NaN, Number.NaN, Number.NaN])
    expect(createArray(3, 'abc')).toEqual(['abc0', 'abc1', 'abc2'])
    expect(createArray(3, '3')).toEqual(['30', '31', '32'])
  })
})
