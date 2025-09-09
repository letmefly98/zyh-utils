import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sleep } from '../sleep/sleep.mjs'
import { ConcurrencyPool } from './ConcurrencyPool.mjs'

describe('class ConcurrencyPool', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('should create instance with default values', () => {
    const pool = new ConcurrencyPool()
    expect(pool.limit).toBe(3)
    expect(pool.running).toBe(0)
    expect(pool.queue).toEqual([])
    expect(pool.options.processWhenError).toBe(true)
  })

  it('should create instance with custom limit', () => {
    const pool = new ConcurrencyPool(5)
    expect(pool.limit).toBe(5)
    expect(pool.options.processWhenError).toBe(true)
  })

  it('should create instance with custom options', () => {
    const pool = new ConcurrencyPool(3, { processWhenError: false })
    expect(pool.limit).toBe(3)
    expect(pool.options.processWhenError).toBe(false)
  })

  it('should execute task immediately when under limit', async () => {
    const pool = new ConcurrencyPool(3)
    const mockTask = vi.fn().mockResolvedValue('result')

    const result = await pool.run(mockTask)

    expect(result).toBe('result')
    expect(mockTask).toHaveBeenCalledTimes(1)
    expect(pool.running).toBe(0) // Should be 0 after completion
  })

  it('should queue tasks when at limit', async () => {
    const pool = new ConcurrencyPool(2)

    const task1 = vi.fn().mockImplementation(() => sleep(1000).then(() => 'result1'))
    const task2 = vi.fn().mockImplementation(() => sleep(500).then(() => 'result2'))
    const task3 = vi.fn().mockImplementation(() => sleep(1000).then(() => 'result3'))

    const promise1 = pool.run(task1)
    const promise2 = pool.run(task2)
    const promise3 = pool.run(task3)

    expect(pool.running).toBe(2)
    expect(pool.queue.length).toBe(1) // 12运行中，3在等待

    vi.advanceTimersByTime(500)
    const res2 = await promise2
    expect(pool.running).toBe(2)
    expect(pool.queue.length).toBe(0) // 2完成，13运行中，无等待
    expect(res2).toBe('result2')

    vi.advanceTimersByTime(500)
    const res1 = await promise1
    expect(pool.running).toBe(1)
    expect(pool.queue.length).toBe(0) // 12完成，3运行中，无等待
    expect(res1).toBe('result1')

    vi.advanceTimersByTime(1000)
    const res3 = await promise3
    expect(pool.running).toBe(0)
    expect(pool.queue.length).toBe(0) // 全完成
    expect(res3).toBe('result3')
  })

  it('should handle task errors correctly', async () => {
    const pool = new ConcurrencyPool(2)
    const error = new Error('Task failed')
    const failingTask = vi.fn().mockRejectedValue(error)

    await expect(pool.run(failingTask)).rejects.toThrow('Task failed')
    expect(pool.running).toBe(0)
  })

  it('should continue processing when processWhenError is true', async () => {
    const pool = new ConcurrencyPool(1, { processWhenError: true })

    const failingTask = vi.fn().mockRejectedValue(new Error('Failed'))
    const successTask = vi.fn().mockImplementation(() => sleep(500).then(() => 'success'))

    const failPromise = pool.run(failingTask)
    const successPromise = pool.run(successTask)

    await expect(failPromise).rejects.toThrow('Failed')

    vi.advanceTimersByTimeAsync(500)
    const result = await successPromise
    expect(result).toBe('success')
    expect(successTask).toHaveBeenCalledTimes(1)
  })

  it.todo('should not continue processing when processWhenError is false', async () => {
  })

  it('should process queue in FIFO order', async () => {
    const pool = new ConcurrencyPool(2)
    const executionOrder = []

    const createTask = id => vi.fn().mockImplementation(() => {
      executionOrder.push(id)
      return sleep(500).then(() => `result${id}`)
    })

    const promise = Promise.all(Array.from({ length: 10 }).map((_, index) => pool.run(createTask(index))))

    vi.advanceTimersByTimeAsync(5000)
    await promise
    expect(executionOrder).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
