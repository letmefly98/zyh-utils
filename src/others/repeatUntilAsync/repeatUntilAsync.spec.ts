import { describe, expect, it, vi } from 'vitest'
import { repeatUntilAsync } from './repeatUntilAsync'

describe('repeatUntilAsync', () => {
  describe('基本功能', () => {
    it('根据返回值判断是否继续', async () => {
      let count = 0
      const fn = repeatUntilAsync(
        () => ++count,
        (_i, result) => result < 3,
      )
      expect(await fn()).toEqual([1, 2, 3])
    })

    it('根据索引判断是否继续', async () => {
      const fn = repeatUntilAsync(
        async () => 'x',
        index => index < 2,
      )
      expect(await fn()).toEqual(['x', 'x', 'x'])
    })

    it('第一次就不满足条件时返回单元素数组', async () => {
      const fn = repeatUntilAsync(
        async () => 100,
        (_i, result) => result < 10,
      )
      expect(await fn()).toEqual([100])
    })
  })

  describe('formatParams 参数格式化', () => {
    it('根据索引动态修改参数', async () => {
      const fn = repeatUntilAsync(
        async (page: number) => ({ page, data: [page * 10] }),
        index => index < 2,
        index => [index + 1] as [number],
      )
      expect(await fn(1)).toEqual([
        { page: 1, data: [10] },
        { page: 2, data: [20] },
        { page: 3, data: [30] },
      ])
    })

    it('保持原始参数不变', async () => {
      const fn = repeatUntilAsync(
        async (a: number, b: number) => a + b,
        index => index < 2,
        (_i, ...args) => args,
      )
      expect(await fn(1, 2)).toEqual([3, 3, 3])
    })

    it('根据索引和原始参数组合', async () => {
      const fn = repeatUntilAsync(
        async (base: number, multiplier: number) => base * multiplier,
        index => index < 3,
        (index, base, multiplier) => [base + index, multiplier] as [number, number],
      )
      // index=0: (0+0)*2=0, index=1: (0+1)*2=2, index=2: (0+2)*2=4, index=3: (0+3)*2=6
      expect(await fn(0, 2)).toEqual([0, 2, 4, 6])
    })
  })

  describe('执行次数验证', () => {
    it('executor 被正确调用', async () => {
      const executor = vi.fn(async () => 1)
      const fn = repeatUntilAsync(executor, i => i < 4)
      await fn()
      expect(executor).toHaveBeenCalledTimes(5)
    })

    it('formatParams 被正确调用', async () => {
      const formatParams = vi.fn(() => [] as [])
      const fn = repeatUntilAsync(async () => 'a', i => i < 2, formatParams)
      await fn()
      // 调用 3 次：索引 0, 1, 2
      expect(formatParams).toHaveBeenCalledTimes(3)
      expect(formatParams).toHaveBeenNthCalledWith(1, 0)
      expect(formatParams).toHaveBeenNthCalledWith(2, 1)
      expect(formatParams).toHaveBeenNthCalledWith(3, 2)
    })

    it('shouldContinue 被正确调用', async () => {
      const shouldContinue = vi.fn((i: number) => i < 2)
      const fn = repeatUntilAsync(async () => 'a', shouldContinue)
      await fn()
      // 调用 3 次：索引 0, 1, 2（第 3 次返回 false 停止）
      expect(shouldContinue).toHaveBeenCalledTimes(3)
      expect(shouldContinue).toHaveBeenNthCalledWith(1, 0, 'a')
      expect(shouldContinue).toHaveBeenNthCalledWith(2, 1, 'a')
      expect(shouldContinue).toHaveBeenNthCalledWith(3, 2, 'a')
    })
  })

  describe('边界情况', () => {
    it('条件函数始终返回 false，只执行一次', async () => {
      const executor = vi.fn(async () => 42)
      const fn = repeatUntilAsync(executor, () => false)
      expect(await fn()).toEqual([42])
      expect(executor).toHaveBeenCalledTimes(1)
    })

    it('返回不同类型的值', async () => {
      let count = 0
      const fn = repeatUntilAsync(
        async () => ({ count: ++count }),
        (_i, result) => result.count < 3,
      )
      expect(await fn()).toEqual([{ count: 1 }, { count: 2 }, { count: 3 }])
    })

    it('返回数组类型', async () => {
      let i = 0
      const fn = repeatUntilAsync(
        async () => [++i, i * 2],
        index => index < 2,
      )
      expect(await fn()).toEqual([[1, 2], [2, 4], [3, 6]])
    })
  })

  describe('实际应用场景', () => {
    it('模拟分页加载（通过 formatParams 递增页码）', async () => {
      interface PageResult { page: number, data: number[], hasMore: boolean }
      const mockFetch = vi.fn(async (page: number): Promise<PageResult> => ({
        page,
        data: page < 3 ? [page * 10] : [],
        hasMore: page < 3,
      }))
      const fn = repeatUntilAsync(
        mockFetch,
        (_i, result) => result.hasMore,
        index => [index + 1] as [number],
      )
      const result = await fn(1)
      expect(result).toEqual([
        { page: 1, data: [10], hasMore: true },
        { page: 2, data: [20], hasMore: true },
        { page: 3, data: [], hasMore: false },
      ])
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('重试直到成功', async () => {
      let attempts = 0
      const fn = repeatUntilAsync(
        async () => ({ success: ++attempts >= 3, attempts }),
        (_i, result) => !result.success,
      )
      expect(await fn()).toEqual([
        { success: false, attempts: 1 },
        { success: false, attempts: 2 },
        { success: true, attempts: 3 },
      ])
    })

    it('模拟带延迟的重试', async () => {
      let attempts = 0
      const fn = repeatUntilAsync(
        async () => {
          await new Promise(r => setTimeout(r, 1))
          return { success: ++attempts >= 3, attempts }
        },
        (_i, result) => !result.success,
      )
      expect(await fn()).toEqual([
        { success: false, attempts: 1 },
        { success: false, attempts: 2 },
        { success: true, attempts: 3 },
      ])
    })

    it('轮询接口直到状态变化', async () => {
      const statuses = ['pending', 'pending', 'processing', 'completed']
      let callIndex = 0
      interface TaskStatus { taskId: string, status: string }
      const fetchStatus = async (taskId: string): Promise<TaskStatus> => ({ taskId, status: statuses[callIndex++] })
      const fn = repeatUntilAsync(
        fetchStatus,
        (_i, result) => result.status !== 'completed',
        (_i, taskId) => [taskId] as [string],
      )
      expect(await fn('task-123')).toEqual([
        { taskId: 'task-123', status: 'pending' },
        { taskId: 'task-123', status: 'pending' },
        { taskId: 'task-123', status: 'processing' },
        { taskId: 'task-123', status: 'completed' },
      ])
    })
  })
})
