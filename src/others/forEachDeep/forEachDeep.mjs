/**
 * 树形 json 的深度遍历
 *
 * @param {object | Array} obj 树形 json
 * @param {(v: any, i: number, d: number)=> void} callback 遍历回调，v 项，d 深度，i 当前深度时的索引
 * @param {object} [opts] 可控制参数
 * @param {string} [opts.children='children'] 子节点 key
 * @param {number} [opts.depth=Number.POSITIVE_INFINITY] 可遍历深度
 * @param {'child' | 'parent'} [opts.firstly="parent"] DPS 深度优先 BFS 广度优先
 */
export function forEachDeep(obj, callback, opts) {
  // 入参校验，直接跳过
  if (!obj) return
  if (typeof callback !== 'function') return

  obj = Array.isArray(obj) ? obj : [obj]
  const {
    children = 'children',
    depth = Number.POSITIVE_INFINITY,
    firstly = 'parent',
  } = opts || {}

  const traverse = (items, d = 0) => {
    let i = 0
    items.forEach((v) => {
      if (firstly === 'parent') callback(v, i++, d)
      if (children in v && d < depth) {
        traverse(v[children], d + 1)
      }
      if (firstly === 'child') callback(v, i++, d)
    })
  }

  traverse(obj)
}
