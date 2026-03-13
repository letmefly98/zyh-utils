import { object2string } from '../object2string/object2string.mjs'

/** 参数类型：字符串或键值对对象 */
type UrlParams = string | Record<string, unknown>

/**
 * 给链接追加参数
 * @description 支持相对路径，自动处理 ?/& 拼接，保留 hash
 *
 * @example
 * appendUrlParams('index.html', { a: 1 }) // 'index.html?a=1'
 * appendUrlParams('index.html?x=0', 'a=1') // 'index.html?x=0&a=1'
 * appendUrlParams('index.html?x=0#t', { a: 1 }) // 'index.html?x=0&a=1#t'
 *
 * @param url 链接
 * @param params 参数（字符串或对象）
 * @returns 拼接后的链接
 */
export function appendUrlParams(url: string, params?: UrlParams | null): string {
  // 清理无用的 ? 和 # (如 index.html? → index.html)
  let result = url.replace(/[?#](?=\s*$|#)/g, '')
  if (!params || (typeof params !== 'string' && typeof params !== 'object')) return result

  // 分离 hash
  const hashIdx = result.indexOf('#')
  const hash = hashIdx > -1 ? result.slice(hashIdx) : ''
  if (hashIdx > -1) result = result.slice(0, hashIdx)

  // 拼接参数
  const query = typeof params === 'object' ? object2string(params) : params
  return result + (result.includes('?') ? '&' : '?') + query + hash
}
