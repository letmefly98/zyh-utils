import type { Point } from '../types/draw'
import { checkPointOnLine } from './check-point-on-line'
import { point2ll } from './format-point'

const toRad = (deg: number) => (deg * Math.PI) / 180

/**
 * 点与点的距离
 */
export function getDistanceDot2Dot(p1: Point, p2: Point): number {
  return TMap.geometry.computeDistance([point2ll(p1), point2ll(p2)]) || 0
}

/**
 * 计算整条 link 中所有线段的总长度
 */
export function getDistanceOfLink(path: Point[]) {
  let totalDistance = 0
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += getDistanceDot2Dot(path[i], path[i + 1])
  }
  return totalDistance
}

/**
 * 计算坐标点和首端点的距离
 * 其中，link 有多条线段，点到 link 的垂足在线段上，返回垂足到首端点的距离
 */
export function getDistanceToLinkStart(point: Point, path: Point[]): number {
  if (path.length < 2) return 0

  let accumulatedDistance = 0

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i]
    const p2 = path[i + 1]
    const segmentLength = getDistanceDot2Dot(p1, p2)

    const res = checkPointOnLine(point, [p1, p2])

    if (res.on === undefined) continue // 异常情况跳过

    // 点在线段上，返回垂足到首端点的距离
    if (res.on === 'line') {
      const footDistance = res.percent * segmentLength
      return accumulatedDistance + footDistance
    }

    // 点不在本线段上，可能在后续线段上，继续向后增加长度
    accumulatedDistance += segmentLength
  }

  return accumulatedDistance
}

/**
 * 使用 Haversine 公式计算两点间的距离（单位：米）
 */
export function haversineDistance(p1: TMap.LatLng, p2: TMap.LatLng): number {
  const R = 6371000 // 地球半径（米）

  const lat1 = toRad(p1.lat)
  const lat2 = toRad(p2.lat)
  const deltaLat = toRad(p2.lat - p1.lat)
  const deltaLng = toRad(p2.lng - p1.lng)

  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
