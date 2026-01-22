// 获取地图级数
export function getMapLevel(mapIns: TMap.Map): number {
  const zoom = Math.round(mapIns.getZoom() || 13)
  return zoom
}

// 极值地图 Tile 级数，超过时将无法计算 TileId
const minTileLevel = 7
const maxTileLevel = 15

// 获取地图 Tile 级数
export function getTileLevel(mapIns: TMap.Map): number {
  const zoom = getMapLevel(mapIns)
  const tileLevel = Math.max(minTileLevel, Math.min(maxTileLevel, zoom))
  return tileLevel
}
