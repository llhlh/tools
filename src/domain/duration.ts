export interface DurationBreakdown {
  sign: 1 | -1
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
  totalSeconds: number
}

export function diffMillis(startMs: number, endMs: number): number {
  return endMs - startMs
}

export function breakdown(totalMs: number): DurationBreakdown {
  const sign: 1 | -1 = totalMs < 0 ? -1 : 1
  let remaining = Math.abs(totalMs)
  const days = Math.floor(remaining / 86_400_000)
  remaining -= days * 86_400_000
  const hours = Math.floor(remaining / 3_600_000)
  remaining -= hours * 3_600_000
  const minutes = Math.floor(remaining / 60_000)
  remaining -= minutes * 60_000
  const seconds = Math.floor(remaining / 1000)
  return {
    sign,
    days,
    hours,
    minutes,
    seconds,
    totalMs,
    totalSeconds: totalMs / 1000,
  }
}
