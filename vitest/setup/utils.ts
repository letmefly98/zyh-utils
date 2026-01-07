// 等待结果，超时抛错
export function waitFor(callback: () => boolean, timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const check = () => {
      if (callback()) {
        resolve()
        return
      }

      if (Date.now() - start > timeout) {
        reject(new Error(`timeout after ${timeout}ms`))
        return
      }

      setTimeout(check, 100)
    }

    check()
  })
}
