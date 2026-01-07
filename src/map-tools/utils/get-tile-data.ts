import { offsetPosition } from './common'
import { point2ll, wgs2gcj } from './format-point'
import { getCornerLatLng } from './format-rect'
import { getCornerByTileId, getLevelDistance, getNearestTile, getTileId } from './format-tile'

export function getTileData(tileLevel: number, bounds: TMap.LatLngBounds) {
  const result: { tileId: number, paths: TMap.LatLng[] }[] = []
  const levelDist = getLevelDistance(tileLevel)

  // 获取视窗左下角和右上角最近的tile左下角坐标
  const { point: lb1 } = getNearestTile(bounds.getSouthWest(), tileLevel)
  const { point: rt1 } = getNearestTile(bounds.getNorthEast(), tileLevel)
  const lb = offsetPosition(lb1, new TMap.LatLng(0, -levelDist))
  const rt = offsetPosition(rt1, new TMap.LatLng(2 * levelDist, levelDist))

  // 计算需要覆盖的行列数(向上取整确保完全覆盖视窗)
  const row = Math.round((rt.lat - lb.lat) / levelDist)
  const col = Math.round((rt.lng - lb.lng) / levelDist)

  // 遍历所有tile,从左下角开始,向右向上遍历
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      const lat = lb.lat + r * levelDist
      const lng = lb.lng + c * levelDist
      const tmp = new TMap.LatLng(lat, lng)
      const tileId = getTileId(tmp, tileLevel)
      const sw = point2ll(wgs2gcj(getCornerByTileId(tileId)))
      result.push({
        tileId,
        paths: [
          getCornerLatLng(sw, levelDist, 'lt'),
          getCornerLatLng(sw, levelDist, 'lb'),
          getCornerLatLng(sw, levelDist, 'rb'),
          getCornerLatLng(sw, levelDist, 'rt'),
        ].map(point2ll),
      })
    }
  }

  return result
}
