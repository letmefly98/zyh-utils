/**
 * Vitest Setup: TMap CDN 加载器
 * 在测试执行前加载腾讯地图 SDK
 */

import { waitFor } from './utils'

const TMAP_CDN_URL = 'https://map.qq.com/api/gljs?v=1.exp&key=SD5BZ-RFZHU-C6ZVE-2H3GT-3I2DQ-2VFCG&libraries=tools,geometry'
const LOAD_TIMEOUT = 3_000

function loadTMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.TMap) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.id = 'tmap-gl-script'
    script.src = TMAP_CDN_URL
    script.async = true

    script.onload = () => {
      const promise = waitFor(() => !!(window.TMap && window.TMap.geometry), LOAD_TIMEOUT)
      promise.then(resolve).catch(reject)
    }

    script.onerror = () => {
      reject(new Error('TMap CDN script failed to load'))
    }

    document.head.appendChild(script)
  })
}

// 执行加载
await loadTMapScript()
export { }
