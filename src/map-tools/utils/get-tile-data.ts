import type { Point, PointRect } from '../types/base'
import { offsetPosition } from './format-point'
import { getTileCorner, getTileId, getTileRect, getTileSize } from './format-tile'

/**
 * 获取视窗范围内的 Tile 数据
 * @param tileLevel tile 级别
 * @param bounds 视窗范围
 * @returns 包含的tileId和tile框四角坐标点
 */
export function getTileData(tileLevel: number, bounds: PointRect) {
  const result: { tileId: number, paths: Point[] }[] = []
  const oneTileSize = getTileSize(tileLevel)

  // 获取视窗左下角和右上角最近的tile左下角坐标
  const s_lb = getTileCorner(getTileId(bounds.lb, tileLevel))
  const s_rt = getTileCorner(getTileId(bounds.rt, tileLevel))

  // 计算需要覆盖的行列数(向上取整确保完全覆盖视窗)
  const row = Math.round((s_rt.lat + oneTileSize - s_lb.lat) / oneTileSize)
  const col = Math.round((s_rt.lng + oneTileSize - s_lb.lng) / oneTileSize)

  // 遍历所有tile,从左下角开始,向右向上遍历
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      const offset = { lat: r * oneTileSize, lng: c * oneTileSize }
      const p = offsetPosition(s_lb, offset)
      const tileId = getTileId(p, tileLevel, true)
      const paths = getTileRect(p, oneTileSize)
      result.push({ tileId, paths })
    }
  }

  return result
}
