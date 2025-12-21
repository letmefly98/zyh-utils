import type { DirectionResult, LinkInfoItem } from './types'

type CaseItem = [string, LinkInfoItem[], DirectionResult[]]

// 3条单向路，几何方向从下往上
export const OneDir3Links: CaseItem = [
  '3条单向路，几何方向从下往上',
  [
    {
      linkId: 9500024541312,
      direction: 1,
      startPoint: '113.894083,22.486811',
      endPoint: '113.893210,22.488181',
      slinkNodeId: 11002476654357,
      elinkNodeId: 11002476728701,
    },
    {
      linkId: 9500024541551,
      direction: 1,
      startPoint: '113.893210,22.488181',
      endPoint: '113.893121,22.488642',
      slinkNodeId: 11002476728701,
      elinkNodeId: 11002458428933,
    },
    {
      linkId: 11005259644642,
      direction: 1,
      startPoint: '113.893121,22.488642',
      endPoint: '113.892805,22.490546',
      slinkNodeId: 11002458428933,
      elinkNodeId: 11005259644765,
    },
  ],
  [1, 1, 1],
]

// 1条双向路，几何方向从右上往左下
export const TwoDir1Links: CaseItem = [
  '1条双向路，几何方向从右上往左下',
  [
    {
      linkId: 9100041221216,
      direction: 3,
      startPoint: '113.902938,22.468890',
      endPoint: '113.902454,22.468590',
      slinkNodeId: 11002511587291,
      elinkNodeId: 11002511587292,
    },
  ],
  [1],
]

// 2条双向路，几何方向从上往下
export const TwoDir2Links: CaseItem = [
  '2条双向路，几何方向从上往下',
  [
    {
      linkId: 11042890478815,
      direction: 3,
      startPoint: '113.892009,22.491547',
      endPoint: '113.892115,22.491083',
      slinkNodeId: 11042890478816,
      elinkNodeId: 11002438853042,
    },
    {
      linkId: 9500380444989,
      direction: 3,
      startPoint: '113.892115,22.491083',
      endPoint: '113.892183,22.490700',
      slinkNodeId: 11002438853042,
      elinkNodeId: 11002439151464,
    },
  ],
  [1, 1, 1],
]

// 双向路+单向路，几何方向从上往下
export const FirstTwoThenOne2Links: CaseItem = [
  '2条双向路，几何方向从上往下',
  [
    {
      linkId: 9100053246964,
      direction: 3,
      startPoint: '118.367026,31.314565',
      endPoint: '118.367141,31.314564',
      slinkNodeId: 11002457473107,
      elinkNodeId: 11002449680356,
    },
    {
      linkId: 9100053427640,
      direction: 1,
      startPoint: '118.367026,31.314565',
      endPoint: '118.366887,31.315129',
      slinkNodeId: 11002457473107,
      elinkNodeId: 11002441081153,
    },
  ],
  [1, 1, 1],
]
