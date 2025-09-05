/**
 * svg 字符串转 base64 字符串
 *
 * @example
 * svg2base64('<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="red" /></svg>')
 * // data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNiIgZmlsbD0icmVkIiAvPjwvc3ZnPg==
 *
 * @param {string} svgStr svg 字符串
 * @returns {string} base64 字符串
 */
export function svg2base64(svgStr) {
  if (!svgStr.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgStr = svgStr.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
  }
  const prefix = 'data:image/svg+xml;base64,'
  const base64 = window.btoa(svgStr)
  return prefix + base64
}
