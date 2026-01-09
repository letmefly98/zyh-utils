import BigNumber from 'bignumber.js'

// 高精度的 toFixed
export function toFixed(n: number, precision?: number): number
export function toFixed(n: number, precision: number, returnNumber: true): number
export function toFixed(n: number, precision: number, returnNumber: false): string
export function toFixed(n: number, precision = 2, returnNumber = true): string | number {
  const num = new BigNumber(n)
  const str = num.toFixed(precision ?? 2)
  if (returnNumber) return Number(str)
  return str
}

// 求和
export function sum(...arr: number[]) {
  return arr.reduce((acc, cur) => acc.plus(cur), new BigNumber(0)).toNumber()
}

// 求差
export function minus(...arr: number[]) {
  return arr.reduce((acc, cur) => acc.minus(cur), new BigNumber(0)).toNumber()
}

// 求乘积
export function times(...arr: number[]) {
  return arr.reduce((acc, cur) => acc.times(cur), new BigNumber(1)).toNumber()
}

// 求商
export function divide(...arr: number[]) {
  if (arr.length === 0) return 0
  const first = arr.shift() || 0
  if (arr.length === 0) return first
  return arr.reduce((acc, cur) => acc.dividedBy(cur), new BigNumber(first)).toNumber()
}

// 求平均数
export function average(...arr: number[]) {
  if (arr.length === 0) return 0
  const total = new BigNumber(sum(...arr))
  return total.dividedBy(arr.length).toNumber()
}
