/**
 * 扩展字符串 includes 方法，支持传入数组判断包含
 *
 * @example
 * filterKey(str, 'a') // str.includes('a')
 * filterKey(str, ['a', 'b']) // str.includes('a') || str.includes('b')
 *
 * @param {string} str 源字符串
 * @param {string|string[]} filter 判断包含内容
 * @returns {boolean} 是否包含
 */
export function includesPro(str, filter = '') {
  // 只要源字符串不是字符串就返回 false
  if (typeof str !== 'string') return false

  const isArr = Array.isArray(filter)

  // 过滤内容传入特殊数据，转为字符串
  if (typeof filter !== 'string' && !isArr) filter = `${filter}`

  // 过滤内容为空就返回 true
  if (!filter || (isArr && filter.length === 0)) return true

  // 判断包含
  if (isArr) return filter.some(e => str.includes(e))
  return str.includes(filter)
}
