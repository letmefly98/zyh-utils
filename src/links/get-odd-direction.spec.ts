import type { LinkInfo } from './get-link-direction'
import { describe, expect, it } from 'vitest'
import { getOddDirection } from './get-odd-direction'

describe('get-link-direction', () => {
  it('空数组或小数组', () => {
    const result = getOddDirection([], 1, 2)
    expect(result).toEqual([])

    const result2 = getOddDirection([{ linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 }], 1, 2)
    expect(result2).toEqual([])
  })

  it('简单双向路', () => {
    const links: LinkInfo[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 3, slinkNodeId: 2, elinkNodeId: 3 },
      { linkId: 3, direction: 3, slinkNodeId: 3, elinkNodeId: 4 },
    ]

    const result = getOddDirection(links, 0, 2)
    expect(result).toEqual([1, 1, 1])
  })

  it('存在几何方向不同的双向路', () => {
    const links: LinkInfo[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 3, slinkNodeId: 3, elinkNodeId: 2 },
      { linkId: 3, direction: 3, slinkNodeId: 3, elinkNodeId: 4 },
      { linkId: 3, direction: 3, slinkNodeId: 5, elinkNodeId: 4 },
    ]

    const result = getOddDirection(links, 0, 3)
    expect(result).toEqual([1, 1, 1, 1])
  })

  it('起终点不在两端', () => {
    const links: LinkInfo[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 3, slinkNodeId: 2, elinkNodeId: 3 },
      { linkId: 3, direction: 3, slinkNodeId: 3, elinkNodeId: 4 },
      { linkId: 3, direction: 3, slinkNodeId: 4, elinkNodeId: 5 },
    ]

    const result = getOddDirection(links, 1, 2)
    expect(result).toEqual([0, 1, 1, 0])
  })

  it('起终点颠倒', () => {
    const links: LinkInfo[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 3, slinkNodeId: 3, elinkNodeId: 2 },
      { linkId: 3, direction: 3, slinkNodeId: 3, elinkNodeId: 4 },
      { linkId: 3, direction: 3, slinkNodeId: 5, elinkNodeId: 4 },
    ]

    const result = getOddDirection(links, 3, 0)
    expect(result).toEqual([2, 2, 2, 2])
  })
})
