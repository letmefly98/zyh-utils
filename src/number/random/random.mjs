/**
 * 某范围内的随机数
 *
 * @example
 * random(2) // 0-2 之间的随机数
 * random(2, 10) // 2-10 之间的随机数
 *
 * @param {number} n 范围值1
 * @param {number} [m=0] 范围值2
 * @returns {number} 0-n/n-m 之间的随机数
 */
export function random(n, m = 0) {
  if (n === undefined || n === null) return Number.NaN
  if (m === undefined || m === null) return Number.NaN
  const min = Math.min(n, m)
  const max = Math.max(n, m)
  return min + Math.random() * (max - min)
}
