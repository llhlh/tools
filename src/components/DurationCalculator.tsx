import { useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import {
  formatInZone,
  parseWallClock,
  wallClockFromDateAndTimeStrings,
} from '../domain/datetimeInZone'
import { breakdown, diffMillis } from '../domain/duration'
import { luxonLocale } from '../domain/timezones'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { TimezonePicker } from './TimezonePicker'

type Props = {
  defaultZone: string
}

export function DurationCalculator({ defaultZone }: Props) {
  const { t, i18n } = useTranslation()
  const locale = luxonLocale(i18n.language)
  const [startZone, setStartZone] = useState(defaultZone)
  const [endZone, setEndZone] = useState(defaultZone)
  const [startDate, setStartDate] = useState('2024-01-01')
  const [startTime, setStartTime] = useState('00:00:00')
  const [useNow, setUseNow] = useState(true)
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    setStartZone(defaultZone)
    setEndZone(defaultZone)
  }, [defaultZone])

  useEffect(() => {
    if (!useNow) return
    setNowMs(Date.now())
    const id = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [useNow])

  const debStartDate = useDebouncedValue(startDate, 300)
  const debStartTime = useDebouncedValue(startTime, 300)
  const debEndDate = useDebouncedValue(endDate, 300)
  const debEndTime = useDebouncedValue(endTime, 300)

  const computed = useMemo(() => {
    const startParts = wallClockFromDateAndTimeStrings(debStartDate, debStartTime)
    if (!startParts) {
      return { error: t('error.invalidLocalTime') as string }
    }
    const startParsed = parseWallClock(startParts, startZone)
    if (!startParsed.ok) {
      return { error: t('error.invalidLocalTime') as string }
    }

    let endMs: number
    let endDisplay: string
    if (useNow) {
      endMs = nowMs
      endDisplay = formatInZone(DateTime.fromMillis(nowMs, { zone: 'utc' }), endZone, locale)
    } else {
      const endParts = wallClockFromDateAndTimeStrings(debEndDate, debEndTime)
      if (!endParts) {
        return { error: t('error.invalidLocalTime') as string }
      }
      const endParsed = parseWallClock(endParts, endZone)
      if (!endParsed.ok) {
        return { error: t('error.invalidLocalTime') as string }
      }
      endMs = endParsed.ms
      endDisplay = formatInZone(endParsed.instant, endZone, locale)
    }

    const delta = diffMillis(startParsed.ms, endMs)
    const b = breakdown(delta)
    const startDisplay = formatInZone(startParsed.instant, startZone, locale)

    return { b, delta, startDisplay, endDisplay }
  }, [
    debStartDate,
    debStartTime,
    startZone,
    useNow,
    nowMs,
    debEndDate,
    debEndTime,
    endZone,
    locale,
    t,
  ])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {t('duration.title')}
      </h2>

      <div className="mb-6 space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t('duration.start')}
          </h3>
          <TimezonePicker id="start-tz" value={startZone} onChange={setStartZone} className="mb-3" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
            <input
              type="time"
              step={1}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t('duration.end')}
          </h3>
          <label className="mb-3 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={useNow}
              onChange={(e) => setUseNow(e.target.checked)}
              className="rounded border-slate-300"
            />
            {t('duration.useNow')}
          </label>
          {!useNow && (
            <>
              <TimezonePicker id="end-tz" value={endZone} onChange={setEndZone} className="mb-3" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
                />
                <input
                  type="time"
                  step={1}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
                />
              </div>
            </>
          )}
          {useNow && (
            <TimezonePicker id="end-tz-now" value={endZone} onChange={setEndZone} className="mb-1" />
          )}
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('duration.result')}
        </p>
        {'error' in computed ? (
          <p className="text-sm text-red-600 dark:text-red-400">{computed.error}</p>
        ) : (
          <>
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              {computed.startDisplay} → {computed.endDisplay}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {computed.b.sign === -1 ? '−' : ''}
              {computed.b.days}
              {t('unit.days')} {computed.b.hours}
              {t('unit.hours')} {computed.b.minutes}
              {t('unit.minutes')} {computed.b.seconds}
              {t('unit.seconds')}
            </p>
            {computed.b.sign === -1 && (
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                {t('duration.negativeHint')}
              </p>
            )}
            <dl className="mt-3 grid gap-1 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
              <div>
                <dt className="inline">{t('duration.totalMs')}: </dt>
                <dd className="inline font-mono">{computed.delta}</dd>
              </div>
              <div>
                <dt className="inline">{t('duration.totalSeconds')}: </dt>
                <dd className="inline font-mono">{computed.b.totalSeconds}</dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </section>
  )
}
