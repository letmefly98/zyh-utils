import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sleep } from './sleep.mjs'

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('normal case', async () => {
    const sleepSpy = vi.fn(sleep)
    sleepSpy(1000)
    expect(sleepSpy).not.toHaveResolved()
    await vi.advanceTimersByTimeAsync(1000)
    expect(sleepSpy).toHaveBeenCalled() // 50ms 后才执行后续
  })

  it('unexpected argument 1', async () => {
    const sleepSpy = vi.fn(sleep)
    sleepSpy('5000')
    expect(sleepSpy).not.toHaveResolved()
    await vi.advanceTimersByTimeAsync(5000)
    expect(sleepSpy).toHaveResolved()
  })

  it('unexpected argument 2', async () => {
    const sleepSpy = vi.fn(sleep)
    sleepSpy(-1)
    expect(sleepSpy).not.toHaveResolved()
    await vi.advanceTimersByTimeAsync(0)
    expect(sleepSpy).toHaveResolved()
  })
})
