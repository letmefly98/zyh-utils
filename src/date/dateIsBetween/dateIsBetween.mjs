import { utcDayjs } from '../utils.mjs'

/**
 * 判断日期是否在时间段内
 *
 * @param {import('dayjs').ConfigType} date 待判断的日期
 * @param {import('dayjs').ConfigType} a 时间段起点
 * @param {import('dayjs').ConfigType} b 时间段终点
 * @param {import('dayjs').OpUnitType} [c] 判断单位，比如按天按分钟
 * @param {'()' | '[]' | '[)' | '(]'} d 开闭情况
 * @returns {boolean} 是否在时间段内
 */
export function dateIsBetween(date, a, b, c, d) {
  return utcDayjs(date).isBetween(a, b, c, d)
}
