import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getFirstDayOfWeek } from './getFirstDayOfWeek'

describe('getFirstDayOfWeek', () => {
  describe('默认周一为第一天', () => {
    it('周三 → 返回周一', () => {
      // 2024-03-13 是周三
      const result = getFirstDayOfWeek(new Date(2024, 2, 13))
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(2)
      expect(result.getDate()).toBe(11) // 周一
      expect(result.getDay()).toBe(1)
    })

    it('周一 → 返回当天', () => {
      // 2024-03-11 是周一
      const result = getFirstDayOfWeek(new Date(2024, 2, 11))
      expect(result.getDate()).toBe(11)
      expect(result.getDay()).toBe(1)
    })

    it('周日 → 返回上周一', () => {
      // 2024-03-17 是周日
      const result = getFirstDayOfWeek(new Date(2024, 2, 17))
      expect(result.getDate()).toBe(11) // 上周一
      expect(result.getDay()).toBe(1)
    })

    it('跨月：3月初 → 返回2月的周一', () => {
      // 2024-03-01 是周五
      const result = getFirstDayOfWeek(new Date(2024, 2, 1))
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(1) // 2月
      expect(result.getDate()).toBe(26) // 2月26日周一
    })

    it('跨年：1月初 → 返回上一年的周一', () => {
      // 2024-01-03 是周三
      const result = getFirstDayOfWeek(new Date(2024, 0, 3))
      expect(result.getFullYear()).toBe(2024)
      expect(result.getMonth()).toBe(0)
      expect(result.getDate()).toBe(1) // 1月1日周一
    })
  })

  describe('自定义周日为第一天 (weekStartsOn = 0)', () => {
    it('周三 → 返回周日', () => {
      // 2024-03-13 是周三
      const result = getFirstDayOfWeek(new Date(2024, 2, 13), 0)
      expect(result.getDate()).toBe(10) // 周日
      expect(result.getDay()).toBe(0)
    })

    it('周日 → 返回当天', () => {
      // 2024-03-10 是周日
      const result = getFirstDayOfWeek(new Date(2024, 2, 10), 0)
      expect(result.getDate()).toBe(10)
      expect(result.getDay()).toBe(0)
    })

    it('周六 → 返回上周日', () => {
      // 2024-03-16 是周六
      const result = getFirstDayOfWeek(new Date(2024, 2, 16), 0)
      expect(result.getDate()).toBe(10)
      expect(result.getDay()).toBe(0)
    })
  })

  describe('自定义周六为第一天 (weekStartsOn = 6)', () => {
    it('周三 → 返回上周六', () => {
      // 2024-03-13 是周三
      const result = getFirstDayOfWeek(new Date(2024, 2, 13), 6)
      expect(result.getDate()).toBe(9) // 上周六
      expect(result.getDay()).toBe(6)
    })

    it('周六 → 返回当天', () => {
      // 2024-03-09 是周六
      const result = getFirstDayOfWeek(new Date(2024, 2, 9), 6)
      expect(result.getDate()).toBe(9)
      expect(result.getDay()).toBe(6)
    })
  })

  describe('传入 Dayjs 对象', () => {
    it('正确处理 Dayjs 对象', () => {
      const result = getFirstDayOfWeek(dayjs('2024-03-13'))
      expect(result.getDate()).toBe(11)
      expect(result.getDay()).toBe(1)
    })
  })

  describe('不传参数（默认当前日期）', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2024, 2, 13, 10, 30, 0)) // 2024-03-13 周三
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('返回本周一', () => {
      const result = getFirstDayOfWeek()
      expect(result.getDate()).toBe(11)
      expect(result.getDay()).toBe(1)
    })

    it('自定义周日为第一天', () => {
      const result = getFirstDayOfWeek(undefined, 0)
      expect(result.getDate()).toBe(10)
      expect(result.getDay()).toBe(0)
    })
  })

  describe('返回时间为 00:00:00', () => {
    it('时间被重置为零点', () => {
      const result = getFirstDayOfWeek(new Date(2024, 2, 13, 15, 30, 45))
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
    })
  })
})
