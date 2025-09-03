/**
 * 判断类型
 * @param {Any} obj 任何数据
 * @returns string
 */
export const typeOf = obj => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()

/**
 * 补零
 * @param {number} num 数字
 * @param {number} len 长度
 * @returns {string} 补零后的数字字符串
 */
export function addZero(num, len = 2) {
  if (Number.isNaN(num) || num === undefined) return ''
  let result = `${num}`
  let numLen = result.length
  while (numLen++ < len) result = `0${result}`
  return result
}

/**
 * 驼峰转连字符
 * @example hyphenate('fontSize') // font-size
 * @param {string} str 字符串
 * @returns {string} 连字符字符串
 */
export function hyphenate(str) {
  if (!str || typeof str !== 'string') return ''
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 连字符转驼峰
 * 比如 font-size 返回 fontSize
 * @param {string} str 连字符字符串
 * @returns string
 */
export function camelize(str) {
  if (!str || typeof str !== 'string') return ''
  return str.toLowerCase().replace(/-(\w)/g, (_, s) => s.toUpperCase())
}

/**
 * 对象中的 key 转为驼峰
 * 比如 {'font-size':1} 返回 {fontSize:1}
 * @param {object} obj
 * @returns object
 */
export function camelizeKeys(obj) {
  const result = {}
  if (!obj) return result
  Object.keys(obj).forEach((k) => {
    const key = camelize(k)
    result[key] = obj[k]
  })
  return result
}

/**
 * 获取某范围内的随机数
 * @param {number} n 范围值1
 * @param {number} m 范围值2
 * @returns number
 */
export function random(n, m = 0) {
  const min = Math.min(n, m)
  const max = Math.max(n, m)
  return min + Math.random() * (max - min)
}

/**
 * 延迟
 * @param {number} wait 延时时长
 * @returns promise<void 0>
 */
export const sleep = wait => new Promise(resolve => setTimeout(resolve, wait))
