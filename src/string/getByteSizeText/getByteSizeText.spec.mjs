import { describe, expect, it } from 'vitest'
import { getByteSizeText } from './getByteSizeText.mjs'

describe('getByteSizeText', () => {
  it('normal case', () => {
    expect(getByteSizeText(1024)).toBe('1KB')
    expect(getByteSizeText(1024 * 1024)).toBe('1Mb')
    expect(getByteSizeText(1534 * 1024)).toBe('1.498Mb')
    expect(getByteSizeText(1100)).toBe('1.074KB')
  })

  it('boundary values', () => {
    // 边界值测试
    expect(getByteSizeText(0)).toBe('0B')
    expect(getByteSizeText(1)).toBe('1B')
    expect(getByteSizeText(1023)).toBe('1023B')
    expect(getByteSizeText(1024)).toBe('1KB')
    expect(getByteSizeText(1024 - 1)).toBe('1023B')
    expect(getByteSizeText(1024 + 1)).toBe('1.001KB')

    // KB 边界
    expect(getByteSizeText(1024 * 1023)).toBe('1023KB')
    expect(getByteSizeText(1024 * 1024)).toBe('1Mb')
    expect(getByteSizeText(1024 * 1024 - 1)).toBe('1023.999KB')
    expect(getByteSizeText(1024 * 1024 + 1)).toBe('1Mb')
  })

  it('precision and rounding', () => {
    expect(getByteSizeText(1536)).toBe('1.5KB') // 1.5 * 1024
    expect(getByteSizeText(2048)).toBe('2KB') // 2 * 1024
    expect(getByteSizeText(2560)).toBe('2.5KB') // 2.5 * 1024
    expect(getByteSizeText(3072)).toBe('3KB') // 3 * 1024
    expect(getByteSizeText(1.5 * 1024 * 1024)).toBe('1.5Mb')
    expect(getByteSizeText(2.25 * 1024 * 1024)).toBe('2.25Mb')
  })

  it('large numbers', () => {
    // 大数值测试
    const kb = 1024
    const mb = kb * 1024
    const gb = mb * 1024
    const tb = gb * 1024
    const pb = tb * 1024
    const eb = pb * 1024
    const zb = eb * 1024

    expect(getByteSizeText(5 * gb)).toBe('5G')
    expect(getByteSizeText(10 * tb)).toBe('10T')
    expect(getByteSizeText(100 * pb)).toBe('100P')
    expect(getByteSizeText(1000 * eb)).toBe('1000E')
    expect(getByteSizeText(2 * zb)).toBe('2Z')
  })

  it('decimal values', () => {
    expect(getByteSizeText(512.5)).toBe('512.5B')
    expect(getByteSizeText(1024.5)).toBe('1KB')
    expect(getByteSizeText(1536.7)).toBe('1.501KB')
    expect(getByteSizeText(2048.123)).toBe('2KB')
  })

  it('custom units', () => {
    // 自定义单位测试
    const customUnits = ['Bytes', 'KB', 'MB', 'GB']
    expect(getByteSizeText(1024, customUnits)).toBe('1KB')
    expect(getByteSizeText(1024 * 1024, customUnits)).toBe('1MB')
    expect(getByteSizeText(1024 * 1024 * 1024, customUnits)).toBe('1GB')
    expect(getByteSizeText(500, customUnits)).toBe('500Bytes')

    // 单个单位
    expect(getByteSizeText(1024, ['B'])).toBe('1024B')
    expect(getByteSizeText(2048, ['B'])).toBe('2048B')

    // 空单位数组
    expect(getByteSizeText(1024, [])).toBe('')
  })

  it('unexpected argument', () => {
    expect(getByteSizeText(-1)).toBe('')
    expect(getByteSizeText(undefined)).toBe('')
    expect(getByteSizeText(null)).toBe('')
    expect(getByteSizeText('1')).toBe('')
    expect(getByteSizeText(Number.NaN)).toBe('')
    expect(getByteSizeText(Infinity)).toBe('')
    expect(getByteSizeText(-Infinity)).toBe('')
    expect(getByteSizeText({})).toBe('')
    expect(getByteSizeText([])).toBe('')
    expect(getByteSizeText(true)).toBe('')
    expect(getByteSizeText(false)).toBe('')
  })

  it('negative numbers', () => {
    // 负数测试
    expect(getByteSizeText(-1)).toBe('')
    expect(getByteSizeText(-1024)).toBe('')
    expect(getByteSizeText(-0.1)).toBe('')
  })

  it('special number values', () => {
    // 特殊数值
    expect(getByteSizeText(Number.MAX_SAFE_INTEGER)).toBe('8P')
    expect(getByteSizeText(Number.MIN_VALUE)).toBe('0B')
    expect(getByteSizeText(Number.POSITIVE_INFINITY)).toBe('')
    expect(getByteSizeText(Number.NEGATIVE_INFINITY)).toBe('')
  })
})
