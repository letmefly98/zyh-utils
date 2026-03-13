/**
 * 带分隔符的字符串拼接
 *
 * @example
 * stringJoin('/', 'a', 'b', 'c') // 'a/b/c'
 * stringJoin('&', 'a=1', '&b=2&c=3') // 'a=1&b=2&c=3'
 *
 * @param {string} separator 连接符
 * @param  {...string} strings 待拼接的字符串
 * @returns {string} 拼接后的字符串
 */
export function stringJoin(separator = '/', ...strings) {
  return strings.reduce((re, str, i) => {
    str = String(str)
    if (!i) return str
    // 去掉连接处重复的分隔符
    while (re.endsWith(separator)) re = re.slice(0, -separator.length)
    while (str.startsWith(separator)) str = str.slice(separator.length)
    return re + separator + str
  }, '')
}
