import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTACT_EMAIL } from '../config/contact'
import { LanguageToggle } from './LanguageToggle'
import { TimezonePicker } from './TimezonePicker'

type Props = {
  zone: string
  onZoneChange: (z: string) => void
  children: ReactNode
}

export function Layout({ zone, onZoneChange, children }: Props) {
  const { t } = useTranslation()

  return (
    <div className="min-h-svh bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('app.title')}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('app.subtitle')}</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <LanguageToggle />
            <div className="w-full min-w-[240px] sm:w-72">
              <TimezonePicker id="global-tz" value={zone} onChange={onZoneChange} />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-1 px-4 text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>{t('contact.hint')}</span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
          >
            {t('contact.label')}: {CONTACT_EMAIL}
          </a>
        </div>
      </footer>
    </div>
  )
}
