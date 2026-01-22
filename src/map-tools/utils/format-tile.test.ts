import { describe, expect, it } from 'vitest'
import { getTileId, getTileSize } from './format-tile'

describe('format-tile', () => {
  describe('getTileSize', () => {
    it('should return correct tile size', () => {
      expect(getTileSize(0)).toBe(180)
      expect(getTileSize(1)).toBe(90)
      expect(getTileSize(2)).toBe(45)
      expect(getTileSize(3)).toBe(22.5)
      expect(getTileSize(4)).toBe(11.25)
      expect(getTileSize(5)).toBe(5.625)
      expect(getTileSize(6)).toBe(2.8125)
      expect(getTileSize(7)).toBe(1.40625)
      expect(getTileSize(8)).toBe(0.703125)
      expect(getTileSize(9)).toBe(0.3515625)
      expect(getTileSize(10)).toBe(0.17578125)
      expect(getTileSize(11)).toBe(0.087890625)
      expect(getTileSize(12)).toBe(0.0439453125)
      expect(getTileSize(13)).toBe(0.02197265625)
      expect(getTileSize(14)).toBe(0.010986328125)
      expect(getTileSize(15)).toBe(0.0054931640625)
    })
  })

  describe('getTileId', () => {
    it('should return correct tile id for Beijing coordinates', () => {
      // 北京天安门国旗坐标（腾讯地图）
      const beijing = { lat: 39.9069287, lng: 116.3975649 }
      expect(getTileId(beijing, 0)).toBe(65536)
      expect(getTileId(beijing, 1)).toBe(131073)
      expect(getTileId(beijing, 2)).toBe(262148)
      expect(getTileId(beijing, 3)).toBe(524307)
      expect(getTileId(beijing, 4)).toBe(1048654)
      expect(getTileId(beijing, 5)).toBe(2097466)
      expect(getTileId(beijing, 6)).toBe(4195561)
      expect(getTileId(beijing, 7)).toBe(8393636)
      expect(getTileId(beijing, 8)).toBe(16797329)
      expect(getTileId(beijing, 9)).toBe(33634887)
      expect(getTileId(beijing, 10)).toBe(67430686)
      expect(getTileId(beijing, 11)).toBe(135505016)
      expect(getTileId(beijing, 12)).toBe(273584608)
      expect(getTileId(beijing, 13)).toBe(557467521)
      expect(getTileId(beijing, 14)).toBe(1156128260)
      expect(getTileId(beijing, 15)).toBe(2477029392)
    })

    it('should work with useMagic parameter', () => {
      const point = { lat: 39.9042, lng: 116.4074 }

      const tileIdNormal = getTileId(point, 10, false)
      const tileIdMagic = getTileId(point, 10, true)

      expect(typeof tileIdNormal).toBe('number')
      expect(typeof tileIdMagic).toBe('number')
    })
  })
})
