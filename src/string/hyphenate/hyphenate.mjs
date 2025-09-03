/**
 * 转为连字符格式字符串
 *
 * @example
 * hyphenate('fontSize') => 'font-size'
 * hyphenate（'HelloWorld') => 'hello-world'
 *
 * @param {string} str 任意字符串
 * @returns {string} 连字符格式字符串
 */
export function hyphenate(str) {
  if (!str || typeof str !== 'string') str = `${str}`
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}
