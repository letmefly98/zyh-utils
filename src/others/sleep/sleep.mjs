/**
 * 等待
 *
 * @example
 * await sleep(1000)
 * console.log('after 1s') // 1s 后继续执行
 *
 * @async
 * @param {number} [ms=1000] 等待时间（毫秒）
 * @returns void
 */
export async function sleep(ms = 1000) {
  await new Promise(resolve => setTimeout(resolve, Math.max(0, ms)))
}
