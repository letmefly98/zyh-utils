/**
 * 创建一个异步重复执行函数，直到条件不满足为止
 *
 * @description
 * 传入异步执行函数 A、条件判断函数 B 和参数格式化函数 C，返回一个新函数。
 * 调用新函数时会循环执行 A，每次通过 C 格式化参数，将 A 的返回值和当前索引传给 B，
 * 若 B 返回 true 则继续执行，返回 false 则停止，最终返回所有 A 的返回值数组。
 *
 * @example
 * // 分页加载示例
 * const fn = repeatUntilAsync(
 *   async (page: number) => fetchPage(page),
 *   (_i, res) => res.hasMore,
 *   (i, params, ...rest) => [{ ...params, page: i + 1}, ...rest],
 * )
 * await fn(1) // [page1, page2, page3]
 *
 * @param executor 异步执行函数 A，每次循环调用
 * @param shouldContinue 条件判断函数 B，接收 (index, result)，返回 true 继续，false 停止（默认 false，只执行一次）
 * @param formatParams 参数格式化函数 C，接收 (index, ...args)，返回格式化后的参数（默认保持原参数不变）
 * @returns 返回新函数，返回 Promise<结果数组>
 */
export function repeatUntilAsync<F extends (...args: never[]) => unknown, P extends Parameters<F>, R extends Awaited<ReturnType<F>>>(
  executor: F,
  shouldContinue: (index: number, result: R) => boolean,
  formatParams: (index: number, ...args: P) => P = (_i, ...args) => args,
): (...args: P) => Promise<R[]> {
  return async (...args: P) => {
    const results: R[] = []
    for (let i = 0; ; i++) {
      const params = formatParams(i, ...args)
      const val = await executor(...params) as R
      results.push(val)
      if (!shouldContinue(i, val)) return results
    }
  }
}
