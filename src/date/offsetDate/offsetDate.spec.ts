import { describe, expect, it } from 'vitest'
import { offsetDate } from './offsetDate'

describe('offsetDate', () => {
  it('offset day (default)', () => {
    const date = new Date(2022, 4, 20, 0, 0, 0)
    expect(offsetDate(date, 1)).toStrictEqual(new Date(2022, 4, 21, 0, 0, 0))
    expect(offsetDate(date, -1)).toStrictEqual(new Date(2022, 4, 19, 0, 0, 0))
  })

  it('offset year', () => {
    const date = new Date(2022, 4, 20, 0, 0, 0)
    expect(offsetDate(date, 1, 'year')).toStrictEqual(new Date(2023, 4, 20, 0, 0, 0))
    expect(offsetDate(date, -1, 'year')).toStrictEqual(new Date(2021, 4, 20, 0, 0, 0))
  })

  it('offset month', () => {
    const date = new Date(2022, 4, 20, 0, 0, 0)
    expect(offsetDate(date, 1, 'month')).toStrictEqual(new Date(2022, 5, 20, 0, 0, 0))
    expect(offsetDate(date, -1, 'month')).toStrictEqual(new Date(2022, 3, 20, 0, 0, 0))
  })

  it('offset hour', () => {
    const date = new Date(2022, 4, 20, 0, 0, 0)
    expect(offsetDate(date, 1, 'hour')).toStrictEqual(new Date(2022, 4, 20, 1, 0, 0))
    expect(offsetDate(date, -1, 'hour')).toStrictEqual(new Date(2022, 4, 19, 23, 0, 0))
  })

  it('offset minute', () => {
    const date = new Date(2022, 4, 20, 0, 0, 0)
    expect(offsetDate(date, 1, 'minute')).toStrictEqual(new Date(2022, 4, 20, 0, 1, 0))
    expect(offsetDate(date, -1, 'minute')).toStrictEqual(new Date(2022, 4, 19, 23, 59, 0))
  })

  it('offset second', () => {
    const date = new Date(2022, 4, 20, 0, 0, 0)
    expect(offsetDate(date, 1, 'second')).toStrictEqual(new Date(2022, 4, 20, 0, 0, 1))
    expect(offsetDate(date, 2, 'second')).toStrictEqual(new Date(2022, 4, 20, 0, 0, 2))
  })

  it('cross boundary', () => {
    // 跨日
    expect(offsetDate(new Date(2022, 4, 20, 23, 59, 59), 2, 'second'))
      .toStrictEqual(new Date(2022, 4, 21, 0, 0, 1))
    // 闰年 2月28 → 2月29
    expect(offsetDate(new Date(2020, 1, 28, 0, 0, 0), 1, 'day'))
      .toStrictEqual(new Date(2020, 1, 29, 0, 0, 0))
    // 非闰年 2月28 → 3月1
    expect(offsetDate(new Date(2023, 1, 28, 0, 0, 0), 1, 'day'))
      .toStrictEqual(new Date(2023, 2, 1, 0, 0, 0))
    // 跨年
    expect(offsetDate(new Date(2023, 11, 31, 0, 0, 0), 1, 'day'))
      .toStrictEqual(new Date(2024, 0, 1, 0, 0, 0))
  })

  it('week unit', () => {
    const date = new Date(2022, 4, 20, 0, 0, 0)
    expect(offsetDate(date, 1, 'week')).toStrictEqual(new Date(2022, 4, 27, 0, 0, 0))
    expect(offsetDate(date, -1, 'week')).toStrictEqual(new Date(2022, 4, 13, 0, 0, 0))
  })
})
