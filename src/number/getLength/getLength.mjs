/**
 * 获得对象长度，包括 utf16 字符、数组、对象
 *
 * @example
 * getLength({a:1}) // 1
 * getLength('😃') // 1，注意 '😃'.length === 2
 *
 * @param {any} obj 任意对象
 * @returns {number} 长度
 */
export function getLength(obj) {
  if (!obj) return 0
  let count = 0
  if (typeof obj === 'string') {
    // eslint-disable-next-line no-unused-vars
    for (const _ of obj) count++
  } else if (typeof obj === 'number') {
    count = 0
  } else {
    return Object.keys(obj).length
  }
  return count
}
