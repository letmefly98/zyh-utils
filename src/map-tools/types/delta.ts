/** 四个角的类型 */
export type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

/** 拖拽后移动的像素距离 */
export interface Delta {
  left: number
  top: number
  right: number
  bottom: number
}
