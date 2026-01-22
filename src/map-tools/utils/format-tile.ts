import type { Area, Point } from '../types/base'
import { gcj2wgs, offsetPosition, wgs2gcj } from './format-point'
import { getRectCorner } from './format-rect'
import { MapTool } from './libs/map-tool'

// 获取当前地图 Tile 级别下 Tile 瓦片的尺寸
export function getTileSize(tileLevel: number): number {
  return MapTool.level2distance(tileLevel)
}

// 该点在当前地图 Tile 级别下所在的 Tile 瓦片 Id
export function getTileId(p: Point, tileLevel: number, useMagic = false): number {
  // 若 p 为 tile 瓦片的角落，计算时可能会有误差，稍稍偏移一点提高结果准确性
  if (useMagic) p = offsetPosition(p, { lat: 0.001, lng: 0.002 })
  const wgs = gcj2wgs(p)
  return MapTool.wgs2tileid(wgs.lng, wgs.lat, tileLevel)
}

// 获取该地图 Tile 瓦片左下角坐标
export function getTileCorner(tileId: number): Point {
  const [lng, lat] = MapTool.tileid2wgs(tileId)
  return wgs2gcj({ lat, lng })
}

// 用左下角数据，得到地图 tile 瓦片矩形的 4 个角，[左上，右上，右下，左下]
export function getTileRect(lb: Point, dist: number): Area {
  const lt = getRectCorner(lb, dist, 'lt')
  const rt = getRectCorner(lb, dist, 'rt')
  const rb = getRectCorner(lb, dist, 'rb')
  return [lt, rt, rb, lb]
}
