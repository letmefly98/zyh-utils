/**
 * 获取字节大小文本
 * @example
 * getByteSizeText(1024 * 1024 * 1024) // 1.00G
 *
 * @param {number} value 字节数
 * @param {string[]} [units=['B', 'KB', 'MB', 'GB', 'TB']] 单位
 * @returns {string} 字节大小文本
 */
export function getByteSizeText(value, units = ['B', 'KB', 'Mb', 'G', 'T', 'P', 'E', 'Z']) {
  if (typeof value !== 'number' || Number.isNaN(value)) return ''
  if (value < 0) return ''

  if (units.length === 1) return `${value}${units[0]}`

  const BYTES_PER_UNIT = 1024
  let result = ''
  for (const unit of units) {
    if (value < BYTES_PER_UNIT) {
      result = `${Number(value.toFixed(3))}${unit}`
      break
    }
    value /= BYTES_PER_UNIT
  }

  return result
}
