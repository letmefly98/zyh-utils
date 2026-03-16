import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

export const tz = 'Asia/ShangHai'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(isLeapYear)
dayjs.extend(timezone)
dayjs.tz.setDefault(tz)

export const baseDayjs = dayjs
export const utcDayjs = dayjs.tz
