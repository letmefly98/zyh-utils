import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { forEachDeep } from './forEachDeep.mjs'

describe('forEachDeep', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const tree = [
    { label: '全部', value: '', children: [
      { label: '项目1', value: 'project1', children: [
        { label: '子项目1', value: 'subProject1' },
        { label: '子项目2', value: 'subProject2' },
      ] },
      { label: '项目2', value: 'project2' },
    ] },
  ]

  it('normal case', async () => {
    const callback = vi.fn()
    forEachDeep(tree, callback)
    expect(callback).toBeCalledTimes(5)
    expect(callback).toHaveBeenNthCalledWith(1, tree[0], 0, 0)
    expect(callback).toHaveBeenNthCalledWith(2, tree[0].children[0], 0, 1)
    expect(callback).toHaveBeenNthCalledWith(3, tree[0].children[0].children[0], 0, 2)
    expect(callback).toHaveBeenNthCalledWith(4, tree[0].children[0].children[1], 1, 2)
    expect(callback).toHaveBeenNthCalledWith(5, tree[0].children[1], 1, 1)
  })

  it('children option', async () => {
    const tree = [{ label: '全部', value: '', items: [{ label: '项目1', value: 'project1' }] }]
    const callback = vi.fn()
    forEachDeep(tree, callback, { children: 'items' })
    expect(callback).toBeCalledTimes(2)
    expect(callback).toHaveBeenNthCalledWith(1, tree[0], 0, 0)
    expect(callback).toHaveBeenNthCalledWith(2, tree[0].items[0], 0, 1)
  })

  it('depth option', async () => {
    const callback1 = vi.fn()
    forEachDeep(tree, callback1, { depth: 0 })
    expect(callback1).toBeCalledTimes(1)
    expect(callback1).toHaveBeenNthCalledWith(1, tree[0], 0, 0)

    const callback2 = vi.fn()
    forEachDeep(tree, callback2, { depth: 1 })
    expect(callback2).toBeCalledTimes(3)
    expect(callback1).toHaveBeenNthCalledWith(1, tree[0], 0, 0)
    expect(callback2).toHaveBeenNthCalledWith(2, tree[0].children[0], 0, 1)
    expect(callback2).toHaveBeenNthCalledWith(3, tree[0].children[1], 1, 1)
  })

  it('firstly option', async () => {
    const callback = vi.fn()
    forEachDeep(tree, callback, { firstly: 'child' })
    expect(callback).toBeCalledTimes(5)
    expect(callback).toHaveBeenNthCalledWith(1, tree[0].children[0].children[0], 0, 2)
    expect(callback).toHaveBeenNthCalledWith(2, tree[0].children[0].children[1], 1, 2)
    expect(callback).toHaveBeenNthCalledWith(3, tree[0].children[0], 0, 1)
    expect(callback).toHaveBeenNthCalledWith(4, tree[0].children[1], 1, 1)
    expect(callback).toHaveBeenNthCalledWith(5, tree[0], 0, 0)
  })

  it('unexpected object argument', async () => {
    const callback1 = vi.fn()
    forEachDeep(undefined, callback1)
    expect(callback1).toBeCalledTimes(0)

    const callback2 = vi.fn()
    forEachDeep(null, callback2)
    expect(callback2).toBeCalledTimes(0)

    const callback3 = vi.fn()
    forEachDeep({ a: 1 }, callback3)
    expect(callback3).toBeCalledTimes(1)
    expect(callback3).toHaveBeenNthCalledWith(1, { a: 1 }, 0, 0)
  })

  it('unexpected callback argument', () => {
    expect(() => forEachDeep([], undefined)).not.toThrow()
  })
})
