/**
 * 并发池类，用于控制异步任务的并发执行数量
 * @class ConcurrencyPool
 * @description 提供并发控制功能，可以限制同时执行的异步任务数量，避免资源过度消耗
 * @author YourName
 * @version 1.0.0
 * @since 1.0.0
 *
 * @example
 * // 创建一个最大并发数为3的并发池
 * const pool = new ConcurrencyPool(3);
 *
 * // 批量执行任务
 * const results = await Promise.all(
 *   data.map(item => pool.run(() => fetchData(item)))
 * );
 */
export class ConcurrencyPool {
  /**
   * 任务队列
   * @type {Function[]}
   * @private
   */
  queue = []

  /**
   * 当前正在运行的任务数量
   * @type {number}
   * @private
   */
  running = 0

  /**
   * 最大并发数限制
   * @type {number}
   * @public
   */
  limit = 3

  /**
   * 配置选项
   * @type {object}
   * @property {boolean} processWhenError - 是否在任务失败时继续执行下一个任务
   * @public
   */
  options = { processWhenError: true }

  /**
   * 创建并发池实例
   * @constructor
   * @param {number} [limit=3] - 最大并发数，默认为3
   * @param {object} [options] - 配置选项
   * @param {boolean} [options.processWhenError=true] - 是否在任务失败时继续执行下一个任务，默认为true
   *
   * @example
   * const pool = new ConcurrencyPool(5);
   *
   * @example
   * const pool = new ConcurrencyPool(3, { processWhenError: false });
   */
  constructor(limit = 3, options) {
    this.limit = limit
    this.options = { processWhenError: true, ...(options || {}) }
  }

  /**
   * 执行异步任务
   * @param {Function} task - 要执行的异步任务函数
   * @returns {Promise<*>} 返回 task 执行结果的返回值
   * @throws {Error} 当任务执行失败时抛出错误
   *
   * @example
   * // 批量执行
   * const tasks = urls.map(url =>
   *   pool.run(() => fetch(url).then(res => res.json()))
   * );
   * const results = await Promise.all(tasks);
   */
  async run(task) {
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
          if (!hasError || (hasError && this.options.processWhenError)) this._processNext()
        }
      }
      if (this.running < this.limit) {
        wrappedTask()
      } else {
        this.queue.push(wrappedTask)
      }
    })
  }

  /**
   * 处理队列中的下一个任务
   * @private
   * @method processNext
   * @returns {void}
   *
   * @description
   * 从任务队列中取出下一个任务并执行。只有在队列不为空且当前运行任务数
   * 小于限制时才会执行。
   */
  _processNext() {
    if (this.queue.length > 0 && this.running < this.limit) {
      const next = this.queue.shift()
      if (next) next()
    }
  }
}
