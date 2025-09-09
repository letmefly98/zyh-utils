import { utcDayjs } from '../utils.mjs'

/**
 * 日期转为字符串
 *
 * @param {import('dayjs').ConfigType} date
 * @param {string} [format="YYYY-MM-DD HH:mm:ss"] 日期格式
 * @returns {string} 日期字符串
 */
export function date2string(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return utcDayjs(date).format(format)
}
