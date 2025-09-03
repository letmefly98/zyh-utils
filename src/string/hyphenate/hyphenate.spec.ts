import { describe, expect, it } from 'vitest'
import { hyphenate } from './hyphenate.mjs'

describe('hyphenate', () => {
  it('normal case', () => {
    expect(hyphenate('abc')).toBe('abc')
    expect(hyphenate('fontSize')).toBe('font-size')
  })

  it('unexpect argument', () => {
    expect(hyphenate('')).toBe('')
    expect(hyphenate(null as unknown as string)).toBe('null')
    expect(hyphenate(1 as unknown as string)).toBe('1')
  })

  it('special input case', () => {
    expect(hyphenate('Font')).toBe('font')
    expect(hyphenate('fonT')).toBe('fon-t')
    expect(hyphenate('FontSize')).toBe('font-size')
  })
})
