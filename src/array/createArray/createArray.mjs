/**
 * 创建指定长度的递增数字数组
 *
 * @param {number} length
 * @param {number} [start] 递增的起始值
 * @returns {number[]} 递增数字的数组
 */
export function createArray(length, start = 0, format = i => i) {
  if (typeof start === 'function') {
    format = start
    start = 0
  }
  return Array.from({ length }, (_, i) => start + i).map(format)
}
