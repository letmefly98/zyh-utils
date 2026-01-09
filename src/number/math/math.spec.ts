import { describe, expect, it } from 'vitest'
import { average, divide, minus, sum, times, toFixed } from './math'

describe('math 高精度数学运算', () => {
  describe('toFixed', () => {
    it('应该返回指定精度的数字', () => {
      expect(toFixed(3.14159, 2)).toBe(3.14)
      expect(toFixed(3.14159, 4)).toBe(3.1416)
      expect(toFixed(321201.595)).toBe(321201.60) // 高精度计算
    })

    it('应该支持返回字符串格式', () => {
      expect(toFixed(3.14159, 2, false)).toBe('3.14')
      expect(toFixed(3.14159, 4, false)).toBe('3.1416')
    })

    it('应该处理默认精度', () => {
      expect(toFixed(3.14159)).toBe(3.14)
    })
  })

  describe('sum', () => {
    it('应该正确计算多个数字的和', () => {
      expect(sum(1, 2, 3)).toBe(6)
      expect(sum(0.1, 0.2)).toBe(0.3) // 高精度计算
    })

    it('应该处理空数组', () => {
      expect(sum()).toBe(0)
    })
  })

  describe('minus', () => {
    it('应该正确计算连续减法', () => {
      expect(minus(10, 3, 2)).toBe(-15) // 0 - 10 - 3 - 2 = -15
      expect(minus(5)).toBe(-5) // 0 - 5 = -5
    })
  })

  describe('times', () => {
    it('应该正确计算多个数字的乘积', () => {
      expect(times(2, 3, 4)).toBe(24)
      expect(times(0.1, 3)).toBe(0.3) // 高精度计算
    })

    it('应该处理空数组', () => {
      expect(times()).toBe(1)
    })
  })

  describe('divide', () => {
    it('应该正确计算连续除法', () => {
      expect(divide(12, 3, 2)).toBe(2) // 12 / 3 / 2 = 2
      expect(divide(10)).toBe(10) // 单个数字返回自身
    })

    it('应该处理空数组', () => {
      expect(divide()).toBe(0)
    })
  })

  describe('average', () => {
    it('应该正确计算平均数', () => {
      expect(average(1, 2, 3, 4, 5)).toBe(3)
      expect(average(0.1, 0.2, 0.3)).toBe(0.2) // 高精度平均数
    })

    it('应该处理空数组', () => {
      expect(average()).toBe(0)
    })
  })
})
