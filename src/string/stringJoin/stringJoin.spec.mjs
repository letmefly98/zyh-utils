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
    expect(stringJoin('/', null, undefined)).toBe('null/undefined')
    expect(stringJoin('/', 'a', '', 'b')).toBe('a/b') // 空字符串被清理
  })

  it('other separator', () => {
    expect(stringJoin('-', 'a', 'b', 'c')).toBe('a-b-c')
    expect(stringJoin('&', 'a', 'b', 'c')).toBe('a&b&c')
    expect(stringJoin(',', 'a:1', 'b:2')).toBe('a:1,b:2')
  })

  it('complex case', () => {
    expect(stringJoin('&', 'a=1', 'b=2&c=3')).toBe('a=1&b=2&c=3')
    expect(stringJoin('&', 'a=1', '&b=2&c=3')).toBe('a=1&b=2&c=3')
    expect(stringJoin('&', 'a=1', 'b=2&', '&c=3&')).toBe('a=1&b=2&c=3&')
  })

  it('consecutive separators', () => {
    // 连续分隔符会被清理
    expect(stringJoin('/', 'a//', '//b')).toBe('a/b')
    expect(stringJoin('/', 'a///', '///b')).toBe('a/b')
  })

  it('preserve edge separator', () => {
    // 保留首个字符串开头的分隔符
    expect(stringJoin('/', '/a', 'b')).toBe('/a/b')
    expect(stringJoin('/', '/a/', '/b/')).toBe('/a/b/')
  })

  it('multi-char separator', () => {
    expect(stringJoin('::', 'a', 'b', 'c')).toBe('a::b::c')
    expect(stringJoin('::', 'a::', '::b')).toBe('a::b')
    expect(stringJoin('::', 'a::::', '::::b')).toBe('a::b')
  })
})
