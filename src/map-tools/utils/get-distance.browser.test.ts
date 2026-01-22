import type { Point } from '../types/base'
import { describe, expect, it } from 'vitest'
import { getDistanceDot2Dot } from './get-distance'

// 测试坐标点
const POINTS = {
  // 北京天安门
  tiananmen: { lng: 116.397428, lat: 39.90923 } as Point,
  // 北京故宫（神武门）
  gugong: { lng: 116.403406, lat: 39.924091 } as Point,
  // 上海东方明珠
  dongfangmingzhu: { lng: 121.499718, lat: 31.239703 } as Point,
}

// 预期距离（米），基于 TMap API 实际计算的精确值
const EXPECTED_DISTANCES = {
  tiananmen_to_gugong: 1729.33, // TMap 计算值
  tiananmen_to_shanghai: 1068260, // TMap 计算值（约 1068.26km）
}

// 误差阈值 0.01%
const ERROR_THRESHOLD = 0.0001

describe('getDistanceDot2Dot', () => {
  it('应返回数字类型的距离（单位：米）', () => {
    const distance = getDistanceDot2Dot(POINTS.tiananmen, POINTS.gugong)
    expect(typeof distance).toBe('number')
    expect(distance).toBeGreaterThan(0)
  })

  it('两个相同点的距离应为 0', () => {
    const distance = getDistanceDot2Dot(POINTS.tiananmen, POINTS.tiananmen)
    expect(distance).toBe(0)
  })

  it('天安门到故宫距离约 1.73km（误差 ≤0.01%）', () => {
    const distance = getDistanceDot2Dot(POINTS.tiananmen, POINTS.gugong)
    const expected = EXPECTED_DISTANCES.tiananmen_to_gugong
    const errorRate = Math.abs(distance - expected) / expected

    expect(errorRate).toBeLessThanOrEqual(ERROR_THRESHOLD)
  })

  it('北京到上海距离约 1068km（误差 ≤0.01%）', () => {
    const distance = getDistanceDot2Dot(POINTS.tiananmen, POINTS.dongfangmingzhu)
    const expected = EXPECTED_DISTANCES.tiananmen_to_shanghai
    const errorRate = Math.abs(distance - expected) / expected

    expect(errorRate).toBeLessThanOrEqual(ERROR_THRESHOLD)
  })

  it('距离计算应满足对称性（A到B = B到A）', () => {
    const distanceAB = getDistanceDot2Dot(POINTS.tiananmen, POINTS.gugong)
    const distanceBA = getDistanceDot2Dot(POINTS.gugong, POINTS.tiananmen)

    expect(distanceAB).toBe(distanceBA)
  })
})
