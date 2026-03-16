import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDaysInMonth } from './getDaysInMonth'

describe('getDaysInMonth', () => {
  beforeEach(() => {
    // mock 当前时间为 2024 年（闰年）
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('传入 month + year', () => {
    it('返回 1 月的天数', () => {
      expect(getDaysInMonth(1, 2024)).toBe(31)
    })

    it('返回平年 2 月的天数', () => {
      expect(getDaysInMonth(2, 2023)).toBe(28)
    })

    it('返回闰年 2 月的天数', () => {
      expect(getDaysInMonth(2, 2024)).toBe(29)
    })

    it('返回 4 月的天数', () => {
      expect(getDaysInMonth(4, 2024)).toBe(30)
    })

    it('返回 12 月的天数', () => {
      expect(getDaysInMonth(12, 2024)).toBe(31)
    })

    it('世纪年非闰年（1900）', () => {
      expect(getDaysInMonth(2, 1900)).toBe(28)
    })

    it('世纪年闰年（2000）', () => {
      expect(getDaysInMonth(2, 2000)).toBe(29)
    })
  })

  describe('传入 Date 对象', () => {
    it('返回闰年 2 月', () => {
      expect(getDaysInMonth(new Date(2024, 1, 15))).toBe(29) // 2024年2月
    })

    it('返回平年 2 月', () => {
      expect(getDaysInMonth(new Date(2023, 1, 1))).toBe(28)
    })

    it('返回 31 天的月份', () => {
      expect(getDaysInMonth(new Date(2024, 0, 20))).toBe(31) // 1月
    })
  })

  describe('传入 Dayjs 对象', () => {
    it('返回 Dayjs 对象所在月份的天数', () => {
      expect(getDaysInMonth(dayjs('2024-02-15'))).toBe(29)
    })

    it('返回平年 2 月', () => {
      expect(getDaysInMonth(dayjs('2023-02-01'))).toBe(28)
    })

    it('返回 30 天的月份', () => {
      expect(getDaysInMonth(dayjs('2024-04-01'))).toBe(30)
    })
  })

  describe('仅传月份（年份默认当前年）', () => {
    it('返回当前年（闰年）月份天数', () => {
      vi.setSystemTime(new Date(2024, 5, 15))
      expect(getDaysInMonth(1)).toBe(31)
      expect(getDaysInMonth(2)).toBe(29)
      expect(getDaysInMonth(4)).toBe(30)
    })

    it('返回当前年（平年）月份天数', () => {
      vi.setSystemTime(new Date(2023, 5, 15))
      expect(getDaysInMonth(1)).toBe(31)
      expect(getDaysInMonth(2)).toBe(28)
      expect(getDaysInMonth(4)).toBe(30)
    })
  })
})
