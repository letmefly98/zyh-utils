import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sleep } from '../sleep/sleep.mjs'
import { useCache } from './useCache.mjs'

describe('useCache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('normal case', async () => {
    let i = 1
    const _refreshList = vi.fn(async () => i++)
    const refreshList = useCache(_refreshList)
    expect(await refreshList()).toBe(1) // 无缓存，调用后读写缓存
    expect(await refreshList()).toBe(1) // 已有缓存，立即返回缓存，并异步刷新缓存
    expect(await refreshList()).toBe(2) // 返回新缓存
  })

  it('normal async case', async () => {
    let i = 1
    const _refreshList = async () => (await sleep(1000) ?? i++)
    const refreshList = useCache(_refreshList)

    const result1 = await getAsyncFunctionResult(refreshList(), 1000)
    expect(result1).toBe(1) // 无缓存，等待请求结果，返回结果，并写入缓存

    const result2 = await getAsyncFunctionResult(refreshList(), -1)
    expect(result2).toBe(1) // 已有缓存，立即返回缓存，并异步刷新缓存

    await vi.advanceTimersByTimeAsync(1000)
    const result3 = await getAsyncFunctionResult(refreshList(), -1)
    expect(result3).toBe(2) // 得到新结果后，返回新缓存
  })

  it('autoRefreshCache param', async () => {
    let i = 1
    const _refreshList = async () => (await sleep(1000) ?? i++)
    const refreshList = useCache(_refreshList, false)

    const result1 = await getAsyncFunctionResult(refreshList(), 1000)
    expect(result1).toBe(1) // 无缓存，等待请求结果，返回结果，并写入缓存

    const result2 = await getAsyncFunctionResult(refreshList(), -1)
    expect(result2).toBe(1) // 已有缓存，立即返回缓存，且不刷新缓存

    await vi.advanceTimersByTimeAsync(1000)
    const result3 = await getAsyncFunctionResult(refreshList(), -1)
    expect(result3).toBe(1) // 未刷新缓存，仍立即返回旧缓存
  })
})

// 获取异步函数结果
async function getAsyncFunctionResult(promise, ms = -1) {
  if (ms > 0) await vi.advanceTimersByTimeAsync(ms)
  return await promise
}
