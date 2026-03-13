/**
 * 字符串转键值对
 * @description 自动将 'undefined'/'null'/'true'/'false'/数字字符串 转为对应类型
 *
 * @example
 * string2object('a=1&b=2') // { a: 1, b: 2 }
 * string2object('a:1,b:2', ',', ':') // { a: 1, b: 2 }
 *
 * @param {string} str 键值对字符串
 * @param {string} [divide="&"] 多键值对分割符
 * @param {string} [concat="="] 键值连接符
 * @returns {object} 解析后的对象
 */
export function string2object(str, divide = '&', concat = '=') {
  if (!str || typeof str !== 'string') return {}
  if (typeof divide !== 'string' || !divide) throw new Error('divide must be a string')
  if (typeof concat !== 'string' || !concat) throw new Error('concat must be a string')

  const list = str.split(divide)
  const result = list.reduce((re, cur) => {
    if (!cur.trim()) return re

    const tmp = cur.split(concat)
    const key = tmp.shift().trim()
    if (!key) return re // 跳过空 key

    let val = tmp.join(concat).trim()

    if (val === 'undefined') val = undefined
    else if (val === 'null') val = null
    else if (val === 'true') val = true
    else if (val === 'false') val = false
    // eslint-disable-next-line unicorn/prefer-number-properties
    else if (val && !isNaN(val)) val = Number(val)

    re[key] = val

    return re
  }, {})

  return result
}
