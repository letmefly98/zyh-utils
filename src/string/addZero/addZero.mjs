/**
 * 补零
 *
 * @example
 * addZero(1) // 01
 * addZero(23, 4) // 0023
 *
 * @param {number|string} num 数字
 * @param {number} len 长度
 * @returns {string} 补零后的字符串
 */
export function addZero(num, len = 2) {
  if (Number.isNaN(num) || num === undefined || num === null) return ''
  let result = `${num}`
  let numLen = result.length
  len = Math.max(+len, 0)
  while (numLen++ < len) result = `0${result}`
  return result
}
