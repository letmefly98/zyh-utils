import { describe, expect, it } from 'vitest'
import { addMoneyComma } from './addMoneyComma.mjs'

describe('addMoneyComma', () => {
  it('应该给整数添加千位分隔符', () => {
    expect(addMoneyComma(1234)).toBe('1,234')
    expect(addMoneyComma(12345)).toBe('12,345')
    expect(addMoneyComma(123456)).toBe('123,456')
    expect(addMoneyComma(1234567)).toBe('1,234,567')
    expect(addMoneyComma(12345678)).toBe('12,345,678')
    expect(addMoneyComma(123456789)).toBe('123,456,789')
  })

  it('应该给小数添加千位分隔符', () => {
    expect(addMoneyComma(1234.56)).toBe('1,234.56')
    expect(addMoneyComma(12345.789)).toBe('12,345.789')
    expect(addMoneyComma(123456.12)).toBe('123,456.12')
    expect(addMoneyComma(1234567.0)).toBe('1,234,567')
  })

  it('应该处理负数', () => {
    expect(addMoneyComma(-1234)).toBe('-1,234')
    expect(addMoneyComma(-12345.67)).toBe('-12,345.67')
    expect(addMoneyComma(-123456789)).toBe('-123,456,789')
  })

  it('应该处理字符串输入', () => {
    expect(addMoneyComma('1234')).toBe('1,234')
    expect(addMoneyComma('12345.67')).toBe('12,345.67')
    expect(addMoneyComma('-1234567')).toBe('-1,234,567')
  })

  it('应该处理小于1000的数字', () => {
    expect(addMoneyComma(0)).toBe('0')
    expect(addMoneyComma(1)).toBe('1')
    expect(addMoneyComma(12)).toBe('12')
    expect(addMoneyComma(123)).toBe('123')
    expect(addMoneyComma(999)).toBe('999')
  })

  it('应该处理边界情况', () => {
    expect(addMoneyComma(null)).toBe('')
    expect(addMoneyComma(undefined)).toBe('')
    expect(addMoneyComma('')).toBe('')
  })

  it('应该处理无效输入', () => {
    expect(addMoneyComma('abc')).toBe('abc')
    expect(addMoneyComma('12abc')).toBe('12abc')
    expect(addMoneyComma('abc123')).toBe('abc123')
  })

  it('应该处理零和小数点', () => {
    expect(addMoneyComma(0.0)).toBe('0')
    expect(addMoneyComma(0.123)).toBe('0.123')
    expect(addMoneyComma(1000.0)).toBe('1,000')
    expect(addMoneyComma(1000.123)).toBe('1,000.123')
  })

  it('应该处理大数字', () => {
    expect(addMoneyComma(1000000000)).toBe('1,000,000,000')
    expect(addMoneyComma(1234567890123)).toBe('1,234,567,890,123')
    expect(addMoneyComma(-9876543210.987)).toBe('-9,876,543,210.987')
  })

  it('应该处理特殊的小数情况', () => {
    expect(addMoneyComma('1234.')).toBe('1,234.')
    expect(addMoneyComma('1234.000')).toBe('1,234.000')
    expect(addMoneyComma('.123')).toBe('.123')
  })
})
