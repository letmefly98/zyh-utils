import type { Dayjs } from 'dayjs'
import { utcDayjs } from '../utils.mjs'

/**
 * 获取该月份的总天数
 *
 * @example
 * // 方式一：传入 Date 或 Dayjs 对象
 * getDaysInMonth(new Date(2024, 1, 15)) // 29（2024年2月，闰年）
 * getDaysInMonth(dayjs('2023-02-01'))   // 28（2023年2月，平年）
 *
 * @example
 * // 方式二：传入月份和年份
 * getDaysInMonth(2, 2024) // 29（闰年2月）
 * getDaysInMonth(1, 2024) // 31（1月）
 *
 * @example
 * // 方式三：仅传月份（年份默认当前年）
 * getDaysInMonth(2) // 当前年 2 月的天数
 *
 * @param monthOrDate 月份(1-12) 或 Date/Dayjs 对象
 * @param year 年份（可选，默认当前年；当第一个参数为 Date/Dayjs 时忽略）
 */
export function getDaysInMonth(monthOrDate: number | Date | Dayjs, year?: number): number {
  // 如果是 Date 或 Dayjs 对象
  if (typeof monthOrDate !== 'number') {
    return utcDayjs(monthOrDate).daysInMonth()
  }

  // 如果是 month，year 未传则用当前年
  const y = year ?? utcDayjs().year()
  return utcDayjs(`${y}-${monthOrDate}-01`).daysInMonth()
}
