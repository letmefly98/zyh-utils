import { get } from 'lodash-es'

/**
 * 输出对象数组中某个键对应的所有的值拼成的字符串
 *
 * @example
 * // 使用字符串 key
 * const arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}]
 * arrayJoin(arr, 'name')  // a,b,c
 * arrayJoin(arr, 'name', '-')  // a-b-c
 *
 * @example
 * // 使用函数 key
 * const arr = [{user: {name: 'a'}}, {user: {name: 'b'}}]
 * arrayJoin(arr, item => item.user?.name)  // a,b
 * arrayJoin(arr, item => item.user?.name, ' | ')  // a | b
 */
export function arrayJoin<T>(arr: T[], key?: undefined, separator?: string): string
export function arrayJoin<T>(arr: T[], key: string, separator?: string): string
export function arrayJoin<T>(arr: T[], key: (item: T) => any, separator?: string): string
export function arrayJoin<T>(
  arr: T[],
  key?: string | ((item: T) => any),
  separator = ',',
): string {
  if (!Array.isArray(arr) || arr.length === 0) return ''

  // 将 'name'、'user.profile.name'、(e) => e.name 等入参规范化为统一的取值函数
  const getValue = createValueExtractor(key)

  // 抽取对应的可用值，剔除 undefined、null、NaN、boolean、空字符串
  const values = arr.reduce((acc, item) => {
    const value = getValue(item)
    if (isValidValue(value)) acc.push(String(value))
    return acc
  }, [] as string[])

  // 生成字符串
  return values.join(separator)
}

// 创建值提取器函数
function createValueExtractor<T>(key?: string | ((item: T) => string | number | null | undefined)) {
  if (typeof key === 'function') return key
  if (typeof key === 'string') return (item: T) => get(item, key, undefined)
  return (item: T) => item
}

// 过滤无效值：undefined、null、NaN、boolean、空字符串
function isValidValue(str: unknown): boolean {
  if (str === undefined || str === null) return false
  if (typeof str === 'boolean') return false
  if (typeof str === 'number' && Number.isNaN(str)) return false
  if (typeof str === 'string' && str.trim() === '') return false
  return true
}
