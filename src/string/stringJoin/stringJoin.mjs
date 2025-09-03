/**
 * 带分隔符的字符串拼接，类似 nodejs 的 path.join
 *
 * @example
 * stringJoin('/', 'a', 'b', 'c') // 'a/b/c'
 * stringJoin('&', 'a=1', '&b=2&c=3') // 'a=1&b=2&c=3'
 *
 * @param {string} separator
 * @param  {...string} strings
 * @returns {string} 拼接后的字符串
 */
export function stringJoin(separator = '/', ...strings) {
  return strings.reduce((re, str, index) => {
    if (!str || typeof str !== 'string') str = `${str}`
    if (index === 0) return str
    const sep = str.startsWith(separator) ? '' : separator
    if (re.endsWith(separator)) re = re.slice(0, -1 * separator.length)
    return re + sep + str
  }, '')
}
