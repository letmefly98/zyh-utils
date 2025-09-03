interface Options {
  processWhenError?: boolean
}

/**
 * 并发池
 *
 * @example
 * const pool = new ConcurrencyPool(3);
 * const results = await Promise.all(data.map(e=> pool.run(() => method(e)));
 */
export class ConcurrencyPool {
  private queue: Array<() => void> = []

  private running = 0

  private limit: number = 3

  private options: Options = {}

  constructor(limit: number, options?: Options) {
    this.limit = limit
    this.options = { processWhenError: true, ...(options || {}) }
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        this.running++
        let hasError = false
        try {
          const result = await task()
          resolve(result)
        } catch (error) {
          hasError = true
          reject(error)
        } finally {
          this.running--
          if (!hasError || (hasError && this.options.processWhenError)) this.processNext()
        }
      }
      if (this.running < this.limit) {
        wrappedTask()
      } else {
        this.queue.push(wrappedTask)
      }
    })
  }

  private processNext() {
    if (this.queue.length > 0 && this.running < this.limit) {
      const next = this.queue.shift()!
      next()
    }
  }
}
