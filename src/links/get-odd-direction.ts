/**
 * 与 get-link-direction.ts 类似，使用场景和出入参都相同
 *
 * 考虑起终点对应的方向为汽车行驶方向，若汽车行驶方向与道路顺序一致，则为1，否则为2
 */

import type { DirectionResult, LinkInfo } from './get-link-direction'

export function getOddDirection(
  links: LinkInfo[],
  startPointIndex: number,
  endPointIndex: number,
): DirectionResult[] {
  const result = Array.from<DirectionResult>({ length: links.length }).fill(0)

  if (links.length < 2) {
    console.info('道路数组长度最小为2，请检查')
    return []
  }

  // 确定汽车行驶方向：从起点到终点的方向
  const isForward = startPointIndex < endPointIndex
  const startIndex = Math.min(startPointIndex, endPointIndex)
  const endIndex = Math.max(startPointIndex, endPointIndex)

  // 为路径上的每个链接确定方向
  // 简化逻辑：只考虑汽车行驶方向，不考虑道路几何连接
  for (let i = startIndex; i <= endIndex; i++) {
    // 如果汽车向前行驶，所有道路都标记为1（顺向）
    // 如果汽车向后行驶，所有道路都标记为2（逆向）
    result[i] = isForward ? 1 : 2
  }

  return result
}
