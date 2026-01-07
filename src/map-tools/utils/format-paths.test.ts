import type { Point } from '../types/draw'

import { describe, expect, it } from 'vitest'
import { getMiddlePosition } from './format-paths'

describe('getMiddlePosition', () => {
  // 正常路径测试
  describe('正常路径', () => {
    it('单个点 - 直接返回该点', () => {
      const points: Point[] = [{ lng: 116.397428, lat: 39.90923 }]
      const result = getMiddlePosition(points)

      expect(result).toEqual({ lng: 116.397428, lat: 39.90923 })
    })

    it('奇数个点(3个) - 返回中间点', () => {
      const points: Point[] = [
        { lng: 116.0, lat: 39.0 },
        { lng: 117.0, lat: 40.0 }, // 中间点
        { lng: 118.0, lat: 41.0 },
      ]
      const result = getMiddlePosition(points)

      expect(result).toEqual({ lng: 117.0, lat: 40.0 })
    })

    it('奇数个点(5个) - 返回中间点', () => {
      const points: Point[] = [
        { lng: 116.0, lat: 39.0 },
        { lng: 117.0, lat: 40.0 },
        { lng: 118.0, lat: 41.0 }, // 中间点 (index 2)
        { lng: 119.0, lat: 42.0 },
        { lng: 120.0, lat: 43.0 },
      ]
      const result = getMiddlePosition(points)

      expect(result).toEqual({ lng: 118.0, lat: 41.0 })
    })

    it('偶数个点(2个) - 返回两点的中间位置', () => {
      const points: Point[] = [
        { lng: 116.0, lat: 39.0 },
        { lng: 118.0, lat: 41.0 },
      ]
      const result = getMiddlePosition(points)

      expect(result).toEqual({ lng: 117.0, lat: 40.0 })
    })

    it('偶数个点(4个) - 返回中间两点的中间位置', () => {
      const points: Point[] = [
        { lng: 116.0, lat: 39.0 },
        { lng: 117.0, lat: 40.0 }, // m1 (index 1)
        { lng: 119.0, lat: 42.0 }, // m2 (index 2)
        { lng: 120.0, lat: 43.0 },
      ]
      const result = getMiddlePosition(points)

      // 中间位置: (117+119)/2=118, (40+42)/2=41
      expect(result).toEqual({ lng: 118.0, lat: 41.0 })
    })
  })

  // 边界条件测试
  describe('边界条件', () => {
    it('空数组 - 返回 undefined', () => {
      const points: Point[] = []
      const result = getMiddlePosition(points)

      expect(result).toBeUndefined()
    })

    it('坐标值为 0', () => {
      const points: Point[] = [
        { lng: 0, lat: 0 },
        { lng: 0, lat: 0 },
      ]
      const result = getMiddlePosition(points)

      expect(result).toEqual({ lng: 0, lat: 0 })
    })

    it('负数坐标', () => {
      const points: Point[] = [
        { lng: -180, lat: -90 },
        { lng: 180, lat: 90 },
      ]
      const result = getMiddlePosition(points)

      expect(result).toEqual({ lng: 0, lat: 0 })
    })

    it('小数精度坐标', () => {
      const points: Point[] = [
        { lng: 116.123456, lat: 39.987654 },
        { lng: 116.654321, lat: 39.123456 },
      ]
      const result = getMiddlePosition(points)

      expect(result.lng).toBeCloseTo(116.3888885, 5)
      expect(result.lat).toBeCloseTo(39.555555, 5)
    })
  })
})
