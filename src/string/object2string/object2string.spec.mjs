import { describe, expect, it } from 'vitest'
import { object2string } from './object2string.mjs'

describe('object2string', () => {
  it('normal case', () => {
    expect(object2string({ a: 1, b: 2 })).toBe('a=1&b=2')
    expect(object2string({ a: 1, b: 2 }, ',')).toBe('a=1,b=2')
    expect(object2string({ a: 1, b: 2 }, ',', ':')).toBe('a:1,b:2')
    expect(object2string({ a: 1, b: 2 }, ' ', '=>')).toBe('a=>1 b=>2')
  })

  it('unexpect object value', () => {
    expect(object2string({ a: undefined, b: 2 })).toBe('a=&b=2')
    expect(object2string({ a: null, b: 2 })).toBe('a=&b=2')
    expect(object2string({ a: Number.NaN, b: 2 })).toBe('a=&b=2')
    expect(object2string({ a: [0, 1], b: 2 })).toBe('a=0,1&b=2')
    expect(object2string({ a: 'x=1', b: 2 })).toBe('a=x%3D1&b=2')
    expect(object2string({ a: ['x:1', 'y=2'], b: 2 })).toBe('a=x%3A1,y%3D2&b=2')
    expect(object2string({ a: { x: 1 }, b: 2 })).toBe('a=%7B%22x%22%3A1%7D&b=2')
  })

  it('unexpect object argument', () => {
    expect(object2string(undefined)).toBe('')
    expect(object2string(null)).toBe('')
    expect(object2string(Number.NaN)).toBe('')
    expect(object2string(1)).toBe('')
    expect(object2string([1, 2])).toBe('0=1&1=2')
  })

  it('unexpect divide argument', () => {
    expect(object2string({ a: 1, b: 2 }, 1)).toBe('a=11b=2')
    expect(object2string({ a: 1, b: 2 }, Number.NaN)).toBe('a=1NaNb=2')
    expect(object2string({ a: 1, b: 2 }, null)).toBe('a=1nullb=2')
  })

  it('unexpect concat argument', () => {
    expect(object2string({ a: 1, b: 2 }, undefined, 1)).toBe('a11&b12')
    expect(object2string({ a: 1, b: 2 }, undefined, Number.NaN)).toBe('aNaN1&bNaN2')
    expect(object2string({ a: 1, b: 2 }, undefined, null)).toBe('anull1&bnull2')
  })
})
