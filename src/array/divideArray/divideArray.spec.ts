import { describe, expect, it } from 'vitest'
import { divideArray } from './divideArray'

describe('divideArray', () => {
  it('单个筛选条件，将小于3的数字拆分出来', () => {
    const [small, rest] = divideArray([1, 5, 2, 4, 3], [num => num < 3])
    expect(small).toStrictEqual([1, 2])
    expect(rest).toStrictEqual([5, 4, 3])
  })

  it('多个筛选条件，按条件顺序拆分', () => {
    const [a, b, c] = divideArray([1, 2, 3, 1, 1, 3], [num => num === 2, num => num === 3])
    expect(a).toStrictEqual([2])
    expect(b).toStrictEqual([3, 3])
    expect(c).toStrictEqual([1, 1, 1])
  })

  it('空数组返回空结果', () => {
    const [matched, rest] = divideArray([], [() => true])
    expect(matched).toStrictEqual([])
    expect(rest).toStrictEqual([])
  })

  it('无筛选条件时全部放入剩余数组', () => {
    const [rest] = divideArray([1, 2, 3], [])
    expect(rest).toStrictEqual([1, 2, 3])
  })

  it('所有元素都匹配第一个条件', () => {
    const [all, rest] = divideArray([1, 2, 3], [() => true])
    expect(all).toStrictEqual([1, 2, 3])
    expect(rest).toStrictEqual([])
  })

  it('没有元素匹配任何条件', () => {
    const [a, b, rest] = divideArray([1, 2, 3], [num => num > 10, num => num < 0])
    expect(a).toStrictEqual([])
    expect(b).toStrictEqual([])
    expect(rest).toStrictEqual([1, 2, 3])
  })

  it('支持对象数组', () => {
    const users = [
      { name: 'Alice', role: 'admin' },
      { name: 'Bob', role: 'user' },
      { name: 'Charlie', role: 'admin' },
      { name: 'David', role: 'guest' },
    ]
    const [admins, guests, others] = divideArray(
      users,
      [u => u.role === 'admin', u => u.role === 'guest'],
    )
    expect(admins).toStrictEqual([{ name: 'Alice', role: 'admin' }, { name: 'Charlie', role: 'admin' }])
    expect(guests).toStrictEqual([{ name: 'David', role: 'guest' }])
    expect(others).toStrictEqual([{ name: 'Bob', role: 'user' }])
  })

  it('筛选函数可以访问 index 和完整数组', () => {
    const [evens, odds] = divideArray([10, 20, 30, 40], [(_, index) => index % 2 === 0])
    expect(evens).toStrictEqual([10, 30]) // 索引 0, 2
    expect(odds).toStrictEqual([20, 40]) // 索引 1, 3
  })
})
