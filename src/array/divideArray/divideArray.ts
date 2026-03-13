/**
 * 将数组拆分为多个，符合条件的放前面，不符合的放最后
 *
 * @example
 * // 按单个条件拆分
 * const [small, rest] = divideArray([1, 5, 2, 4, 3], [num => num < 3])
 * // small: [1, 2], rest: [5, 4, 3]
 *
 * @example
 * // 按多个条件拆分
 * const [a, b, c] = divideArray([1, 2, 3, 1, 1, 3], [num => num === 2, num => num === 3])
 * // a: [2], b: [3, 3], c: [1, 1, 1]
 *
 * @param array 源数组
 * @param filterMethods 筛选函数数组，返回 n+1 个子数组（n 个匹配 + 1 个剩余）
 */
export function divideArray<T>(
  array: T[],
  filterMethods: Array<(item: T, index: number, arr: T[]) => boolean> = [],
): T[][] {
  const length = filterMethods.length + 1
  const result: T[][] = Array.from({ length }, () => [])

  Array.from(array).forEach((item, index, arr) => {
    const filterIndex = filterMethods.findIndex(method => method(item, index, arr))
    if (filterIndex > -1) {
      result[filterIndex].push(item)
    } else {
      result[length - 1].push(item)
    }
  })

  return result
}
