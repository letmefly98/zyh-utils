import type { Point } from '../types/draw'

/**
 * 计算坐标点偏移
 */
export function offsetPosition(point: Point, offset: Point) {
  return { lat: point.lat + offset.lat, lng: point.lng + offset.lng }
}

// 获取地图级数
export function getMapLevel(mapIns: TMap.Map, forTile = false) {
  const zoom = Math.round(mapIns.getZoom() || 13)
  if (!forTile) return zoom
  const minZoom = 7
  const maxZoom = 14
  const mapLevel = Math.max(minZoom, Math.min(maxZoom, zoom))
  return mapLevel
}
