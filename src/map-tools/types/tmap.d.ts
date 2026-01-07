import type MapTypes from 'tmap-gl-types'

declare global {
  namespace TMap {
    interface MarkerStyleOptions {
      enableRelativeScale?: boolean
      relativeScaleOptions?: {
        scaleZoom?: number
        minScale?: number
        maxScale?: number
      }
    }
  }
}
declare global {
  interface Window {
    TMap: typeof MapTypes | object
  }
}
