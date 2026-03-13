/**
 * 对象转为键值对字符串
 * {a:'1',b:'2'} 转为 a=1&b=2
 * @param {object} obj 对象
 * @param {string} divide 键值对分割符
 * @param {string} concat 键值对赋值符
 * @returns string
 */
export function objectToString(obj, divide = '&', concat = '=') {
  if (!obj || typeof obj !== 'object') return ''
  const result = []
  Object.keys(obj).forEach((key) => {
    const val = obj[key]
    result.push(encodeURIComponent(key) + concat + encodeURIComponent(val))
  })
  return result.join(divide)
}

/**
 * 给链接加上参数
 * @param {string} url 链接
 * @param {string | object} data 参数
 * @returns string
 */
const urlSearchUselessReg = /[?#]\B/g // 单独的无用的 ? 和 # 符
export function addDataToUrl(url, data) {
  let result = url.replace(urlSearchUselessReg, '')
  if (!data) return result

  let hash = ''
  const hashIndex = result.indexOf('#')
  if (hashIndex > -1) {
    hash = result.slice(hashIndex)
    result = result.slice(0, hashIndex)
  }

  const concat = result.includes('?') ? '&' : '?'

  if (typeof data === 'string') {
    return result + concat + data + hash
  } else if (typeof data === 'object') {
    return result + concat + objectToString(data) + hash
  }
  return result + hash
}

/**
 * 将 json 中某个 key 转为 key map，通常用于后续查重
 * 例如： [{id:'a',value:1}] 转变为 { a:1 }
 * @param {Array} data
 * @param {string} keyName
 * @param {string} valueName
 * @returns object
 */
export function jsonToObject(data, keyName = '', valueName = '') {
  const result = {}
  data.forEach((item, index) => {
    const name = keyName ? item[keyName] : item
    const value = keyName ? (valueName ? item[valueName] : item) : index
    result[name] = value
  })
  return result
}
