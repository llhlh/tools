import { DateTime } from 'luxon'

export type TimestampUnit = 'auto' | 'seconds' | 'milliseconds'

export function detectTimestampUnit(raw: string): 'seconds' | 'milliseconds' {
  const digits = raw.replace(/\D/g, '')
  if (digits.length <= 10) return 'seconds'
  return 'milliseconds'
}

export function parseTimestampInput(
  value: string,
  unit: TimestampUnit,
): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  if (!Number.isFinite(num)) return null
  const resolved =
    unit === 'auto' ? detectTimestampUnit(trimmed) : unit
  return resolved === 'seconds' ? Math.trunc(num * 1000) : Math.trunc(num)
}

export function fromUnixMs(ms: number): DateTime {
  return DateTime.fromMillis(ms, { zone: 'utc' })
}

export function toUnixSeconds(ms: number): number {
  return Math.trunc(ms / 1000)
}
