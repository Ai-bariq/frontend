import type { DisplayStatus } from '../../services/reviewReplyServices'

const STATUS_STYLES: Record<DisplayStatus, string> = {
  pending: 'bg-amber-50 text-amber-700',
  published: 'bg-teal-100 text-teal-800',
  failed: 'bg-rose-50 text-rose-700',
  deleted: 'bg-slate-100 text-slate-500',
}

type Props = {
  status: DisplayStatus
  label: string
}

export default function StatusBadge({ status, label }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-500'}`}
    >
      {label}
    </span>
  )
}
