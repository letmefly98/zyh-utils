import type { Point, PointLike } from '../types/base'
import { CoordinateTransform } from './libs/coordinate-transform'

// lng较大(116.40447399831032)(x轴)，lat较小(39.93362685019524)(y轴)

export function wgs2gcj(p: Point): Point {
  const { lat, lon } = CoordinateTransform.wgs84ToGcj02(p.lat, p.lng)
  return { lat, lng: lon }
}

export function gcj2wgs(p: Point): Point {
  const { lat, lon } = CoordinateTransform.gcj02ToWgs84(p.lat, p.lng)
  return { lat, lng: lon }
}

const txBase = 10 ** 7
export function int2tx(p: Point): Point {
  return { lat: p.lat / txBase, lng: p.lng / txBase }
}

export function tx2int(p: Point): Point {
  return { lat: p.lat * txBase, lng: p.lng * txBase }
}

export function point2str(p: Point | TMap.LatLng, latFirst = false): string {
  return latFirst ? `${p.lat},${p.lng}` : `${p.lng},${p.lat}`
}

export function str2point(str: string, latFirst = false): Point {
  let [lng, lat] = str.split(',').map(e => Number(e.trim()))
  if (latFirst) [lat, lng] = [lng, lat]
  return { lng, lat }
}

export function point2arr(p: Point, latFirst = false): [number, number] {
  return latFirst ? [p.lat, p.lng] : [p.lng, p.lat]
}

export function arr2point(arr: [number, number], latFirst = false): Point {
  return latFirst ? { lng: arr[1], lat: arr[0] } : { lng: arr[0], lat: arr[1] }
}

export function toll(lat: number, lng: number): TMap.LatLng {
  const TMap = window.TMap
  return new TMap.LatLng(lat, lng)
}

export function point2ll(p: Point): TMap.LatLng {
  const TMap = window.TMap
  if (p instanceof TMap.LatLng) return p
  return new TMap.LatLng(p.lat, p.lng)
}

export function ll2point(p: TMap.LatLng): Point {
  return { lng: p.lng, lat: p.lat }
}

export function xy2ll(data: { x: number, y: number }): TMap.LatLng {
  return getPosition({ lat: data.y, lng: data.x }) as TMap.LatLng
}

// 兼容各种格式的坐标输入，统一输出 TMap.LatLng
export function getPosition(p?: PointLike, latFirst = false): TMap.LatLng | undefined {
  if (!p) return undefined

  try {
    let point: Point

    // 处理特殊格式入参
    if (p instanceof TMap.LatLng) {
      point = p
    } else if (Array.isArray(p)) {
      point = arr2point(p, latFirst)
    } else if (typeof p === 'string') {
      point = str2point(p, latFirst)
    } else {
      point = p as Point
    }

    const unValid = Number.isNaN(point.lat) || Number.isNaN(point.lng)
    if (unValid) return undefined

    // 坐标值较大，可能为云图加密坐标
    if (point.lat > 500) {
      point = int2tx(point)
    }

    // 坐标不合规
    const isBad = point.lng > 180 || point.lat > 90 || point.lng <= 0 || point.lat <= 0
    if (isBad) return undefined

    return point2ll(point)
  } catch (err) {
    console.error(err)
    return undefined
  }
}

// 计算坐标点偏移
export function offsetPosition(point: Point, offset: Point): Point {
  return { lat: point.lat + offset.lat, lng: point.lng + offset.lng }
}
