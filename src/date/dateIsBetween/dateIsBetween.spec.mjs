import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dateIsBetween } from './dateIsBetween.mjs'

describe('dateIsBetween', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('normal case', () => {
    vi.setSystemTime(new Date('2025-02-19 15:48:21'))
    const mockDate = new Date()
    const startDate1 = new Date('2025-02-19 15:48:00')
    const endDate1 = new Date('2025-02-19 15:48:59')
    expect(dateIsBetween(mockDate, startDate1, endDate1)).toBe(true) // 在起止时间的1s内
    const startDate2 = new Date('2025-02-19 15:20:00')
    const endDate2 = new Date('2025-02-19 15:48:00')
    expect(dateIsBetween(mockDate, startDate2, endDate2)).toBe(false) // 结束时间比源时间小
  })

  it('use extra argument', async () => {
    const mockDate = new Date('2025-02-19 15:48:00.500')
    const startDate1 = new Date('2025-02-19 15:48:00')
    const endDate1 = new Date('2025-02-19 16:00:00')
    expect(dateIsBetween(mockDate, startDate1, endDate1)).toBe(false) // 按秒算，不在起止时间内
    expect(dateIsBetween(mockDate, startDate1, endDate1, 'ms')).toBe(true) // 按毫秒算，在起止时间内
    expect(dateIsBetween(mockDate, startDate1, endDate1, undefined, '[]')).toBe(true) // 调整判断的开闭关系
  })
})
