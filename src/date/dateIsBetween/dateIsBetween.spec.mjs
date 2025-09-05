import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dateIsBetween } from './dateIsBetween.mjs'

describe('dateIsBetween', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('normal case', () => {
    vi.setSystemTime(new Date('2025-02-19 15:48:21'))
    const mockDate = new Date()
    const startDate = new Date('2025-02-19 15:48:00')
    const endDate = new Date('2025-02-19 15:48:59')
    expect(dateIsBetween(mockDate, startDate, endDate)).toBe(true)
  })
})
