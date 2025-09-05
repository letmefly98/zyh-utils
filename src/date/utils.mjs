import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/ShangHai')

export const utcDayjs = dayjs.tz
