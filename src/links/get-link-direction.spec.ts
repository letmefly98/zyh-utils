import type { LinkInfoItem } from './types'
import { describe, expect, it } from 'vitest'
import { getLinksDirection } from './get-link-direction'

describe('get-link-direction', () => {
  it('空数组或小数组，实际场景不存在', () => {
    const result = getLinksDirection([], 1, 2)
    expect(result).toEqual([])

    const result2 = getLinksDirection([{ linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 }], 1, 2)
    expect(result2).toEqual([])
  })

  it('简单双向路', () => {
    const links: LinkInfoItem[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 3, slinkNodeId: 2, elinkNodeId: 3 },
      { linkId: 3, direction: 3, slinkNodeId: 3, elinkNodeId: 4 },
    ]

    const result = getLinksDirection(links, 0, 2)
    expect(result).toEqual([1, 1, 1])
  })

  it('存在几何方向不同的双向路', () => {
    const links: LinkInfoItem[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 3, slinkNodeId: 3, elinkNodeId: 2 },
      { linkId: 3, direction: 3, slinkNodeId: 3, elinkNodeId: 4 },
      { linkId: 3, direction: 3, slinkNodeId: 5, elinkNodeId: 4 },
    ]

    const result = getLinksDirection(links, 0, 3)
    expect(result).toEqual([1, 2, 1, 2])
  })

  it('起终点不在两端', () => {
    const links: LinkInfoItem[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 3, slinkNodeId: 2, elinkNodeId: 3 },
      { linkId: 3, direction: 3, slinkNodeId: 3, elinkNodeId: 4 },
      { linkId: 3, direction: 3, slinkNodeId: 4, elinkNodeId: 5 },
    ]

    const result = getLinksDirection(links, 1, 2)
    expect(result).toEqual([0, 1, 1, 0])
  })

  it('起终点颠倒不影响道路几何方向', () => {
    const links: LinkInfoItem[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 3, slinkNodeId: 3, elinkNodeId: 2 },
      { linkId: 3, direction: 3, slinkNodeId: 3, elinkNodeId: 4 },
      { linkId: 3, direction: 3, slinkNodeId: 5, elinkNodeId: 4 },
    ]

    const result = getLinksDirection(links, 3, 0)
    expect(result).toEqual([1, 2, 1, 2])
  })

  it('单向路', () => {
    const links: LinkInfoItem[] = [
      { linkId: 1, direction: 3, slinkNodeId: 1, elinkNodeId: 2 },
      { linkId: 2, direction: 1, slinkNodeId: 3, elinkNodeId: 2 },
      { linkId: 3, direction: 1, slinkNodeId: 4, elinkNodeId: 3 },
      { linkId: 3, direction: 3, slinkNodeId: 5, elinkNodeId: 4 },
    ]

    const result = getLinksDirection(links, 3, 0)
    expect(result).toEqual([1, 2, 2, 2])
  })
})
