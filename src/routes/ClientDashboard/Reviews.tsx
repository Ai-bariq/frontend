import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Plus } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'

export const Route = createFileRoute('/ClientDashboard/Reviews')({
  component: ReviewsPage,
})

function ReviewsPage() {
  const { t, dir, isRTL } = useLocale()
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <section dir={dir} className="flex min-h-[calc(100vh-152px)] items-center justify-center">
      <div className={`text-center ${textAlign}`}>
        <h1 className="text-[34px] font-extrabold text-slate-700">
          {t.clientPages.reviews.emptyTitle}
        </h1>
        <p className="mt-3 text-[15px] text-slate-400">
          {t.clientPages.reviews.emptySubtitle}
        </p>

        <button
          type="button"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#EAF7F4] px-5 py-3 text-[14px] font-bold text-[#0F9D94] transition hover:bg-[#dff3ee]"
        >
          <MapPin className="h-4 w-4" />
          <span>{t.clientPages.reviews.addLocation}</span>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
