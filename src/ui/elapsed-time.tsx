'use client'
import { formatTime } from '@/ui/date-util'
import { useEffect, useState } from 'react'

function elapsedTime(startTime: string) {
  const start = new Date(`${startTime}Z`)
  const now = new Date()
  return now.getTime() - start.getTime()
}

function formatStartTime(startTime: string) {
  const start = new Date(`${startTime}Z`)
  return formatTime(start)
}

export function ElapsedTime({ live, startTime }: { live: boolean; startTime: string }) {
  const [elapsed, setElapsed] = useState(elapsedTime(startTime))

  function formatDuration(ms: number): string {
    const padWithZero = (n: number): string => (n < 10 ? '0' + n : n.toString())

    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    const remainingSeconds = seconds - minutes * 60
    const remainingMinutes = minutes - hours * 60

    return (
      (hours > 0 ? padWithZero(hours) + ':' : '') +
      (minutes > 0 || hours > 0 ? padWithZero(remainingMinutes) + ':' : '') +
      padWithZero(remainingSeconds)
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(elapsedTime(startTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return <div>{live ? formatStartTime(startTime) : formatDuration(elapsed)}</div>
}
