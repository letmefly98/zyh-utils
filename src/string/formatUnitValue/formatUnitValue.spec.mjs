import { describe, expect, it } from 'vitest'
import { formatUnitValue } from './formatUnitValue.mjs'

describe('formatUnitValue', () => {
  // 测试字节单位转换（保持向后兼容）
  it('should format byte sizes correctly', () => {
    expect(formatUnitValue(1024)).toBe('1KB')
    expect(formatUnitValue(1024 * 1024)).toBe('1MB')
    expect(formatUnitValue(1024 * 1024 * 1024)).toBe('1GB')
    expect(formatUnitValue(1024 * 1024 * 1024 * 1024)).toBe('1TB')
  })

  // 测试时间单位转换
  it('should format time units correctly', () => {
    const timeUnits = ['秒', '分', '小时', '天'] // 从小到大排列
    expect(formatUnitValue(86400, timeUnits, 60, 0)).toBe('24小时') // 86400秒 = 24小时
    expect(formatUnitValue(3600, timeUnits, 60, 0)).toBe('1小时')
    expect(formatUnitValue(60, timeUnits, 60, 0)).toBe('1分')
    expect(formatUnitValue(90000, timeUnits, 60, 1)).toBe('25小时') // 90000秒 = 25小时
  })

  // 测试数字单位转换（万/亿）
  it('should format number units correctly', () => {
    const numberUnits = ['', '万', '亿']
    expect(formatUnitValue(10000, numberUnits, 10000, 2)).toBe('1万')
    expect(formatUnitValue(100000000, numberUnits, 10000, 2)).toBe('1亿')
    expect(formatUnitValue(12345678, numberUnits, 10000, 2)).toBe('1234.57万')
  })

  // 测试自定义精度
  it('should respect precision parameter', () => {
    expect(formatUnitValue(1536, ['B', 'KB'], 1024, 0)).toBe('2KB')
    expect(formatUnitValue(1536, ['B', 'KB'], 1024, 1)).toBe('1.5KB')
    expect(formatUnitValue(1546, ['B', 'KB'], 1024, 3)).toBe('1.51KB')
  })

  // 测试边界条件
  it('should handle edge cases', () => {
    expect(formatUnitValue(0)).toBe('0B')
    expect(formatUnitValue(-100)).toBe('')
    expect(formatUnitValue(Number.NaN)).toBe('')
    expect(formatUnitValue('invalid')).toBe('')
  })

  // 测试单个单位的情况
  it('should handle single unit arrays', () => {
    expect(formatUnitValue(1024, ['B'], 1024, 2)).toBe('1024B')
    expect(formatUnitValue(2048, ['bytes'], 1024, 0)).toBe('2048bytes')
  })

  // 测试旧式调用方式（只传value和units数组）
  it('should support old calling style with only value and units array', () => {
    const result = formatUnitValue(1024 * 1024, ['B', 'KB', 'MB', 'GB'])
    expect(result).toBe('1MB')
  })
})
