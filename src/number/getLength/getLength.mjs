/**
 *
 */
export function getLength(obj) {
  if (!obj) return 0
  let count = 0
  if (typeof obj === 'string') {
    // eslint-disable-next-line no-unused-vars
    for (const _ of obj) count++
  } else if (Object.keys) {
    return Object.keys(obj).length
  } else {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) count++
    }
  }
  return count
}
