import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { random } from './random.mjs'

describe('random', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.45)
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('normal case', () => {
    expect(random(1)).toBe(0.45)
    expect(random(5)).toBe(2.25)
    expect(random(5, 10)).toBe(7.25)
    expect(random(-5)).toBe(-2.75)
    expect(random(-5, -10)).toBe(-7.75)
    expect(random(-10, -5)).toBe(-7.75)
  })

  it('unexpected argument', () => {
    expect(random(undefined)).toBe(Number.NaN)
    expect(random(null)).toBe(Number.NaN)
    expect(random(Number.NaN)).toBe(Number.NaN)
    expect(random(1, null)).toBe(Number.NaN)
    expect(random(1, Number.NaN)).toBe(Number.NaN)
    expect(random('1')).toBe(0.45)
    expect(random('5', '10')).toBe(7.25)
  })
})
