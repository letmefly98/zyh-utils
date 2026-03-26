/**
 * 等待条件满足，超时抛错
 *
 * @description
 * 轮询检查回调函数返回值，直到返回 true 或超时。
 * 每次检查间隔 100ms，若超时则抛出 Error。
 *
 * @example
 * // 等待某个状态变为 true
 * let ready = false
 * setTimeout(() => { ready = true }, 500)
 * await waitFor(() => ready, 1000) // 500ms 后条件满足，resolve
 *
 * @example
 * // 超时场景
 * await waitFor(() => false, 100) // 100ms 后抛出 Error: timeout after 100ms
 *
 * @param callback 条件判断函数，返回 true 表示条件满足
 * @param timeout 超时时间（毫秒）
 * @param interval 检查间隔（毫秒），默认 100ms
 * @returns Promise<void> 条件满足时 resolve，超时时 reject
 * @throws {Error} 超时时抛出 `timeout after ${timeout}ms`
 */
export function waitFor(
  callback: () => boolean,
  timeout: number,
  interval: number = 100,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const check = () => {
      try {
        if (callback()) {
          resolve()
          return
        }
      }
      catch (error) {
        reject(error)
        return
      }

      if (Date.now() - start >= timeout) {
        reject(new Error(`timeout after ${timeout}ms`))
        return
      }

      setTimeout(check, interval)
    }

    check()
  })
}
