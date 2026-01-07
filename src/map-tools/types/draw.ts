interface GeometryBase<T = any> {
  id: string
  styleId: string
  properties: { styleId: string, data: T }
  rank?: number
}

export interface Point {
  lng: number // 经度 lng较大(116.40447399831032)(x轴)
  lat: number // 纬度 lat较小(39.93362685019524)(y轴)
}
export type PointArray = [number, number]
export type PointLike = Point | PointArray | TMap.LatLng | string
// export type Paths = Point[];
// export type Line = [Point, Point];
// export type Area = Point[];
// export type Lines = Line[];

export type DotDrawItem<T = any> = GeometryBase<T> & {
  position: TMap.LatLng
}

export type LineDrawItem<T = any> = GeometryBase<T> & {
  paths: TMap.LatLng[]
}

export type ArrowDrawItem<T = any> = GeometryBase<T> & {
  paths: TMap.LatLng[]
}

export type AreaDrawItem<T = any> = GeometryBase<T> & {
  paths: TMap.LatLng[]
}

export type MarkerDrawItem<T = any> = GeometryBase<T> & {
  position: TMap.LatLng
}

export type TextDrawItem<T = any> = GeometryBase<T> & {
  position: TMap.LatLng
  content: string
}

export type MapDrawItem<T = any> = GeometryBase<T> & {
  position: TMap.LatLng
}

export type LayerMap = TMap.MultiPolyline | TMap.MultiPolygon | TMap.MultiMarker | TMap.MultiLabel | TMap.Map

export type GeometryOf<T, D = any> = T extends TMap.MultiPolygon
  ? AreaDrawItem<D>
  : T extends TMap.MultiPolyline
    ? LineDrawItem<D>
    : T extends TMap.MultiMarker
      ? MarkerDrawItem<D>
      : T extends TMap.MultiLabel
        ? TextDrawItem<D>
        : T extends TMap.Map
          ? TMap.MapEvent
          : never
