import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDaysInYear } from './getDaysInYear'

describe('getDaysInYear', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('传入年份', () => {
    it('返回闰年天数', () => {
      expect(getDaysInYear(2024)).toBe(366)
    })

    it('返回平年天数', () => {
      expect(getDaysInYear(2023)).toBe(365)
    })

    it('世纪年非闰年（1900）', () => {
      expect(getDaysInYear(1900)).toBe(365)
    })

    it('世纪年闰年（2000）', () => {
      expect(getDaysInYear(2000)).toBe(366)
    })
  })

  describe('传入 Date 对象', () => {
    it('返回闰年天数', () => {
      expect(getDaysInYear(new Date(2024, 5, 15))).toBe(366)
    })

    it('返回平年天数', () => {
      expect(getDaysInYear(new Date(2023, 0, 1))).toBe(365)
    })
  })

  describe('传入 Dayjs 对象', () => {
    it('返回闰年天数', () => {
      expect(getDaysInYear(dayjs('2024-06-15'))).toBe(366)
    })

    it('返回平年天数', () => {
      expect(getDaysInYear(dayjs('2023-01-01'))).toBe(365)
    })
  })

  describe('不传参数（默认当前年）', () => {
    it('mock 为闰年时返回 366', () => {
      vi.setSystemTime(new Date(2024, 5, 15))
      expect(getDaysInYear()).toBe(366)
    })

    it('mock 为平年时返回 365', () => {
      vi.setSystemTime(new Date(2023, 5, 15))
      expect(getDaysInYear()).toBe(365)
    })
  })
})
