import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { date2string } from './date2string.mjs'

describe('date2string', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('normal case', () => {
    vi.setSystemTime(new Date('2025-02-19 15:48:21'))
    expect(date2string()).toBe('2025-02-19 15:48:21')
    expect(date2string(1739951301000)).toBe('2025-02-19 15:48:21')
    expect(date2string(new Date('2025-02-19 15:48:21'))).toBe('2025-02-19 15:48:21')
    expect(date2string('2025-02-19')).toBe('2025-02-19 00:00:00')
  })

  it('use format argument', () => {
    const date = new Date(2022, 4, 20, 23, 59, 59) // 2022-5-20 23:59:59
    expect(date2string(date)).toBe('2022-05-20 23:59:59')
    expect(date2string(date, 'YYYY-M-D')).toBe('2022-5-20')
    expect(date2string(date, 'YYYY年M月D日')).toBe('2022年5月20日')
    expect(date2string(date, 'YYYYMMDD')).toBe('20220520')
    expect(date2string(date, 'MM-DD YYYY年')).toBe('05-20 2022年')
    expect(date2string(date, 'HH:mm:ss')).toBe('23:59:59')
    expect(date2string(date, 'HH:mm:ss YYYY-MM-DD')).toBe('23:59:59 2022-05-20')
  })

  it('unexpected argument', async () => {
    expect(date2string('1739951301000')).toBe('1746-11-13 01:05:43')
    const date = new Date(2022, 4, 20, 23, 59, 59) // 2022-5-20 23:59:59
    expect(date2string(date, 'yyyy-M-dd')).toBe('yyyy-5-Fr')
  })
})
