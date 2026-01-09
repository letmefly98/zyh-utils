/**
 * 缓存函数返回值，二次访问时先返回缓存，再异步更新缓存
 * @description 如果有缓存，则返回缓存并刷新缓存，否则刷新缓存并返回结果
 *
 * @example
 * const refreshList = async () => await fetch('https://example.com')
 * const fn = useCache(refreshList)
 * await fn() // 无缓存，得到结果后才返回，并写入缓存
 * await fn() // 已有缓存，立即返回缓存，并刷新缓存
 * await sleep(1000)
 * await fn() // 有新缓存，立即返回新缓存，并刷新缓存
 *
 * @param {AsyncFunction} fn 待运行的函数
 * @returns {AsyncFunction} 包含缓存逻辑的函数
 */
export function useAsyncCacheDirectly(fn, autoRefreshCache = true) {
  const cacher = new Map()
  return async (...args) => {
    const key = JSON.stringify(args)

    // 有缓存
    if (cacher.has(key)) {
      // 不异步刷新缓存，返回缓存
      if (!autoRefreshCache) {
        return cacher.get(key)
      }

      // 异步刷新缓存，并返回缓存
      fn(...args).then(res => cacher.set(key, res))
      return cacher.get(key)
    }

    // 无缓存，请求数据写入缓存，并返回
    const res = await fn(...args)
    cacher.set(key, res)

    return res
  }
}
