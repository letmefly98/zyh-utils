import type { ManipulateType } from 'dayjs'
import { utcDayjs } from '../utils.mjs'

/**
 * 日期偏移
 * @description 基于 dayjs.add 实现，支持正负偏移
 *
 * @example
 * offsetDate(new Date(2022, 4, 20), 1) // 2022-05-21 (默认天)
 * offsetDate(new Date(2022, 4, 20), 1, 'month') // 2022-06-20
 * offsetDate(new Date(2022, 4, 20), -1, 'year') // 2021-05-20
 *
 * @param date 日期对象或时间戳
 * @param offset 偏移量（正数加，负数减）
 * @param unit 时间单位，默认 'day'
 * @returns 偏移后的 Date 对象
 */
export function offsetDate(
  date: Date | number | string,
  offset: number,
  unit: ManipulateType = 'day',
): Date {
  return utcDayjs(date).add(offset, unit).toDate()
}
