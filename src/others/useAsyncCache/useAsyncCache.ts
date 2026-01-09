/**
 * 用于异步函数，二次访问时若 getKey 结果一致则返回缓存，若相同请求且已有发起则等待返回后再用缓存
 */
export function useAsyncCache<F extends (...args: any[]) => Promise<any>>(
  callback: F,
  getKey?: (...args: Parameters<F>) => string,
): F {
  type ResolvedType = Awaited<ReturnType<F>>
  const justify = typeof getKey === 'function' ? getKey : () => 'one'
  const paramsMap = new Map<string, { resolve: (res: ResolvedType) => void, reject: (reason?: any) => void }[]>()
  const cacheMap = new Map<string, ResolvedType>()

  function handler(...args: Parameters<F>): ReturnType<F> {
    // 自由计算 cache key。比如相同请求函数，入参不同也能缓存，只要算出的 key 一致则读缓存
    const cacheKey = justify(...args)

    // 若前面的异步函数未返回，先存进队列
    if (paramsMap.has(cacheKey)) {
      return new Promise((resolve, reject) => {
        paramsMap.get(cacheKey)?.push({ resolve, reject })
      }) as ReturnType<F>
    }

    // 若前面的异步函数已返回，且有缓存，则返回缓存
    if (cacheMap.has(cacheKey)) {
      const cache = cacheMap.get(cacheKey)!
      return Promise.resolve(cache) as ReturnType<F>
    }

    // 否则执行函数并缓存
    paramsMap.set(cacheKey, [])
    return new Promise((resolve, reject) => {
      callback(...args)
        .then((result: ResolvedType) => {
          resolve(result)
          const query = paramsMap.get(cacheKey)!
          query.forEach(({ resolve: done }) => done(result))
          paramsMap.delete(cacheKey)
          cacheMap.set(cacheKey, result)
        })
        .catch((error) => {
          reject(error)
          const query = paramsMap.get(cacheKey)!
          query.forEach(({ reject: fail }) => fail(error))
          paramsMap.delete(cacheKey)
        })
    }) as ReturnType<F>
  }

  return handler as unknown as F
}
