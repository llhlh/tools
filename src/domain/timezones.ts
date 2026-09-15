import { DateTime } from 'luxon'

export const COMMON_TIMEZONES = [
  'UTC',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Australia/Sydney',
] as const

let cachedAll: string[] | undefined

function loadAllTimezones(): string[] {
  try {
    if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
      const zones = Intl.supportedValuesOf('timeZone')
      return ['UTC', ...zones]
    }
  } catch {
    /* fall through */
  }
  return [...COMMON_TIMEZONES]
}

export function getAllTimezones(): string[] {
  if (!cachedAll) {
    cachedAll = loadAllTimezones()
  }
  return cachedAll
}

export function filterTimezones(query: string, limit = 80): string[] {
  const q = query.trim().toLowerCase()
  const all = getAllTimezones()
  if (!q) {
    const commonSet = new Set<string>(COMMON_TIMEZONES)
    const rest = all.filter((z) => !commonSet.has(z)).slice(0, limit - COMMON_TIMEZONES.length)
    return [...COMMON_TIMEZONES, ...rest]
  }
  const matches: string[] = []
  for (const zone of all) {
    if (zone.toLowerCase().includes(q)) {
      matches.push(zone)
      if (matches.length >= limit) break
    }
  }
  return matches
}

export function offsetLabel(zone: string, at?: DateTime): string {
  const instant = at ?? DateTime.now()
  const zoned = instant.setZone(zone)
  if (!zoned.isValid) return zone
  const offset = zoned.toFormat('ZZ')
  const isDst = zoned.isInDST
  return isDst ? `${offset} (DST)` : offset
}

export function luxonLocale(i18nLang: string): string {
  return i18nLang.startsWith('zh') ? 'zh-CN' : 'en-US'
}
