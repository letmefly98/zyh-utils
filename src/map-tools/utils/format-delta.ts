import type { Corner, Delta } from '../types/delta'

/** 以不同的角进行拖拽，计算拖拽后移动的像素距离 */
export function computeDragDelta(corner: Corner, dx: number, dy: number): Delta {
  const isLeft = corner.includes('Left')
  const isTop = corner.includes('top')

  return {
    left: isLeft ? dx : 0,
    top: isTop ? dy : 0,
    right: isLeft ? 0 : dx,
    bottom: isTop ? 0 : dy,
  }
}

/** 根据拖拽后移动的像素距离，算出移动的经纬值 */
export function getLatLngDeltaByDragDelta(map: TMap.Map, dragDelta: Delta): Delta {
  const { lat: baseLat, lng: baseLng } = map.unprojectFromContainer(new TMap.Point(0, 0))
  const { lat: topDelta, lng: leftDelta } = map.unprojectFromContainer(new TMap.Point(dragDelta.left, dragDelta.top))
  const { lat: bottomDelta, lng: rightDelta } = map.unprojectFromContainer(new TMap.Point(dragDelta.right, dragDelta.bottom))

  return {
    left: leftDelta - baseLng,
    top: topDelta - baseLat,
    right: rightDelta - baseLng,
    bottom: bottomDelta - baseLat,
  }
}
