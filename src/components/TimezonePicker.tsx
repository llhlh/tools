import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { filterTimezones, offsetLabel } from '../domain/timezones'

type Props = {
  value: string
  onChange: (zone: string) => void
  id?: string
  className?: string
}

export function TimezonePicker({ value, onChange, id, className = '' }: Props) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const options = useMemo(() => filterTimezones(query), [query])
  const offset = offsetLabel(value, DateTime.now())

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {t('common.timezone')}
      </label>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          value={open ? query : value}
          placeholder={t('common.searchTimezone')}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150)
          }}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
          {t('common.offset')}: {offset}
        </span>
      </div>
      {open && options.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {options.map((zone) => (
            <li key={zone}>
              <button
                type="button"
                role="option"
                aria-selected={zone === value}
                className="flex w-full px-3 py-2 text-left hover:bg-indigo-50 dark:hover:bg-slate-800"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(zone)
                  setQuery('')
                  setOpen(false)
                }}
              >
                {zone}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
