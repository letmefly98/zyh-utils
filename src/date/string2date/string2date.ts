import { baseDayjs, tz } from '../utils.mjs'

/**
 * 补充格式中缺失的日期部分（年=1970，月=01，日=01）
 * 策略：缺失部分统一前置，保证日期连续性
 */
function fillMissingDateParts(str: string, format: string) {
  const hasYear = /Y/.test(format)
  const hasMonth = /M/.test(format)
  const hasDay = /D/.test(format)

  // 收集需要前置补充的部分（顺序：年-月-日）
  const prefixStr: string[] = []
  const prefixFmt: string[] = []

  if (!hasYear) {
    prefixStr.push('1970')
    prefixFmt.push('YYYY')
  }
  if (!hasMonth) {
    prefixStr.push('01')
    prefixFmt.push('MM')
  }
  if (!hasDay) {
    prefixStr.push('01')
    prefixFmt.push('DD')
  }

  // 无缺失直接返回
  if (prefixStr.length === 0) {
    return { str, format }
  }

  return {
    str: `${prefixStr.join('-')} ${str}`,
    format: `${prefixFmt.join('-')} ${format}`,
  }
}

/**
 * 时间字符串转为 Date 对象
 * @description 基于 dayjs 实现，支持自定义格式解析。
 * 当格式中缺少年/月/日时，自动用默认值填充（年=1970，月=01，日=01）
 *
 * @example
 * string2date('2022-05-20') // Date: 2022-05-20 00:00:00
 * string2date('2022年05月20日', 'YYYY年MM月DD日') // Date: 2022-05-20 00:00:00
 * string2date('2022-05-20 23:59:59', 'YYYY-MM-DD HH:mm:ss') // Date: 2022-05-20 23:59:59
 * string2date('2022年 23:59:59', 'YYYY年 HH:mm:ss') // Date: 2022-01-01 23:59:59
 * string2date('05-20 23:59:59', 'MM-DD HH:mm:ss') // Date: 1970-05-20 23:59:59
 * string2date('5月 23:59:59', 'M月 HH:mm:ss') // Date: 1970-05-01 23:59:59
 * string2date('23:59:59', 'HH:mm:ss') // Date: 1970-01-01 23:59:59
 *
 * @param str 时间字符串
 * @param format 格式字符串，默认 'YYYY-MM-DD'（dayjs 格式）
 * @returns Date 对象，解析失败返回 Invalid Date
 */
export function string2date(str: string, format = 'YYYY-MM-DD'): Date {
  const filled = fillMissingDateParts(str, format)
  return baseDayjs(filled.str, filled.format, true).tz(tz).toDate()
}
