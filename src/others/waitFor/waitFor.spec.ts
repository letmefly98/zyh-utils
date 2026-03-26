import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from './waitFor'

describe('waitFor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('条件立即满足时直接 resolve', async () => {
    const promise = waitFor(() => true, 1000)
    await vi.advanceTimersByTimeAsync(0)
    await expect(promise).resolves.toBeUndefined()
  })

  it('条件延迟满足时等待后 resolve', async () => {
    let ready = false
    setTimeout(() => (ready = true), 500)

    const promise = waitFor(() => ready, 1000)

    // 400ms 时还未满足
    await vi.advanceTimersByTimeAsync(400)
    expect(ready).toBe(false)

    // 600ms 时条件已满足，下次检查时 resolve
    await vi.advanceTimersByTimeAsync(200)
    await expect(promise).resolves.toBeUndefined()
  })

  it('超时时 reject 并抛出错误', async () => {
    const promise = waitFor(() => false, 500)

    // 必须同时推进 timer 和等待 rejection
    // 否则 rejection 在 advanceTimersByTimeAsync 内部产生时还没有 handler，会触发 unhandled rejection
    await Promise.all([
      vi.advanceTimersByTimeAsync(600),
      expect(promise).rejects.toThrow('timeout after 500ms'),
    ])
  })

  it('刚好超时边界情况（elapsed >= timeout）', async () => {
    // timeout=100, interval=100(默认)
    // 第一次检查 t=0，条件不满足
    // 第二次检查 t=100，此时 elapsed >= timeout，超时
    const promise = waitFor(() => false, 100)

    await Promise.all([
      vi.advanceTimersByTimeAsync(100),
      expect(promise).rejects.toThrow('timeout after 100ms'),
    ])
  })

  it('自定义检查间隔', async () => {
    let checkCount = 0
    const callback = () => {
      checkCount++
      return checkCount >= 3
    }

    // 使用 50ms 间隔
    const promise = waitFor(callback, 1000, 50)

    // 第一次立即检查 (checkCount = 1)
    await vi.advanceTimersByTimeAsync(0)
    expect(checkCount).toBe(1)

    // 50ms 后第二次检查 (checkCount = 2)
    await vi.advanceTimersByTimeAsync(50)
    expect(checkCount).toBe(2)

    // 再 50ms 后第三次检查 (checkCount = 3)，条件满足
    await vi.advanceTimersByTimeAsync(50)
    await expect(promise).resolves.toBeUndefined()
    expect(checkCount).toBe(3)
  })

  it('默认检查间隔为 100ms', async () => {
    let checkCount = 0
    const callback = () => {
      checkCount++
      return checkCount >= 3 // 第三次检查时满足
    }

    const promise = waitFor(callback, 1000)

    // 立即检查一次 (checkCount = 1)
    await vi.advanceTimersByTimeAsync(0)
    expect(checkCount).toBe(1)

    // 100ms 后再检查 (checkCount = 2)
    await vi.advanceTimersByTimeAsync(100)
    expect(checkCount).toBe(2)

    // 再 100ms 后再检查 (checkCount = 3)，条件满足
    await vi.advanceTimersByTimeAsync(100)
    await expect(promise).resolves.toBeUndefined()
    expect(checkCount).toBe(3)
  })

  it('回调函数抛出异常时 promise reject', async () => {
    const callback = () => {
      throw new Error('callback error')
    }

    const promise = waitFor(callback, 1000)

    await expect(promise).rejects.toThrow('callback error')
  })

  it('timeout 为 0 且条件立即满足时 resolve', async () => {
    const promise = waitFor(() => true, 0)
    await vi.advanceTimersByTimeAsync(0)
    await expect(promise).resolves.toBeUndefined()
  })

  it('timeout 为 0 且条件不满足时立即超时', async () => {
    const promise = waitFor(() => false, 0)

    await expect(promise).rejects.toThrow('timeout after 0ms')
  })
})
