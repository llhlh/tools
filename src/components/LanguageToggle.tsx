import { useTranslation } from 'react-i18next'
import { persistLanguage } from '../i18n'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const current = i18n.language.startsWith('zh') ? 'zh' : 'en'

  function setLang(lng: 'en' | 'zh') {
    void i18n.changeLanguage(lng)
    persistLanguage(lng)
  }

  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm dark:border-slate-700 dark:bg-slate-800">
      {(['en', 'zh'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => setLang(lng)}
          className={`rounded-md px-3 py-1.5 font-medium transition ${
            current === lng
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          {t(`lang.${lng}`)}
        </button>
      ))}
    </div>
  )
}
