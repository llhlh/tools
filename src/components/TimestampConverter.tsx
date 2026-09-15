import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  dateTimeStringsFromMs,
  formatInZone,
  parseWallClock,
  toIsoUtc,
  wallClockFromDateAndTimeStrings,
} from '../domain/datetimeInZone'
import {
  fromUnixMs,
  parseTimestampInput,
  toUnixSeconds,
  type TimestampUnit,
} from '../domain/timestamp'
import { luxonLocale } from '../domain/timezones'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { CopyField } from './CopyField'
import { TimezonePicker } from './TimezonePicker'

type InputMode = 'timestamp' | 'datetime'

type Props = {
  zone: string
  onZoneChange: (z: string) => void
}

export function TimestampConverter({ zone, onZoneChange }: Props) {
  const { t, i18n } = useTranslation()
  const locale = luxonLocale(i18n.language)
  const [mode, setMode] = useState<InputMode>('timestamp')
  const [timestampInput, setTimestampInput] = useState(String(Math.floor(Date.now() / 1000)))
  const [unit, setUnit] = useState<TimestampUnit>('auto')
  const [dateStr, setDateStr] = useState(() => dateTimeStringsFromMs(Date.now(), zone).date)
  const [timeStr, setTimeStr] = useState(() => dateTimeStringsFromMs(Date.now(), zone).time)

  const debouncedTs = useDebouncedValue(timestampInput, 300)
  const debouncedDate = useDebouncedValue(dateStr, 300)
  const debouncedTime = useDebouncedValue(timeStr, 300)

  const result = useMemo(() => {
    if (mode === 'timestamp') {
      const ms = parseTimestampInput(debouncedTs, unit)
      if (ms === null) {
        return { error: t('error.invalidTimestamp') as string }
      }
      const instant = fromUnixMs(ms)
      return {
        ms,
        utcIso: toIsoUtc(instant),
        inZone: formatInZone(instant, zone, locale),
        seconds: String(toUnixSeconds(ms)),
        milliseconds: String(ms),
      }
    }
    const parts = wallClockFromDateAndTimeStrings(debouncedDate, debouncedTime)
    if (!parts) {
      return { error: t('error.invalidLocalTime') as string }
    }
    const parsed = parseWallClock(parts, zone)
    if (!parsed.ok) {
      return { error: t('error.invalidLocalTime') as string }
    }
    const instant = parsed.instant
    return {
      ms: parsed.ms,
      utcIso: toIsoUtc(instant),
      inZone: formatInZone(instant, zone, locale),
      seconds: String(toUnixSeconds(parsed.ms)),
      milliseconds: String(parsed.ms),
    }
  }, [mode, debouncedTs, unit, debouncedDate, debouncedTime, zone, locale, t])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {t('converter.title')}
      </h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ['timestamp', 'converter.modeTimestamp'],
            ['datetime', 'converter.modeDatetime'],
          ] as const
        ).map(([m, labelKey]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              mode === m
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      <TimezonePicker
        id="converter-tz"
        value={zone}
        onChange={onZoneChange}
        className="mb-4"
      />

      {mode === 'timestamp' ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('converter.timestamp')}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('converter.unit')}
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as TimestampUnit)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            >
              <option value="auto">{t('converter.unitAuto')}</option>
              <option value="seconds">{t('converter.unitSeconds')}</option>
              <option value="milliseconds">{t('converter.unitMilliseconds')}</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('converter.date')}
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('converter.time')}
            </label>
            <input
              type="time"
              step={1}
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('converter.outputs')}
        </p>
        {'error' in result ? (
          <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
        ) : (
          <>
            <CopyField label={t('converter.utcIso')} value={result.utcIso} />
            <CopyField label={t('converter.localInZone')} value={result.inZone} />
            <CopyField label={t('converter.seconds')} value={result.seconds} />
            <CopyField label={t('converter.milliseconds')} value={result.milliseconds} />
          </>
        )}
      </div>
    </section>
  )
}
