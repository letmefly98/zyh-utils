import { describe, expect, it } from 'vitest'
import { hyphenate } from './hyphenate.mjs'

describe('hyphenate', () => {
  it('normal case', () => {
    expect(hyphenate('abc')).toBe('abc')
    expect(hyphenate('fontSize')).toBe('font-size')
  })

  it('unexpect argument', () => {
    expect(hyphenate('')).toBe('')
    expect(hyphenate(undefined)).toBe('undefined')
    expect(hyphenate(null)).toBe('null')
    expect(hyphenate(Number.NaN)).toBe('na-n')
    expect(hyphenate(1)).toBe('1')
  })

  it('special input case', () => {
    expect(hyphenate('AbC')).toBe('ab-c')
    expect(hyphenate('aBC')).toBe('a-b-c')
    expect(hyphenate('ABC')).toBe('a-b-c')
    expect(hyphenate('Font')).toBe('font')
    expect(hyphenate('fonT')).toBe('fon-t')
    expect(hyphenate('FontSize')).toBe('font-size')
  })
})
