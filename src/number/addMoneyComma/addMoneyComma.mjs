/**
 * 添加千位分隔符（比如用于钱币）
 * @param {string|number} num 数字
 * @returns {string} 添加千位分隔符后的数字字符串
 */
export function addMoneyComma(num) {
  if (num === null || num === undefined || num === '') {
    return ''
  }

  // 转换为字符串
  const str = String(num)

  // 检查是否为有效数字
  if (Number.isNaN(Number(str))) {
    return str
  }

  // 直接使用正则表达式处理整个字符串
  return str.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')
}
