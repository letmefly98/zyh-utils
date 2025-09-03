import { describe, expect, it } from 'vitest'
import { stringJoin } from './stringJoin.mjs'

describe('stringJoin', () => {
  it('normal case', () => {
    expect(stringJoin('/', 'a', 'b', 'c')).toBe('a/b/c')
    expect(stringJoin('/', 'a/', 'b')).toBe('a/b')
    expect(stringJoin('/', 'a', '/b')).toBe('a/b')
    expect(stringJoin('/', 'a/', '/b')).toBe('a/b')
    expect(stringJoin('/', 'a/', '/b/')).toBe('a/b/')
  })

  it('unexpect argument', () => {
    expect(stringJoin()).toBe('')
    expect(stringJoin('abc')).toBe('')
    expect(stringJoin('/')).toBe('')
    expect(stringJoin('/', 1, 2)).toBe('1/2')
  })

  it('other separator', () => {
    expect(stringJoin('-', 'a', 'b', 'c')).toBe('a-b-c')
    expect(stringJoin('&', 'a', 'b', 'c')).toBe('a&b&c')
    expect(stringJoin(',', 'a:1', 'b:2')).toBe('a:1,b:2')
  })

  it('complex case', () => {
    expect(stringJoin('&', 'a=1', '&b=2&c=3')).toBe('a=1&b=2&c=3')
  })
})
