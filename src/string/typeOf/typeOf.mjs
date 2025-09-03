/**
 * 获得真实的数据类型
 *
 * @param {any} obj 任意数据
 * @returns {string} 入参的数据类型
 */
export function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
