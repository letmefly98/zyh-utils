import type { Point } from '../types/base'
import { average } from '@/number/math/math'

// 取link串形点中间两点的中间位置
export function getMiddlePosition(points: Point[]) {
  const length = points.length
  // 仅1个点，直接返回
  if (length < 2) return points[0]
  // 奇数点，取中间点
  if (length % 2 === 1) {
    const m = Math.floor(length / 2)
    return points[m]
  }
  // 偶数点，取中间两点，再取中间位置
  const m1 = Math.round(length / 2) - 1
  const m2 = m1 + 1
  const mLat = average(points[m1].lat, points[m2].lat)
  const mLng = average(points[m1].lng, points[m2].lng)
  return { lat: mLat, lng: mLng }
}
