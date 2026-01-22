import type { Point, PointRect } from '../types/base'
import { offsetPosition, point2ll } from './format-point'

/**
 * 获取视窗范围的左下&右上角坐标
 */
export function getRectByScreen(map: TMap.Map): PointRect {
  const bounds = map.getBounds() // 当前视窗

  // 视窗的左下角坐标
  const screenSW = bounds.getSouthWest()
  const lb = new TMap.LatLng(screenSW.lat, screenSW.lng)

  // 视窗的右上角坐标
  const screenNE = bounds.getNorthEast()
  const rt = new TMap.LatLng(screenNE.lat, screenNE.lng)

  return { lb, rt }
}

/**
 * 路线或多边形的左下&右上角坐标
 */
export function getRectByPath(path: Point[]): PointRect {
  const bounds = TMap.geometry.computeBoundingRectangle(path.map(point2ll))
  const lb = bounds.getSouthWest()
  const rt = bounds.getNorthEast()
  return { lb, rt }
}

/**
 * 框选交互时，获取框的左下&右上角坐标
 */
export function getRectByEvent(e: any): PointRect {
  // 鼠标点位，start为拖拽起始点，end为拖拽结束点
  const end = e.position
  const start = new TMap.LatLng(2 * e.geometry.center.lat - e.position.lat, 2 * e.geometry.center.lng - e.position.lng)

  // 拖拽区域的左下角坐标
  const minLat = Math.min(start.lat, end.lat)
  const minLng = Math.min(start.lng, end.lng)
  const lb = new TMap.LatLng(minLat, minLng)

  // 拖拽区域的右上角坐标
  const maxLat = Math.max(start.lat, end.lat)
  const maxLng = Math.max(start.lng, end.lng)
  const rt = new TMap.LatLng(maxLat, maxLng)

  return { lb, rt }
}

/**
 * 用左下角数据，算出其他角的数据
 */
export function getRectCorner(sw: Point, dist: number, direction: 'lt' | 'lb' | 'rt' | 'rb'): Point {
  if (direction === 'lb') return sw
  const distLat = direction === 'lt' || direction === 'rt' ? dist : 0
  const distLng = direction === 'rb' || direction === 'rt' ? dist : 0
  return offsetPosition(sw, { lat: distLat, lng: distLng })
}

/**
 * 获取多边形中心
 */
export function getRectCenter(path: Point[]): Point {
  const bounds = TMap.geometry.computeBoundingRectangle(path.map(point2ll))
  const center = bounds.getCenter()
  return center
}
