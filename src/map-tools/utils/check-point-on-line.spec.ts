import type { Point } from '../types/base'
import { describe, expect, it } from 'vitest'
import { checkPointOnLine } from './check-point-on-line'

describe('checkPointOnLine', () => {
  it('应该正确判断垂足在线段上的情况', () => {
    const point: Point = { lng: 116.404, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.915 },
      { lng: 116.410, lat: 39.915 },
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBe('line')

    // 使用类型断言确保后续断言一定会执行
    if (result.on !== 'line') {
      throw new Error(`Expected result.on to be 'line', but got '${result.on}'`)
    }

    expect(result.percent).toBeCloseTo(0.4, 5)
    expect(result.cross.lat).toBeCloseTo(39.915, 5)
    expect(result.cross.lng).toBeCloseTo(116.404, 5)
  })

  it('应该正确判断垂足在前延长线上的情况', () => {
    const point: Point = { lng: 116.395, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.915 },
      { lng: 116.410, lat: 39.915 },
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBe('prev')

    // 使用类型断言确保后续断言一定会执行
    if (result.on !== 'prev') {
      throw new Error(`Expected result.on to be 'prev', but got '${result.on}'`)
    }

    expect(result.prev.lat).toBe(39.915)
    expect(result.prev.lng).toBe(116.400)
  })

  it('应该正确判断垂足在后延长线上的情况', () => {
    const point: Point = { lng: 116.415, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.915 },
      { lng: 116.410, lat: 39.915 },
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBe('next')

    // 使用类型断言确保后续断言一定会执行
    if (result.on !== 'next') {
      throw new Error(`Expected result.on to be 'next', but got '${result.on}'`)
    }

    expect(result.next.lat).toBe(39.915)
    expect(result.next.lng).toBe(116.410)
  })

  it('应该正确处理线段长度为0的情况', () => {
    const point: Point = { lng: 116.404, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.915 },
      { lng: 116.400, lat: 39.915 }, // 相同点
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBeUndefined()
  })

  it('应该正确处理垂直线段', () => {
    const point: Point = { lng: 116.405, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.910 },
      { lng: 116.400, lat: 39.920 },
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBe('line')

    // 使用类型断言确保后续断言一定会执行
    if (result.on !== 'line') {
      throw new Error(`Expected result.on to be 'line', but got '${result.on}'`)
    }

    expect(result.percent).toBeCloseTo(0.5, 5)
    expect(result.cross.lat).toBeCloseTo(39.915, 5)
    expect(result.cross.lng).toBeCloseTo(116.400, 5)
  })

  it('应该正确处理斜线段', () => {
    const point: Point = { lng: 116.405, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.910 },
      { lng: 116.410, lat: 39.920 },
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBe('line')

    // 使用类型断言确保后续断言一定会执行
    if (result.on !== 'line') {
      throw new Error(`Expected result.on to be 'line', but got '${result.on}'`)
    }

    expect(result.percent).toBeCloseTo(0.5, 5)
    expect(result.cross.lat).toBeCloseTo(39.915, 5)
    expect(result.cross.lng).toBeCloseTo(116.405, 5)
  })

  it('应该正确处理点在线段起点的情况', () => {
    const point: Point = { lng: 116.400, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.915 },
      { lng: 116.410, lat: 39.915 },
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBe('line')

    // 使用类型断言确保后续断言一定会执行
    if (result.on !== 'line') {
      throw new Error(`Expected result.on to be 'line', but got '${result.on}'`)
    }

    expect(result.percent).toBeCloseTo(0, 5)
    expect(result.cross.lat).toBeCloseTo(39.915, 5)
    expect(result.cross.lng).toBeCloseTo(116.400, 5)
  })

  it('应该正确处理点在线段终点的情况', () => {
    const point: Point = { lng: 116.410, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.915 },
      { lng: 116.410, lat: 39.915 },
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBe('line')

    // 使用类型断言确保后续断言一定会执行
    if (result.on !== 'line') {
      throw new Error(`Expected result.on to be 'line', but got '${result.on}'`)
    }

    expect(result.percent).toBeCloseTo(1, 5)
    expect(result.cross.lat).toBeCloseTo(39.915, 5)
    expect(result.cross.lng).toBeCloseTo(116.410, 5)
  })

  it('应该正确处理极小线段', () => {
    const point: Point = { lng: 116.4000001, lat: 39.915 }
    const line: [Point, Point] = [
      { lng: 116.400, lat: 39.915 },
      { lng: 116.4000002, lat: 39.915 },
    ]

    const result = checkPointOnLine(point, line)

    expect(result.on).toBe('line')

    // 使用类型断言确保后续断言一定会执行
    if (result.on !== 'line') {
      throw new Error(`Expected result.on to be 'line', but got '${result.on}'`)
    }

    expect(result.percent).toBeCloseTo(0.5, 1)
  })
})
