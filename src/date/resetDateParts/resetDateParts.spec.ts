import { describe, expect, it } from 'vitest'
import { resetDateParts } from './resetDateParts'

describe('resetDateParts', () => {
  // 基准日期：2019-06-19 10:40:30
  const baseDate = new Date(2019, 5, 19, 10, 40, 30)

  it('默认参数：保留年月日，清零时分秒', () => {
    expect(resetDateParts(baseDate)).toStrictEqual(new Date(2019, 5, 19, 0, 0, 0))
  })

  it('111000：保留年月日，清零时分秒', () => {
    expect(resetDateParts(baseDate, '111000')).toStrictEqual(new Date(2019, 5, 19, 0, 0, 0))
  })

  it('110000：保留年月，清零日时分秒（当月第一天）', () => {
    expect(resetDateParts(baseDate, '110000')).toStrictEqual(new Date(2019, 5, 1, 0, 0, 0))
  })

  it('100000：只保留年，清零其他（当年第一天）', () => {
    expect(resetDateParts(baseDate, '100000')).toStrictEqual(new Date(2019, 0, 1, 0, 0, 0))
  })

  it('111100：保留年月日时，清零分秒（整点）', () => {
    expect(resetDateParts(baseDate, '111100')).toStrictEqual(new Date(2019, 5, 19, 10, 0, 0))
  })

  it('111110：保留年月日时分，清零秒', () => {
    expect(resetDateParts(baseDate, '111110')).toStrictEqual(new Date(2019, 5, 19, 10, 40, 0))
  })

  it('111111：全部保留', () => {
    expect(resetDateParts(baseDate, '111111')).toStrictEqual(new Date(2019, 5, 19, 10, 40, 30))
  })

  it('000000：全部重置', () => {
    expect(resetDateParts(baseDate, '000000')).toStrictEqual(new Date(1970, 0, 1, 0, 0, 0))
  })

  it('110100：保留年月时，清零日分秒', () => {
    expect(resetDateParts(baseDate, '110100')).toStrictEqual(new Date(2019, 5, 1, 10, 0, 0))
  })
})
