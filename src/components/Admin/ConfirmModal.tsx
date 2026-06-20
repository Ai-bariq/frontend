import { useLocale } from '../../contexts/LocaleContext'

type Props = {
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  /** Optional controlled textarea for finalText edits */
  textareaValue?: string
  textareaPlaceholder?: string
  onTextareaChange?: (value: string) => void
  /** Variant — default neutral, danger for destructive actions */
  variant?: 'default' | 'danger'
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
  textareaValue,
  textareaPlaceholder,
  onTextareaChange,
  variant = 'default',
}: Props) {
  const { isRTL } = useLocale()

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white'
      : 'bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>

        {onTextareaChange !== undefined && (
          <textarea
            className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
            rows={4}
            value={textareaValue}
            placeholder={textareaPlaceholder}
            onChange={(e) => onTextareaChange(e.target.value)}
          />
        )}

        <div className={`mt-5 flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition disabled:opacity-60 ${confirmBtnClass}`}
          >
            {loading ? '...' : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
