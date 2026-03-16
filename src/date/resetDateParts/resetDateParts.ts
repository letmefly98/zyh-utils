import type { UnitType } from 'dayjs'
import { utcDayjs } from '../utils.mjs'

/** 日期部分配置：[unit, 默认值] */
const PARTS: [UnitType, number][] = [
  ['y', 1970],
  ['M', 0],
  ['D', 1],
  ['h', 0],
  ['m', 0],
  ['s', 0],
]

/**
 * 重置日期的部分时间段
 * @description 根据 mask 字符串决定保留哪些部分，重置哪些部分为默认值
 *
 * mask 格式：6 位字符，分别对应「年月日时分秒」
 * - '1' = 保留原值
 * - '0' = 重置为默认值（年=1970, 月=1, 日=1, 时=0, 分=0, 秒=0）
 *
 * @example
 * resetDateParts(new Date(2019, 5, 19, 10, 40, 30), '111000') // 当天零点
 * resetDateParts(new Date(2019, 5, 19, 10, 40, 30), '110000') // 当月第一天
 * resetDateParts(new Date(2019, 5, 19, 10, 40, 30), '111100') // 当前整点
 *
 * @param date 原始日期
 * @param mask 掩码字符串，默认 '111000'（保留年月日，清零时分秒）
 * @returns 重置后的新 Date 对象
 */
export function resetDateParts(date: Date, mask = '111000'): Date {
  const d = utcDayjs(date)
  const [Y, M, D, h, m, s] = PARTS.map(([unit, def], i) =>
    mask[i] === '1' ? d.get(unit) : def,
  )
  return new Date(Y, M, D, h, m, s)
}
