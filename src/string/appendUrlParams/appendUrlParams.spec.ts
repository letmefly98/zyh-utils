import { describe, expect, it } from 'vitest'
import { appendUrlParams } from './appendUrlParams'

describe('appendUrlParams', () => {
  it('basic usage', () => {
    expect(appendUrlParams('index.html', 'a=1')).toBe('index.html?a=1')
    expect(appendUrlParams('index.html', { a: 1 })).toBe('index.html?a=1')
  })

  it('append to existing query', () => {
    expect(appendUrlParams('index.html?x=0', 'a=1')).toBe('index.html?x=0&a=1')
    expect(appendUrlParams('index.html?x=0', { a: 1 })).toBe('index.html?x=0&a=1')
  })

  it('preserve hash', () => {
    expect(appendUrlParams('index.html?x=0#t', 'a=1')).toBe('index.html?x=0&a=1#t')
    expect(appendUrlParams('index.html#t', { a: 1 })).toBe('index.html?a=1#t')
  })

  it('clean useless symbols', () => {
    expect(appendUrlParams('index.html?')).toBe('index.html')
    expect(appendUrlParams('index.html#')).toBe('index.html')
    expect(appendUrlParams('index.html?#')).toBe('index.html')
  })

  it('no params', () => {
    expect(appendUrlParams('index.html')).toBe('index.html')
    expect(appendUrlParams('index.html', null)).toBe('index.html')
    expect(appendUrlParams('index.html', undefined)).toBe('index.html')
  })

  it('invalid params type', () => {
    // @ts-expect-error 测试非法类型
    expect(appendUrlParams('index.html', 1000)).toBe('index.html')
    // @ts-expect-error 测试非法类型
    expect(appendUrlParams('index.html', true)).toBe('index.html')
  })
})
