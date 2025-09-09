import { describe, expect, it } from 'vitest'
import { string2object } from './string2object.mjs'

describe('string2object', () => {
  it('normal case', () => {
    expect(string2object('')).toEqual({})
    expect(string2object('a=b')).toEqual({ a: 'b' })
    expect(string2object('a=x&b=1e10')).toEqual({ a: 'x', b: 1e10 })
    expect(string2object('x=&a=true&b=null&c=undefined&d=false')).toEqual({ x: '', a: true, b: null, c: undefined, d: false })
    expect(string2object('a=1 &b= 2& &c=3')).toEqual({ a: 1, b: 2, c: 3 })
    expect(string2object('a=1=1&b=2')).toEqual({ a: '1=1', b: 2 })
    expect(string2object('&b=2')).toStrictEqual({ b: 2 })
    expect(string2object('=1&b=2')).toStrictEqual({ '': 1, 'b': 2 })
  })

  it('use divide and concat argument', () => {
    expect(string2object('a=x,b=1', ',')).toEqual({ a: 'x', b: 1 })
    expect(string2object('a:x,b:1', ',', ':')).toEqual({ a: 'x', b: 1 })
    expect(string2object('a=>x b=>1', ' ', '=>')).toEqual({ a: 'x', b: 1 })
  })

  it('same key case', () => {
    expect(string2object('a=x&a=1')).toEqual({ a: 1 })
    expect(string2object('a=1&a=x')).toEqual({ a: 'x' })
  })

  it('unexpected string argument', async () => {
    expect(string2object(123)).toEqual({})
    expect(string2object({})).toEqual({})
    expect(string2object([])).toEqual({})
    expect(string2object(() => {})).toEqual({})
    expect(string2object(null)).toEqual({})
    expect(string2object(undefined)).toEqual({})
    expect(string2object(true)).toEqual({})
  })

  it('unexpect divide argument', () => {
    expect(() => string2object('a=x&b=1', 2)).toThrowError('divide must be a string')
    expect(() => string2object('a=x&b=1', null)).toThrowError('divide must be a string')
    expect(() => string2object('a=x&b=1', Number.NaN)).toThrowError('divide must be a string')
  })

  it('unexpect concat argument', () => {
    expect(() => string2object('a=x&b=1', '&', 2)).toThrowError('concat must be a string')
    expect(() => string2object('a=x&b=1', '&', null)).toThrowError('concat must be a string')
    expect(() => string2object('a=x&b=1', '&', Number.NaN)).toThrowError('concat must be a string')
  })
})
