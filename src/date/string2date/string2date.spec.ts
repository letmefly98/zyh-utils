import { describe, expect, it } from 'vitest'
import { string2date } from './string2date'

describe('string2date', () => {
  it('default format (YYYY-MM-DD)', () => {
    expect(string2date('2022-05-20')).toStrictEqual(new Date(2022, 4, 20, 0, 0, 0))
    expect(string2date('1970-01-01')).toStrictEqual(new Date(1970, 0, 1, 0, 0, 0))
  })

  it('custom format', () => {
    expect(string2date('2022年05月20日', 'YYYY年MM月DD日')).toStrictEqual(new Date(2022, 4, 20, 0, 0, 0))
    expect(string2date('20220520', 'YYYYMMDD')).toStrictEqual(new Date(2022, 4, 20, 0, 0, 0))
    expect(string2date('05/20/2022', 'MM/DD/YYYY')).toStrictEqual(new Date(2022, 4, 20, 0, 0, 0))
  })

  it('with time', () => {
    expect(string2date('2022-05-20 23:59:59', 'YYYY-MM-DD HH:mm:ss'))
      .toStrictEqual(new Date(2022, 4, 20, 23, 59, 59))
    expect(string2date('2022-05-20 08:30:00', 'YYYY-MM-DD HH:mm:ss'))
      .toStrictEqual(new Date(2022, 4, 20, 8, 30, 0))
  })

  it('special format', () => {
    // 年月日缺失时会报 Invalid Date，用默认日期 1970-01-01 去填充
    expect(string2date('2022年 23:59:59', 'YYYY年 HH:mm:ss')).toStrictEqual(new Date(2022, 0, 1, 23, 59, 59))
    expect(string2date('05-20 23:59:59', 'MM-DD HH:mm:ss')).toStrictEqual(new Date(1970, 4, 20, 23, 59, 59))
    expect(string2date('5月 23:59:59', 'M月 HH:mm:ss')).toStrictEqual(new Date(1970, 4, 1, 23, 59, 59))
    expect(string2date('20日 23:59:59', 'DD日 HH:mm:ss')).toStrictEqual(new Date(1970, 0, 20, 23, 59, 59))
    expect(string2date('23:59:59', 'HH:mm:ss')).toStrictEqual(new Date(1970, 0, 1, 23, 59, 59))
    expect(string2date('08:30', 'HH:mm')).toStrictEqual(new Date(1970, 0, 1, 8, 30, 0))
  })

  it('invalid string', () => {
    expect(string2date('invalid', 'YYYY-MM-DD').toString()).toBe('Invalid Date')
    expect(string2date('1970-00-00').toString()).toBe('Invalid Date')
  })
})
