import { describe, expect, it } from 'vitest'
import { camelize } from './camelize.mjs'

describe('camelize', () => {
  it('normal case', () => {
    expect(camelize('abc')).toBe('abc')
    expect(camelize('font-size')).toBe('fontSize')
  })

  it('unexpect argument', () => {
    expect(camelize('')).toBe('')
    expect(camelize(undefined)).toBe('undefined')
    expect(camelize(null)).toBe('null')
    expect(camelize(Number.NaN)).toBe('nan')
    expect(camelize(1)).toBe('1')
  })

  it('special input case', () => {
    expect(camelize('font-')).toBe('font-')
    expect(camelize('-font')).toBe('Font')
    expect(camelize('a--b')).toBe('a-B')
  })
})
