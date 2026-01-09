/**
 * 用于同步函数，二次访问时若 getKey 结果一致则返回缓存
 *
 * @param callback - 需要缓存的函数
 * @param getKey - 可选的缓存键生成函数，默认使用 JSON.stringify 序列化参数
 * @returns 带缓存功能的函数
 *
 * @example
 * ```typescript
 * // 基本用法
 * const cachedFn = useCache((x: number) => x * 2)
 *
 * // 自定义 key 生成
 * const cachedFn2 = useCache(
 *   (obj: {id: number, name: string}) => `${obj.id}-${obj.name}`,
 *   (obj) => String(obj.id) // 只根据 id 缓存
 * )
 * ```
 */
export function useCache<F extends (...args: any[]) => any>(
  callback: F,
  getKey?: (...args: Parameters<F>) => string,
): F {
  const getKeyFn = typeof getKey === 'function'
    ? getKey
    : (...args: Parameters<F>) => {
        // 自定义序列化以正确处理 undefined
        return JSON.stringify(args, (key, value) => {
          return value === undefined ? '__UNDEFINED__' : value
        })
      }
  const cacheMap = new Map<string, ReturnType<F>>()

  function handler(...args: Parameters<F>): ReturnType<F> {
    // 自由计算 cache key。比如相同请求函数，入参不同也能缓存，只要算出的 key 一致则读缓存
    const cacheKey = getKeyFn(...args)

    // 有缓存返回缓存
    if (cacheMap.has(cacheKey)) {
      return cacheMap.get(cacheKey)!
    }

    // 否则执行函数并缓存
    const result = callback(...args)
    cacheMap.set(cacheKey, result)
    return result
  }

  return handler as unknown as F
}
