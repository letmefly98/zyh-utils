export interface LinkInfoItem {
  linkId: number
  startPoint?: string
  endPoint?: string
  direction: 1 | 2 | 3 | 4 // 道路方向类型： 1顺向 2逆向 3双向
  slinkNodeId: number // 道路几何方向前端点
  elinkNodeId: number // 道路几何方向后端点
}

type DirectionResultForward = 1
type DirectionResultReverse = 2
type DirectionResultNull = 0
export type DirectionResult = DirectionResultForward | DirectionResultReverse | DirectionResultNull
