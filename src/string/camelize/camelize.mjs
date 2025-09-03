/**
 * 转为驼峰格式字符串
 *
 * @example
 * hyphenate('font-size') => 'fontSize'
 *
 * @param {string} str 任意字符串
 * @returns {string} 驼峰格式字符串
 */
export function camelize(str) {
  if (!str || typeof str !== 'string') str = `${str}`
  return str.toLowerCase().replace(/-(\w)/g, (_, s) => s.toUpperCase())
}
