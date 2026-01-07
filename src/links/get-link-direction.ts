import type { DirectionResult, LinkInfoItem } from './types'
/**
 * 已知有一批道路数据，格式为 LinkInfo，他们具有几何连续性。
 * 连续是指前 link 的 nodeId 与后 link 的 nodeId 存在相等，比如前 link 的 elinkNodeId 与后 link 的 slinkNodeId/elinkNodeId 相等，则两条道路连续。
 * 道路的几何方向前后端点不太固定，比如双向道路与前 link 相连的可能是 elinkNodeId 后端点。
 * 另外，还有车辆行驶起点和终点，为 links 数组的任意索引。
 *
 * 实现函数：传入多个有连续性的 LinkInfo，返回相等长度的 DirectionResult 类型数组。
 * 不在起终点范围内的为0，剩下的判断行驶时几何方向：起点在该道路前方且若 slinkNodeId 靠前，则为1
 */

export function getLinksDirection(
  links: LinkInfoItem[],
  startPointIndex: number,
  endPointIndex: number,
): DirectionResult[] {
  const result = Array.from<DirectionResult>({ length: links.length }).fill(0)

  if (links.length < 2) {
    // console.info('道路数组长度最小为2，请检查')
    return []
  }

  const startIndex = Math.min(startPointIndex, endPointIndex)
  const endIndex = Math.max(startPointIndex, endPointIndex)

  for (let i = startIndex; i <= endIndex; i++) {
    const link = links[i]
    let actualStartNode: number

    if (i === startIndex) {
      if (i === endIndex) {
        actualStartNode = link.slinkNodeId
      } else {
        const nextLink = links[i + 1]
        // 第一个链接的方向判断
        if (link.elinkNodeId === nextLink.slinkNodeId || link.elinkNodeId === nextLink.elinkNodeId) {
          actualStartNode = link.slinkNodeId
        } else {
          actualStartNode = link.elinkNodeId
        }
      }
    } else {
      const prevLink = links[i - 1]
      // 其他链接的方向判断
      if (prevLink.elinkNodeId === link.slinkNodeId) {
        actualStartNode = link.slinkNodeId
      } else if (prevLink.elinkNodeId === link.elinkNodeId) {
        actualStartNode = link.elinkNodeId
      } else if (prevLink.slinkNodeId === link.slinkNodeId) {
        actualStartNode = link.slinkNodeId
      } else {
        actualStartNode = link.elinkNodeId
      }
    }

    result[i] = actualStartNode === link.slinkNodeId ? 1 : 2
  }

  return result
}
