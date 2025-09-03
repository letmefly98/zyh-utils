import { describe, expect, it } from 'vitest'
import { typeOf } from './typeOf.mjs'

describe('typeOf', () => {
  it('normal case', () => {
    expect(typeOf('/')).toBe('string')
    expect(typeOf(1)).toBe('number')
    expect(typeOf(true)).toBe('boolean')
    expect(typeOf(null)).toBe('null')
    expect(typeOf(undefined)).toBe('undefined')
    expect(typeOf(Symbol('foo'))).toBe('symbol')
    expect(typeOf(new Date())).toBe('date')
    expect(typeOf(/ab/)).toBe('regexp')
    expect(typeOf({})).toBe('object')
    expect(typeOf([])).toBe('array')
  })
})
