import type { Dayjs } from 'dayjs'
import { utcDayjs } from '../utils.mjs'

/**
 * 获取本周第一天
 * @description 根据指定的周起始日，返回当前日期所在周的第一天
 *
 * @example
 * // 默认周一为第一天
 * getFirstDayOfWeek(new Date(2024, 2, 13)) // 2024-03-11（周一）
 *
 * @example
 * // 自定义周日为第一天
 * getFirstDayOfWeek(new Date(2024, 2, 13), 0) // 2024-03-10（周日）
 *
 * @example
 * // 不传日期，默认当前日期
 * getFirstDayOfWeek() // 本周第一天
 *
 * @param date 日期（Date/Dayjs 对象），默认当前日期
 * @param weekStartsOn 周起始日（0=周日, 1=周一, ..., 6=周六），默认 1（周一）
 * @returns 本周第一天的 Date 对象（00:00:00）
 */
export function getFirstDayOfWeek(
  date?: Date | Dayjs,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1,
): Date {
  const d = date ? utcDayjs(date) : utcDayjs()
  const currentDay = d.day() // 0=周日, 1=周一, ..., 6=周六

  // 计算需要回退的天数
  const diff = (currentDay - weekStartsOn + 7) % 7

  return d.subtract(diff, 'day').startOf('day').toDate()
}
