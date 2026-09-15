import { DateTime } from 'luxon'

export interface WallClockParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export type ParseWallClockResult =
  | { ok: true; ms: number; instant: DateTime }
  | { ok: false; reason: 'invalid' }

export function parseWallClock(
  parts: WallClockParts,
  zone: string,
): ParseWallClockResult {
  const dt = DateTime.fromObject(
    {
      year: parts.year,
      month: parts.month,
      day: parts.day,
      hour: parts.hour,
      minute: parts.minute,
      second: parts.second,
    },
    { zone },
  )
  if (!dt.isValid) {
    return { ok: false, reason: 'invalid' }
  }
  return { ok: true, ms: dt.toMillis(), instant: dt.toUTC() }
}

export function formatInZone(
  instantUtc: DateTime,
  zone: string,
  locale: string,
): string {
  return instantUtc
    .setZone(zone)
    .setLocale(locale)
    .toFormat('yyyy-MM-dd HH:mm:ss')
}

export function toIsoUtc(instantUtc: DateTime): string {
  return instantUtc.toUTC().toISO() ?? ''
}

export function wallClockFromDateAndTimeStrings(
  dateStr: string,
  timeStr: string,
): WallClockParts | null {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  const timeParts = (timeStr || '00:00:00').split(':').map(Number)
  const hour = timeParts[0] ?? 0
  const minute = timeParts[1] ?? 0
  const second = timeParts[2] ?? 0
  return { year: y, month: m, day: d, hour, minute, second }
}

export function dateTimeStringsFromMs(
  ms: number,
  zone: string,
): { date: string; time: string } {
  const dt = DateTime.fromMillis(ms, { zone })
  return {
    date: dt.toFormat('yyyy-MM-dd'),
    time: dt.toFormat('HH:mm:ss'),
  }
}
