/**
 * 转为内存值字符串
 * @param {number} value 内存大小
 * @returns string
 */
export function fileSize(value) {
  value = Number.parseInt(value, 0) || 0
  if (value <= 1024 * 10) return `${(value / 1024).toFixed(2)}KB`
  value = value / 1024 / 1024
  if (value < 1024) {
    return `${value.toFixed(2)}M`
  }
  value = value / 1024
  return `${value.toFixed(2)}G`
}
