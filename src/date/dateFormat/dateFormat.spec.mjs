import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dateFormat } from './dateFormat.mjs'

describe('dateFormat', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('normal case', () => {
    vi.setSystemTime(new Date('2025-02-19 15:48:21'))
    expect(dateFormat()).toBe('2025-02-19 15:48:21')
    expect(dateFormat(1739951301000)).toBe('2025-02-19 15:48:21')
    expect(dateFormat(new Date('2025-02-19 15:48:21'))).toBe('2025-02-19 15:48:21')
    expect(dateFormat('2025-02-19')).toBe('2025-02-19 00:00:00')
  })

  it('unexpected argument', async () => {
    expect(dateFormat('1739951301000')).toBe('1746-11-13 01:05:43')
  })
})
