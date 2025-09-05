import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sleep } from '../sleep/sleep.mjs'
import { getCheckUniqueFunction } from './getCheckUniqueFunction.mjs'

describe('getCheckUniqueFunction', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  // 假设系统中已有名为 old 的数据，检查唯一性时，传入值为 old 则返回 true
  const isProjectNameExisted = async name => (await sleep(1000) ?? name === 'old')

  it('normal create case', async () => {
    const check = getCheckUniqueFunction(isProjectNameExisted)
    const promise1 = check('old')
    await vi.advanceTimersByTimeAsync(1000)
    const isExisted1 = await promise1
    expect(isExisted1).toBe(true) // 输入值 old 在库中已存在

    const promise2 = check('new')
    await vi.advanceTimersByTimeAsync(1000)
    const isExisted2 = await promise2
    expect(isExisted2).toBe(false) // 输入值 old 在库中不存在
  })

  it('normal modify case', async () => {
    const nowProjectName = 'old-2'
    const check = getCheckUniqueFunction(isProjectNameExisted, 'modify', nowProjectName)

    // 修改时，输入值未改变，则跳过
    const promise1 = check(nowProjectName)
    await vi.advanceTimersByTimeAsync(0)
    const isExisted1 = await promise1
    expect(isExisted1).toBe(false) // 跳过

    // 修改时，输入值改变，则真正调用查验方法
    const promise2 = check('old')
    await vi.advanceTimersByTimeAsync(1000)
    const isExisted2 = await promise2
    expect(isExisted2).toBe(true) // 输入值 old 在库中已存在

    const promise3 = check('new')
    await vi.advanceTimersByTimeAsync(1000)
    const isExisted3 = await promise3
    expect(isExisted3).toBe(false) // 输入值 new 在库中不存在
  })
})
