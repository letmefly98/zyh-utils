import type { Point } from '../types/draw'

// 异常情况
interface ErrorCase {
  on: undefined
  errMsg?: string
}

// 在线段前延长线
interface OnPrev {
  on: 'prev'
  prev: Point
}

// 在线段后延长线
interface OnNext {
  on: 'next'
  next: Point
}

// 在线段上
interface OnLine {
  on: 'line'
  cross: Point
  percent: number // 范围[0,1]
}

//
type CheckResult = ErrorCase | OnPrev | OnNext | OnLine

/**
 * 判断点与线段的垂足是否在线段上
 *
 * @param point - 目标点坐标
 * @param line - 线段，由两个点组成的数组 [起点, 终点]
 * @returns 检查结果对象
 *
 * @example
 * ```typescript
 * const point = { lng: 116.404, lat: 39.915 }
 * const line = [
 *   { lng: 116.400, lat: 39.915 },
 *   { lng: 116.410, lat: 39.915 }
 * ]
 * const result = checkPointOnLine(point, line)
 *
 * if (result.on === 'line') {
 *   console.log(`垂足在线段上，位置比例: ${result.percent}`)
 * } else if (result.on === 'prev') {
 *   console.log('垂足在前延长线上')
 * } else if (result.on === 'next') {
 *   console.log('垂足在后延长线上')
 * }
 * ```
 */
export function checkPointOnLine(point: Point, line: [Point, Point]): CheckResult {
  const [p1, p2] = line
  const dx = p2.lng - p1.lng
  const dy = p2.lat - p1.lat
  const lenSq = dx * dx + dy * dy

  // 仅单点，非线段，跳过这段
  if (lenSq === 0) return { on: undefined }

  // t=0垂足为线段起点，t=1垂足为线段终点，t<0 || t>1垂足在延长线上
  const t = ((point.lng - p1.lng) * dx + (point.lat - p1.lat) * dy) / lenSq

  // 垂足在线段延长线上
  if (t < 0) return { on: 'prev', prev: { ...p1 } }
  if (t > 1) return { on: 'next', next: { ...p2 } }

  // 比如跑道长100米，t=0.3，那垂足距离起点就是 30 米
  const crossLng = p1.lng + t * dx
  const crossLat = p1.lat + t * dy
  const cross = { lat: crossLat, lng: crossLng }
  return { on: 'line', cross, percent: t }
}
