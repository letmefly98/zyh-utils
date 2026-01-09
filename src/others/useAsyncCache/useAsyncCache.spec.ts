import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getPromiseError } from 'vitest/utils/get-promise-error'
import { sleep } from '../sleep/sleep.mjs'
import { useAsyncCache } from './useAsyncCache'

describe('useAsyncCache', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  // 测试基本异步缓存功能
  it('应该正确缓存异步函数结果', async () => {
    let counter = 0
    const mockAsyncFn = vi.fn(async () => {
      await sleep(1000)
      return ++counter
    })
    const cachedFn = useAsyncCache(mockAsyncFn)

    // 第一次调用
    const promise1 = cachedFn()
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)

    // 在异步函数完成前再次调用，应该等待第一次调用的结果
    const promise2 = cachedFn()
    expect(mockAsyncFn).toHaveBeenCalledTimes(1) // 不应该再次调用

    // 推进时间让异步函数完成
    await vi.advanceTimersByTimeAsync(1000)

    const result1 = await promise1
    const result2 = await promise2

    expect(result1).toBe(1)
    expect(result2).toBe(1) // 应该是相同的结果
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)

    // 第三次调用应该直接返回缓存
    const result3 = await cachedFn()
    expect(result3).toBe(1)
    expect(mockAsyncFn).toHaveBeenCalledTimes(1) // 仍然只调用一次
  })

  // 测试带参数的异步函数（使用自定义 getKey）
  it('应该正确处理带参数的异步函数', async () => {
    const mockAsyncFn = vi.fn(async (x: number) => {
      await sleep(500)
      return x * 2
    })
    // 提供自定义 getKey 函数来区分不同参数
    const cachedFn = useAsyncCache(mockAsyncFn, (x: number) => `param-${x}`)

    // 不同参数应该分别缓存
    const promise1 = cachedFn(5)
    const promise2 = cachedFn(3)

    expect(mockAsyncFn).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(500)

    const result1 = await promise1
    const result2 = await promise2

    expect(result1).toBe(10)
    expect(result2).toBe(6)

    // 相同参数应该使用缓存
    const result3 = await cachedFn(5)
    expect(result3).toBe(10)
    expect(mockAsyncFn).toHaveBeenCalledTimes(2) // 不应该再次调用
  })

  // 测试默认 getKey 行为（所有调用使用相同缓存键）
  it('应该在没有自定义 getKey 时对所有调用使用相同缓存', async () => {
    const mockAsyncFn = vi.fn(async (x: number) => {
      await sleep(300)
      return x * 2
    })
    // 不提供 getKey，所有调用都会使用默认的 'one' 作为缓存键
    const cachedFn = useAsyncCache(mockAsyncFn)

    // 即使参数不同，也会使用相同的缓存键
    const promise1 = cachedFn(5)
    const promise2 = cachedFn(10) // 不同参数，但会等待第一个调用的结果

    expect(mockAsyncFn).toHaveBeenCalledTimes(1) // 只调用一次

    await vi.advanceTimersByTimeAsync(300)

    const result1 = await promise1
    const result2 = await promise2

    expect(result1).toBe(10) // 5 * 2
    expect(result2).toBe(10) // 使用相同的缓存结果，不是 10 * 2 = 20
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)

    // 后续调用也会使用缓存
    const result3 = await cachedFn(100)
    expect(result3).toBe(10) // 仍然是缓存的结果
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)
  })

  // 测试多个并发请求等待同一个结果
  it('应该让多个并发请求等待同一个异步结果', async () => {
    let counter = 0
    const mockAsyncFn = vi.fn(async (id: string) => {
      await sleep(1000)
      return `${id}-${++counter}`
    })
    const cachedFn = useAsyncCache(mockAsyncFn)

    // 同时发起多个相同参数的请求
    const promise1 = cachedFn('test')
    const promise2 = cachedFn('test')
    const promise3 = cachedFn('test')

    expect(mockAsyncFn).toHaveBeenCalledTimes(1) // 只应该调用一次

    await vi.advanceTimersByTimeAsync(1000)

    const results = await Promise.all([promise1, promise2, promise3])

    // 所有请求应该得到相同的结果
    expect(results[0]).toBe('test-1')
    expect(results[1]).toBe('test-1')
    expect(results[2]).toBe('test-1')
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)
  })

  // 测试自定义 getKey 函数
  it('应该正确使用自定义 getKey 函数', async () => {
    interface User {
      id: number
      name: string
      version: number
    }

    const mockAsyncFn = vi.fn(async (user: User) => {
      await sleep(800)
      return `User: ${user.name} (v${user.version})`
    })

    // 只根据 id 生成缓存键，忽略其他字段
    const cachedFn = useAsyncCache(mockAsyncFn, (user: User) => `user-${user.id}`)

    const user1: User = { id: 1, name: 'Alice', version: 1 }
    const user2: User = { id: 1, name: 'Alice Updated', version: 2 }

    const promise1 = cachedFn(user1)
    await vi.advanceTimersByTimeAsync(800)
    const result1 = await promise1

    // 相同 id 的用户应该使用缓存，即使其他字段不同
    const result2 = await cachedFn(user2)

    expect(result1).toBe('User: Alice (v1)')
    expect(result2).toBe('User: Alice (v1)') // 使用缓存的结果
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)
  })

  // 测试异步函数抛出异常的情况
  it('应该正确处理异步函数抛出的异常', async () => {
    const mockAsyncFn = vi.fn(async (shouldFail: boolean) => {
      await sleep(500)
      if (shouldFail) {
        throw new Error('Async error')
      }
      return 'success'
    })
    // 使用自定义 getKey 来区分不同参数
    const cachedFn = useAsyncCache(mockAsyncFn, (shouldFail: boolean) => `fail-${shouldFail}`)

    // 测试成功的情况
    const successPromise = cachedFn(false)
    await vi.advanceTimersByTimeAsync(500)
    const successResult = await successPromise
    expect(successResult).toBe('success')

    // 测试失败的情况
    const failPromise1 = cachedFn(true)
    failPromise1.catch(() => {}) // 静默报错

    expect(mockAsyncFn).toHaveBeenCalledTimes(2) // 成功一次，失败一次
    await vi.advanceTimersByTimeAsync(500)

    const error1 = await getPromiseError(failPromise1)
    expect(error1?.message).toBe('Async error')

    // 异常不应该被缓存，再次调用相同参数应该重新执行
    const failPromise2 = cachedFn(true)
    failPromise2.catch(() => {}) // 静默报错

    expect(mockAsyncFn).toHaveBeenCalledTimes(3) // 应该再次调用
    await vi.advanceTimersByTimeAsync(500)

    const error2 = await getPromiseError(failPromise2)
    expect(error2?.message).toBe('Async error')
  })

  // 测试复杂对象参数的缓存
  it('应该正确处理复杂对象参数', async () => {
    interface RequestConfig {
      url: string
      method: string
      params?: Record<string, any>
    }

    const mockAsyncFn = vi.fn(async (config: RequestConfig) => {
      await sleep(600)
      return `Response from ${config.method} ${config.url}?page=${config.params?.page}`
    })

    // 使用自定义 getKey 来区分不同的配置
    const cachedFn = useAsyncCache(mockAsyncFn, (config: RequestConfig) =>
      `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`)

    const config1: RequestConfig = { url: '/api/users', method: 'GET', params: { page: 1 } }
    const config2: RequestConfig = { url: '/api/users', method: 'GET', params: { page: 1 } }
    const config3: RequestConfig = { url: '/api/users', method: 'GET', params: { page: 2 } }

    const promise1 = cachedFn(config1)
    const promise2 = cachedFn(config2) // 应该使用缓存
    const promise3 = cachedFn(config3) // 不同参数，应该重新调用

    expect(mockAsyncFn).toHaveBeenCalledTimes(2) // config1 和 config3

    await vi.advanceTimersByTimeAsync(600)

    const result1 = await promise1
    const result2 = await promise2
    const result3 = await promise3

    expect(result1).toBe('Response from GET /api/users?page=1')
    expect(result2).toBe('Response from GET /api/users?page=1') // 相同结果
    expect(result3).toBe('Response from GET /api/users?page=2')
    expect(mockAsyncFn).toHaveBeenCalledTimes(2)
  })

  // 测试无参数函数的默认 getKey
  it('应该正确处理无参数的异步函数', async () => {
    let counter = 0
    const mockAsyncFn = vi.fn(async () => {
      await sleep(400)
      return `result-${++counter}`
    })
    const cachedFn = useAsyncCache(mockAsyncFn)

    // 多次调用无参数函数
    const promise1 = cachedFn()
    const promise2 = cachedFn()

    expect(mockAsyncFn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(400)

    const result1 = await promise1
    const result2 = await promise2
    const result3 = await cachedFn()

    expect(result1).toBe('result-1')
    expect(result2).toBe('result-1')
    expect(result3).toBe('result-1')
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)
  })

  // 测试返回不同类型的异步函数
  it('应该正确缓存不同返回类型的异步函数', async () => {
    // 返回对象
    interface DataItem {
      id: number
      data: string
    }

    const mockAsyncFn1 = vi.fn(async (id: number): Promise<DataItem> => {
      await sleep(300)
      return { id, data: `data-${id}` }
    })
    const cachedFn1 = useAsyncCache(mockAsyncFn1)

    const promise1 = cachedFn1(1)
    await vi.advanceTimersByTimeAsync(300)
    const result1 = await promise1
    const result2 = await cachedFn1(1)

    expect(result1).toEqual({ id: 1, data: 'data-1' })
    expect(result2).toBe(result1) // 应该是同一个对象引用
    expect(mockAsyncFn1).toHaveBeenCalledTimes(1)

    // 返回数组
    const mockAsyncFn2 = vi.fn(async (size: number): Promise<number[]> => {
      await sleep(200)
      return Array.from({ length: size }, (_, i) => i)
    })
    const cachedFn2 = useAsyncCache(mockAsyncFn2)

    const promise3 = cachedFn2(3)
    await vi.advanceTimersByTimeAsync(200)
    const arr1 = await promise3
    const arr2 = await cachedFn2(3)

    expect(arr1).toEqual([0, 1, 2])
    expect(arr2).toBe(arr1) // 应该是同一个数组引用
    expect(mockAsyncFn2).toHaveBeenCalledTimes(1)
  })

  // 测试边界情况：特殊返回值
  it('应该正确缓存特殊返回值', async () => {
    // 测试 undefined 返回值
    const mockAsyncFn1 = vi.fn(async (): Promise<undefined> => {
      await sleep(100)
      return undefined
    })
    const cachedFn1 = useAsyncCache(mockAsyncFn1)

    const promise1 = cachedFn1()
    await vi.advanceTimersByTimeAsync(100)
    const result1 = await promise1
    const result2 = await cachedFn1()

    expect(result1).toBeUndefined()
    expect(result2).toBeUndefined()
    expect(mockAsyncFn1).toHaveBeenCalledTimes(1)

    // 测试 null 返回值
    const mockAsyncFn2 = vi.fn(async (): Promise<null> => {
      await sleep(100)
      return null
    })
    const cachedFn2 = useAsyncCache(mockAsyncFn2)

    const promise3 = cachedFn2()
    await vi.advanceTimersByTimeAsync(100)
    const result3 = await promise3
    const result4 = await cachedFn2()

    expect(result3).toBeNull()
    expect(result4).toBeNull()
    expect(mockAsyncFn2).toHaveBeenCalledTimes(1)
  })

  // 测试混合同步和异步调用的时序
  it('应该正确处理混合调用时序', async () => {
    let counter = 0
    const mockAsyncFn = vi.fn(async (delay: number) => {
      const currentCounter = ++counter // 在开始时就递增 counter
      await sleep(delay)
      return currentCounter
    })
    // 使用自定义 getKey 来区分不同的延时参数
    const cachedFn = useAsyncCache(mockAsyncFn, (delay: number) => `delay-${delay}`)

    // 启动一个长时间的异步调用
    const longPromise = cachedFn(1000)

    // 在它完成前启动一个短时间的异步调用（不同参数）
    const shortPromise = cachedFn(200)

    expect(mockAsyncFn).toHaveBeenCalledTimes(2)

    // 先完成短时间的调用
    await vi.advanceTimersByTimeAsync(200)
    const shortResult = await shortPromise
    expect(shortResult).toBe(2) // 第二个启动的，counter 为 2

    // 再完成长时间的调用
    await vi.advanceTimersByTimeAsync(800)
    const longResult = await longPromise
    expect(longResult).toBe(1) // 第一个启动的，counter 为 1

    // 验证缓存正常工作
    const cachedShort = await cachedFn(200)
    const cachedLong = await cachedFn(1000)

    expect(cachedShort).toBe(2)
    expect(cachedLong).toBe(1)
    expect(mockAsyncFn).toHaveBeenCalledTimes(2) // 没有额外调用
  })
})
