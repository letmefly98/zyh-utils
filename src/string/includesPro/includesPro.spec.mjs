import { describe, expect, it } from 'vitest'
import { includesPro } from './includesPro.mjs'

describe('includesPro', () => {
  it('normal case', () => {
    expect(includesPro('vdr_20250831_203828_777.enc.rdt.gz', 'vdr_')).toBe(true)
    expect(includesPro('vdr_20250831_203828_777.enc.rdt.gz', 'tca_')).toBe(false)
    expect(includesPro('vdr_20250831_203828_777.enc.rdt.gz', ['vdr_', 'tca_'])).toBe(true)
    expect(includesPro('vdr_20250831_203828_777.enc.rdt.gz', ['x', 'y'])).toBe(false)
  })

  it('empty filter case', () => {
    expect(includesPro('abc', undefined)).toBe(true)
    expect(includesPro('abc', [])).toBe(true)
  })

  it('unexpect str argument: ', () => {
    // str is not string will always return false
    expect(includesPro(undefined, 'undefined')).toBe(false)
    expect(includesPro(null, 'null')).toBe(false)
    expect(includesPro(Number.NaN, 'NaN')).toBe(false)
    expect(includesPro(0, '0')).toBe(false)
    expect(includesPro(1, '1')).toBe(false)
  })

  it('unexpect filter argument', () => {
    // single filter will to convert as string.
    expect(includesPro('undefined', undefined)).toBe(true)
    expect(includesPro('abc', null)).toBe(false)
    expect(includesPro('null', null)).toBe(true)
    expect(includesPro('abc', Number.NaN)).toBe(false)
    expect(includesPro('NaN', Number.NaN)).toBe(true)
    expect(includesPro('abc', 0)).toBe(false)
    expect(includesPro('0123', 0)).toBe(true)
    // array filter will base on `str.includes` result
    expect(includesPro('1234', [1, 6])).toBe(true)
    expect(includesPro('1234', [5, 6])).toBe(false)
  })
})
