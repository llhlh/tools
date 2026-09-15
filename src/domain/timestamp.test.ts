import { describe, expect, it } from 'vitest'
import { DateTime } from 'luxon'
import {
  detectTimestampUnit,
  fromUnixMs,
  parseTimestampInput,
  toUnixSeconds,
} from './timestamp'
import { parseWallClock } from './datetimeInZone'
import { breakdown, diffMillis } from './duration'

describe('timestamp', () => {
  it('detects seconds vs milliseconds', () => {
    expect(detectTimestampUnit('1704067200')).toBe('seconds')
    expect(detectTimestampUnit('1704067200000')).toBe('milliseconds')
  })

  it('parses timestamp input', () => {
    expect(parseTimestampInput('1704067200', 'auto')).toBe(1704067200_000)
    expect(parseTimestampInput('1704067200000', 'auto')).toBe(1704067200_000)
    expect(parseTimestampInput('1704067200', 'seconds')).toBe(1704067200_000)
  })

  it('round-trips via fromUnixMs', () => {
    const ms = 1704067200_000
    expect(toUnixSeconds(ms)).toBe(1704067200)
    expect(fromUnixMs(ms).toMillis()).toBe(ms)
  })
})

describe('datetimeInZone', () => {
  it('parses Asia/Shanghai wall clock to UTC instant', () => {
    const r = parseWallClock(
      {
        year: 2024,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
      },
      'Asia/Shanghai',
    )
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.ms).toBe(1704038400_000)
      expect(r.instant.toISO()).toBe('2023-12-31T16:00:00.000Z')
    }
  })

  it('handles America/New_York standard offset in winter', () => {
    const r = parseWallClock(
      {
        year: 2024,
        month: 1,
        day: 15,
        hour: 12,
        minute: 0,
        second: 0,
      },
      'America/New_York',
    )
    expect(r.ok).toBe(true)
    if (r.ok) {
      const utc = DateTime.fromISO('2024-01-15T17:00:00.000Z')
      expect(r.instant.toMillis()).toBe(utc.toMillis())
    }
  })
})

describe('duration', () => {
  it('computes diff and breakdown', () => {
    const start = 0
    const end = 90_061_000
    const delta = diffMillis(start, end)
    expect(delta).toBe(90_061_000)
    const b = breakdown(delta)
    expect(b.sign).toBe(1)
    expect(b.days).toBe(1)
    expect(b.hours).toBe(1)
    expect(b.minutes).toBe(1)
    expect(b.seconds).toBe(1)
  })

  it('negative diff', () => {
    const b = breakdown(-5000)
    expect(b.sign).toBe(-1)
    expect(b.seconds).toBe(5)
  })
})
