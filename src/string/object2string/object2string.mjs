import { typeOf } from '../typeOf/typeOf.mjs'

/**
 * 键值对转字符串
 * @description 键和值都会进行 encodeURIComponent 处理
 *
 * @example
 * object2string({ a: 1, b: 2 }) // 'a=1&b=2'
 * object2string({ a: 1, b: 2 }, ',', ':') // 'a:1,b:2'
 *
 * @param {object} obj 键值对对象
 * @param {string} [divide="&"] 多键值对分割符
 * @param {string} [concat="="] 键值连接符
 * @returns {string} 结果字符串
 */
export function object2string(obj, divide = '&', concat = '=') {
  if (!obj || typeof obj !== 'object') return ''
  const result = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let val = obj[key]
      if (val === undefined || val == null || Number.isNaN(val)) val = ''
      if (Array.isArray(val)) val = val.map(e => encodeURIComponent(e)).join(',')
      else if (typeOf(val) === 'object') val = encodeURIComponent(JSON.stringify(val))
      else val = encodeURIComponent(val)
      result.push(encodeURIComponent(key) + concat + val)
    }
  }
  return result.join(divide)
}
