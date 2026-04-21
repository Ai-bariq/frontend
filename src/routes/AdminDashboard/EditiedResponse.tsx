import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useFilteredSearch } from '../../hooks/UseFilteredSearch'

export const Route = createFileRoute('/AdminDashboard/EditiedResponse')({
  component: EditedResponsesPage,
})

type EditedResponseItem = {
  reviewId: string
  clientName: string
  clientEmail: string
  reviewText: string
  aiResponse: string
  editedResponse: string
  editedAt: string
}

type SortOption = 'latest' | 'oldest'

const fakeEditedResponses: EditedResponseItem[] = [
  {
    reviewId: 'REV-501',
    clientName: 'أحمد علي',
    clientEmail: 'ahmed@example.com',
    reviewText: 'الخدمة كانت ممتازة جدًا والموظف كان متعاون.',
    aiResponse:
      'Thank you for your feedback, we are happy you enjoyed the service.',
    editedResponse:
      'شكرًا جدًا على تقييمك الكريم، سعداء جدًا بتجربتك معنا ونتطلع لخدمتك مرة أخرى.',
    editedAt: '2026-04-19 10:30',
  },
  {
    reviewId: 'REV-503',
    clientName: 'محمود إبراهيم',
    clientEmail: 'mahmoud@example.com',
    reviewText: 'الطعام جيد جدًا لكن السعر أعلى من المتوقع.',
    aiResponse: 'Thanks for your feedback regarding pricing.',
    editedResponse:
      'شكرًا لك على مشاركتنا رأيك، نقدر ملاحظتك بخصوص الأسعار وسنأخذها بعين الاعتبار.',
    editedAt: '2026-04-19 11:00',
  },
  {
    reviewId: 'REV-506',
    clientName: 'سارة محمد',
    clientEmail: 'sara@example.com',
    reviewText: 'التجربة جيدة لكن وقت الانتظار طويل.',
    aiResponse: 'We apologize for the delay and appreciate your feedback.',
    editedResponse:
      'نعتذر عن وقت الانتظار، ونشكرك على ملاحظتك. نعمل حاليًا على تحسين سرعة الخدمة.',
    editedAt: '2026-04-19 12:15',
  },
  {
    reviewId: 'REV-509',
    clientName: 'نهى خالد',
    clientEmail: 'noha@example.com',
    reviewText: 'المكان نظيف جدًا لكن التعامل كان يحتاج اهتمام أكثر.',
    aiResponse: 'Thank you for sharing your experience with us.',
    editedResponse:
      'شكرًا لمشاركتك تجربتك معنا، ونقدّر ملاحظتك بخصوص التعامل وسنعمل على تحسينه.',
    editedAt: '2026-04-20 09:40',
  },
]

const EDITED_RESPONSE_SEARCH_FIELDS: (keyof EditedResponseItem)[] = [
  'reviewId',
  'clientEmail',
  'reviewText',
  'aiResponse',
  'editedResponse',
]

function getDateValue(value: string) {
  const parsed = new Date(value.replace(' ', 'T')).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function formatDateTime(value: string) {
  const date = new Date(value.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function EditedResponsesPage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')

  const searchedResponses = useFilteredSearch(
    fakeEditedResponses,
    search,
    EDITED_RESPONSE_SEARCH_FIELDS
  )

  const filteredResponses = useMemo(() => {
    return [...searchedResponses].sort((a, b) => {
      if (sortBy === 'latest') {
        return getDateValue(b.editedAt) - getDateValue(a.editedAt)
      }

      return getDateValue(a.editedAt) - getDateValue(b.editedAt)
    })
  }, [searchedResponses, sortBy])

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-[90%] max-w-none space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-extrabold text-slate-900">
                الردود المعدلة
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                عرض الرد الأصلي من الذكاء الاصطناعي والنسخة المعدلة مع التقييم المرتبط به.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بـ ID أو البريد الإلكتروني أو كلمة..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-right text-sm outline-none focus:border-slate-400 lg:w-[320px]"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="latest">الأحدث</option>
                <option value="oldest">الأقدم</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full table-fixed text-right text-base">
            <thead className="bg-slate-100">
              <tr className="text-sm font-semibold text-slate-700">
                <th className="w-[10%] px-2 py-3">Review ID</th>
                <th className="w-[10%] px-2 py-3">اسم العميل</th>
                <th className="w-[14%] px-2 py-3">البريد الإلكتروني</th>
                <th className="w-[18%] px-2 py-3">التقييم</th>
                <th className="w-[16%] px-2 py-3">رد الذكاء الاصطناعي</th>
                <th className="w-[20%] px-2 py-3">الرد المعدل</th>
                <th className="w-[12%] px-2 py-3">وقت التعديل</th>
              </tr>
            </thead>

            <tbody>
              {filteredResponses.length > 0 ? (
                filteredResponses.map((item) => (
                  <tr
                    key={item.reviewId}
                    className="border-t border-slate-100 align-top text-sm text-slate-700"
                  >
                    <td className="truncate whitespace-nowrap px-2 py-3 font-medium text-slate-900">
                      {item.reviewId}
                    </td>

                    <td className="truncate whitespace-nowrap px-2 py-3 font-medium text-slate-900">
                      {item.clientName}
                    </td>

                    <td className="truncate px-2 py-3 text-slate-600">
                      {item.clientEmail}
                    </td>

                    <td className="px-2 py-3 leading-6 text-slate-700">
                      <p className="line-clamp-3 break-words" title={item.reviewText}>
                        {item.reviewText}
                      </p>
                    </td>

                    <td className="px-2 py-3 leading-6 text-slate-700">
                      <p className="line-clamp-3 break-words" title={item.aiResponse}>
                        {item.aiResponse}
                      </p>
                    </td>

                    <td className="px-2 py-3 leading-6 text-slate-900">
                      <p className="line-clamp-3 break-words" title={item.editedResponse}>
                        {item.editedResponse}
                      </p>
                    </td>

                    <td className="px-2 py-3 text-xs leading-5 text-slate-600">
                      {formatDateTime(item.editedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    لا توجد نتائج
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}