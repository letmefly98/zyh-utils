import type { Point } from '../types/draw'
import { gcj2wgs, point2ll, wgs2gcj } from './format-point'
import { CoordinateTransform } from './libs/coordinate-transform'
import { MapTool } from './libs/map-tool'

// 获取 Tile 宽度
export function getLevelDistance(tileLevel: number) {
  return MapTool.level2distance(tileLevel)
}

// 点在当前地图级别下所在的 TileId
export function getTileId(p: Point, tileLevel: number) {
  return MapTool.wgs2tileid(p.lng, p.lat, tileLevel)
}

// 获取该 Tile 左下角坐标
export function getCornerByTileId(tileId: number) {
  const [wgsLng, wgsLat] = MapTool.tileid2wgs(tileId)
  return new TMap.LatLng(wgsLat, wgsLng)
}

// 根据瓦片ID，算出瓦片左下角位置
export function getTileSWById(tileId: number) {
  const [wgsLng, wgsLat] = MapTool.tileid2wgs(tileId)
  const wgs = new TMap.LatLng(wgsLat, wgsLng)
  const { lat: gcjLat, lon: gcjLng } = CoordinateTransform.wgs84ToGcj02(wgsLat, wgsLng)
  const gcj = new TMap.LatLng(gcjLat, gcjLng)
  return { wgs, gcj }
}

/**
 * 获取坐标点最近的 tileId 及其左下角坐标
 */
export function getNearestTile(point: Point, mapLevel: number) {
  const tileId = getTileId(gcj2wgs(point), mapLevel)
  const lb = point2ll(wgs2gcj(getCornerByTileId(tileId)))
  return { tileId, point: lb }
}
