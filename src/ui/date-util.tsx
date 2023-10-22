import { DateTime } from 'luxon'

export function formatTime(date: Date) {
  return DateTime.fromJSDate(date).toLocaleString({
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
