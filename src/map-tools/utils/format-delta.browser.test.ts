import { beforeAll, describe, expect, it } from 'vitest'
import { computeDragDelta, getLatLngDeltaByDragDelta } from './format-delta'

describe('format-delta', () => {
  describe('computeDragDelta', () => {
    // 扩展场景
    it('topLeft: 左上角拖拽，鼠标左移上移时扩展', () => {
      const delta = computeDragDelta('topLeft', -10, -20)
      expect(delta).toEqual({ left: -10, top: -20, right: 0, bottom: 0 })
    })

    it('topRight: 右上角拖拽，鼠标右移上移时扩展', () => {
      const delta = computeDragDelta('topRight', 10, -20)
      expect(delta).toEqual({ left: 0, top: -20, right: 10, bottom: 0 })
    })

    it('bottomLeft: 左下角拖拽，鼠标左移下移时扩展', () => {
      const delta = computeDragDelta('bottomLeft', -10, 20)
      expect(delta).toEqual({ left: -10, top: 0, right: 0, bottom: 20 })
    })

    it('bottomRight: 右下角拖拽，鼠标右移下移时扩展', () => {
      const delta = computeDragDelta('bottomRight', 10, 20)
      expect(delta).toEqual({ left: 0, top: 0, right: 10, bottom: 20 })
    })

    // 收缩场景
    it('topLeft: 左上角拖拽，鼠标右移下移时收缩', () => {
      const delta = computeDragDelta('topLeft', 10, 20)
      expect(delta).toEqual({ left: 10, top: 20, right: 0, bottom: 0 })
    })

    it('topRight: 右上角拖拽，鼠标左移下移时收缩', () => {
      const delta = computeDragDelta('topRight', -10, 20)
      expect(delta).toEqual({ left: 0, top: 20, right: -10, bottom: 0 })
    })

    it('bottomLeft: 左下角拖拽，鼠标右移上移时收缩', () => {
      const delta = computeDragDelta('bottomLeft', 10, -20)
      expect(delta).toEqual({ left: 10, top: 0, right: 0, bottom: -20 })
    })

    it('bottomRight: 右下角拖拽，鼠标左移上移时收缩', () => {
      const delta = computeDragDelta('bottomRight', -10, -20)
      expect(delta).toEqual({ left: 0, top: 0, right: -10, bottom: -20 })
    })
  })

  describe('getLatLngDeltaByDragDelta', () => {
    let map: TMap.Map
    // 经纬度距离的基准
    let baseLatLng: TMap.LatLng
    const baseLatLngDelta: { x: number, y: number } = { x: 0, y: 0 }
    beforeAll(() => {
      const dom = document.createElement('div')
      dom.style.width = '100px'
      dom.style.height = '100px'
      document.body.appendChild(dom)
      map = new TMap.Map(dom, {
        center: new TMap.LatLng(39.9069287, 116.3975649),
        zoom: 13,
      })
      const origin = map.unprojectFromContainer(new TMap.Point(0, 0))
      baseLatLng = map.unprojectFromContainer(new TMap.Point(1, 1))
      baseLatLngDelta.y = baseLatLng.lat - origin.lat
      baseLatLngDelta.x = baseLatLng.lng - origin.lng
    })

    it('像素50px转经纬度数值相近', () => {
      const point = map.unprojectFromContainer(new TMap.Point(50, 50))
      expect(point.lat - baseLatLng.lat).toBeCloseTo(baseLatLngDelta.y * 50, 3)
      expect(point.lng - baseLatLng.lng).toBeCloseTo(baseLatLngDelta.x * 50, 3)
    })

    it('经纬度转像素50px数值相近', () => {
      const origin = map.unprojectFromContainer(new TMap.Point(0, 0))
      const point = new TMap.LatLng(origin.lat + baseLatLngDelta.y * 50, origin.lng + baseLatLngDelta.x * 50)
      const res = map.projectToContainer(point)
      expect(res.x).toBeCloseTo(50, 2)
      expect(res.y).toBeCloseTo(50, 2)
    })

    it('零像素移动返回零经纬度变化', () => {
      const dragDelta = { left: 0, top: 0, right: 0, bottom: 0 }
      const result = getLatLngDeltaByDragDelta(map, dragDelta)
      expect(result).toEqual({ left: 0, top: 0, right: 0, bottom: 0 })
    })

    it('topLeft: 左上角拖拽，鼠标左移上移时扩展', () => {
      const dragDelta = { left: -10, top: -50, right: 0, bottom: 0 }
      const result = getLatLngDeltaByDragDelta(map, dragDelta)
      expect(result.left).toBeCloseTo(baseLatLngDelta.x * -10, 6)
      expect(result.top).toBeCloseTo(baseLatLngDelta.y * -20, 6)
      expect(result.right).toBe(0)
      expect(result.bottom).toBe(0)
    })
  })
})
