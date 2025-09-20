/**
 * 通用单位值格式化工具
 * @example
 * formatUnitValue(1024) // 1KB (字节单位)
 * formatUnitValue(86400, ['秒', '分', '小时', '天'], 60, 0) // 1天 (时间单位)
 * formatUnitValue(1500000, ['', '万', '亿'], 10000, 2) // 150.00万 (数字单位)
 *
 * @param {number} value 原始数值
 * @param {string[]} [units=['B', 'KB', 'MB', 'GB', 'TB']] 单位数组
 * @param {number} [base=1024] 进制基数
 * @param {number} [precision=3] 小数位数
 * @returns {string} 格式化后的单位文本
 */
export function formatUnitValue(value, units = ['B', 'KB', 'MB', 'GB', 'TB'], base = 1024, precision = 3) {
  if (typeof value !== 'number' || Number.isNaN(value)) return ''
  if (value < 0) return ''

  if (units.length === 1) return `${Number(value.toFixed(precision))}${units[0]}`

  let currentValue = value
  let unitIndex = 0

  // 从最小单位开始，逐步转换到更大的单位
  while (unitIndex < units.length - 1 && currentValue >= base) {
    currentValue /= base
    unitIndex++
  }

  return `${Number(currentValue.toFixed(precision))}${units[unitIndex]}`
}
