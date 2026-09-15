import { useTranslation } from 'react-i18next'
import { useCopyToast } from '../hooks/useCopyToast'

type Props = {
  label: string
  value: string
}

export function CopyField({ label, value }: Props) {
  const { t } = useTranslation()
  const { message, copy } = useCopyToast()

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <button
          type="button"
          onClick={() => void copy(value, t('common.copied'))}
          className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-700"
        >
          {message === t('common.copied') ? t('common.copied') : t('common.copy')}
        </button>
      </div>
      <code className="block break-all text-sm text-slate-900 dark:text-slate-100">{value}</code>
    </div>
  )
}
