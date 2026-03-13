import { describe, expect, it } from 'vitest'
import {
  addDataToUrl,
  jsonToObject,
  objectToString,
} from '../src/data.mjs'

describe('data.mjs', () => {
  it('objectToString', () => {
    expect(objectToString()).toStrictEqual('')
    expect(objectToString({})).toStrictEqual('')
    expect(objectToString({ a: 1 })).toStrictEqual('a=1')
    expect(objectToString({ a: 1, b: 2 })).toStrictEqual('a=1&b=2')
    expect(objectToString({ a: 1, b: 2 }, ';', ':')).toStrictEqual('a:1;b:2')
    expect(objectToString({ a: undefined, b: true })).toStrictEqual('a=undefined&b=true')
    expect(objectToString({ a: null, b: true })).toStrictEqual('a=null&b=true')
  })

  it('addDataToUrl', () => {
    expect(addDataToUrl('index.html')).toStrictEqual('index.html')
    expect(addDataToUrl('index.html?')).toStrictEqual('index.html')
    expect(addDataToUrl('index.html#')).toStrictEqual('index.html')
    expect(addDataToUrl('index.html?#')).toStrictEqual('index.html')
    expect(addDataToUrl('index.html', 'a=1')).toStrictEqual('index.html?a=1')
    expect(addDataToUrl('index.html', { a: 1 })).toStrictEqual('index.html?a=1')
    expect(addDataToUrl('index.html?x=0', 'a=1')).toStrictEqual('index.html?x=0&a=1')
    expect(addDataToUrl('index.html?x=0', { a: 1 })).toStrictEqual('index.html?x=0&a=1')
    expect(addDataToUrl('index.html?x=0#t', 'a=1')).toStrictEqual('index.html?x=0&a=1#t')
    expect(addDataToUrl('index.html', 1000)).toStrictEqual('index.html')
  })

  it('jsonToObject', () => {
    expect(jsonToObject(['a', 'b'])).toStrictEqual({ a: 0, b: 1 })
    expect(jsonToObject([{ name: 'a' }, { name: 'b' }], 'name')).toStrictEqual({ a: { name: 'a' }, b: { name: 'b' } })
    expect(jsonToObject([{ name: 'a', value: 1 }, { name: 'b', value: 2 }], 'name', 'value')).toStrictEqual({ a: 1, b: 2 })
  })
})
