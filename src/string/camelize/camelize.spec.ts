import { describe, expect, it } from 'vitest'
import { camelize } from './camelize.mjs'

describe('camelize', () => {
  it('normal case', () => {
    expect(camelize('abc')).toBe('abc')
    expect(camelize('font-size')).toBe('fontSize')
  })

  it('unexpect argument', () => {
    expect(camelize('')).toBe('')
    expect(camelize(null as unknown as string)).toBe('null')
    expect(camelize(1 as unknown as string)).toBe('1')
  })

  it('special input case', () => {
    expect(camelize('font-')).toBe('font-')
    expect(camelize('-font')).toBe('Font')
  })
})
