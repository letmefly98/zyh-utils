import type { Dayjs } from 'dayjs'
import { utcDayjs } from '../utils.mjs'

/**
 * 获取某年的总天数
 *
 * @example
 * // 方式一：传入 Date 或 Dayjs 对象
 * getDaysInYear(new Date(2024, 5, 15)) // 366（2024年，闰年）
 * getDaysInYear(dayjs('2023-06-01'))   // 365（2023年，平年）
 *
 * @example
 * // 方式二：传入年份
 * getDaysInYear(2024) // 366（闰年）
 * getDaysInYear(2023) // 365（平年）
 *
 * @example
 * // 方式三：不传参数（默认当前年）
 * getDaysInYear() // 当前年的天数
 *
 * @param yearOrDate 年份 或 Date/Dayjs 对象（可选，默认当前年）
 */
export function getDaysInYear(yearOrDate?: number | Date | Dayjs): number {
  let year: number

  if (yearOrDate === undefined) {
    // 不传参数，用当前年
    year = utcDayjs().year()
  } else if (typeof yearOrDate !== 'number') {
    // Date 或 Dayjs 对象
    year = utcDayjs(yearOrDate).year()
  } else {
    // 直接传年份
    year = yearOrDate
  }

  return utcDayjs(`${year}-01-01`).isLeapYear() ? 366 : 365
}
