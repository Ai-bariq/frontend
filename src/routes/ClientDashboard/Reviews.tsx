import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Plus } from 'lucide-react'

export const Route = createFileRoute('/ClientDashboard/Reviews')({
  component: ReviewsPage,
})

function ReviewsPage() {
  return (
     <section className="flex min-h-[calc(100vh-152px)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-[34px] font-extrabold text-slate-700">
          الرجاء اختيار موقع
        </h1>
        <p className="mt-3 text-[15px] text-slate-400">
          اختر موقعاً من القائمة المنسدلة أعلاه لعرض التقييمات
        </p>

        <button
          type="button"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#EAF7F4] px-5 py-3 text-[14px] font-bold text-[#0F9D94] transition hover:bg-[#dff3ee]"
        >
          <MapPin className="h-4 w-4" />
          <span>إضافة موقع</span>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}