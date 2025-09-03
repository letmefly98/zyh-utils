import { describe, expect, it } from 'vitest'
import { stringJoin } from './stringJoin.mjs'

describe('hyphenate', () => {
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
    expect(stringJoin('/', 1 as unknown as string, 2 as unknown as string)).toBe('1/2')
  })

  it('other separator', () => {
    expect(stringJoin('-', 'a', 'b', 'c')).toBe('a-b-c')
    expect(stringJoin('&', 'a', 'b', 'c')).toBe('a&b&c')
  })

  it('complex case', () => {
    expect(stringJoin('&', 'a=1', '&b=2&c=3')).toBe('a=1&b=2&c=3')
  })
})
