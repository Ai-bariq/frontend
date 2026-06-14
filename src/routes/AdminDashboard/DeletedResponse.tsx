import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useFilteredSearch } from '../../hooks/UseFilteredSearch'
import { useLocale } from '../../contexts/LocaleContext'

export const Route = createFileRoute('/AdminDashboard/DeletedResponse')({
  component: DeletedResponsesPage,
})

type DeletedResponseItem = {
  reviewId: string
  clientName: string
  clientEmail: string
  reviewText: string
  deletedResponse: string
  deletedAt: string
}

type SortOption = 'latest' | 'oldest'

const fakeDeletedResponses: DeletedResponseItem[] = [
  {
    reviewId: 'REV-601',
    clientName: 'أحمد علي',
    clientEmail: 'ahmed@example.com',
    reviewText: 'الخدمة كانت جيدة لكن الرد تأخر كثيرًا.',
    deletedResponse: 'نشكرك على تقييمك، ونسعد دائمًا بخدمتك ونتطلع لرؤيتك قريبًا.',
    deletedAt: '2026-04-19 09:20',
  },
  {
    reviewId: 'REV-602',
    clientName: 'سارة محمد',
    clientEmail: 'sara@example.com',
    reviewText: 'المكان نظيف جدًا لكن التجربة لم تكن كما توقعت.',
    deletedResponse: 'شكرًا لتقييمك، نحن نعتز بجميع ملاحظات العملاء ونعمل على التحسين المستمر.',
    deletedAt: '2026-04-19 11:10',
  },
  {
    reviewId: 'REV-603',
    clientName: 'محمود إبراهيم',
    clientEmail: 'mahmoud@example.com',
    reviewText: 'الطعام كان باردًا عند الوصول.',
    deletedResponse: 'نشكر ملاحظتك، وسنعمل على مراجعة جودة الخدمة لضمان تجربة أفضل.',
    deletedAt: '2026-04-19 13:40',
  },
  {
    reviewId: 'REV-604',
    clientName: 'نهى خالد',
    clientEmail: 'noha@example.com',
    reviewText: 'التعامل ممتاز جدًا وسأزور المكان مرة أخرى.',
    deletedResponse: 'يسعدنا سماع ذلك، شكرًا لثقتك ونتمنى رؤيتك قريبًا مرة أخرى.',
    deletedAt: '2026-04-20 08:55',
  },
]

const DELETED_RESPONSE_SEARCH_FIELDS: (keyof DeletedResponseItem)[] = [
  'reviewId',
  'clientEmail',
  'reviewText',
  'deletedResponse',
]

function getDateValue(value: string) {
  const parsed = new Date(value.replace(' ', 'T')).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function formatDateTime(value: string, locale: string) {
  const date = new Date(value.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function DeletedResponsesPage() {
  const { t, dir, isRTL, locale } = useLocale()
  const p = t.adminPages.deletedResponses
  const textAlign = isRTL ? 'text-right' : 'text-left'

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')

  const searchedResponses = useFilteredSearch(fakeDeletedResponses, search, DELETED_RESPONSE_SEARCH_FIELDS)

  const filteredResponses = useMemo(() => {
    return [...searchedResponses].sort((a, b) => {
      if (sortBy === 'latest') return getDateValue(b.deletedAt) - getDateValue(a.deletedAt)
      return getDateValue(a.deletedAt) - getDateValue(b.deletedAt)
    })
  }, [searchedResponses, sortBy])

  return (
    <section dir={dir} className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-[90%] max-w-none space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${isRTL ? '' : 'flex-row-reverse'}`}>
            <div className={textAlign}>
              <h1 className="text-2xl font-extrabold text-slate-900">{p.title}</h1>
              <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
            </div>

            <div className={`flex w-full flex-col gap-3 lg:w-auto ${isRTL ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={p.searchPlaceholder}
                className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 ${textAlign} text-sm outline-none focus:border-slate-400 lg:w-[380px]`}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="latest">{p.sort.latest}</option>
                <option value="oldest">{p.sort.oldest}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className={`w-full table-fixed ${textAlign} text-base`}>
            <thead className="bg-slate-100">
              <tr className="text-sm font-semibold text-slate-700">
                <th className="w-[12%] px-2 py-3">{p.table.reviewId}</th>
                <th className="w-[12%] px-2 py-3">{p.table.clientName}</th>
                <th className="w-[16%] px-2 py-3">{p.table.email}</th>
                <th className="w-[24%] px-2 py-3">{p.table.review}</th>
                <th className="w-[24%] px-2 py-3">{p.table.deletedResponse}</th>
                <th className="w-[12%] px-2 py-3">{p.table.deletedAt}</th>
              </tr>
            </thead>

            <tbody>
              {filteredResponses.length > 0 ? (
                filteredResponses.map((item) => (
                  <tr key={item.reviewId} className="border-t border-slate-100 align-top text-sm text-slate-700">
                    <td className="truncate whitespace-nowrap px-2 py-3 font-medium text-slate-900">{item.reviewId}</td>
                    <td className="truncate whitespace-nowrap px-2 py-3 font-medium text-slate-900">{item.clientName}</td>
                    <td className="truncate px-2 py-3 text-slate-600">{item.clientEmail}</td>
                    <td className="px-2 py-3 leading-6 text-slate-700">
                      <p className="line-clamp-3 break-words" title={item.reviewText}>{item.reviewText}</p>
                    </td>
                    <td className="px-2 py-3 leading-6 text-slate-900">
                      <p className="line-clamp-3 break-words" title={item.deletedResponse}>{item.deletedResponse}</p>
                    </td>
                    <td className="px-2 py-3 text-xs leading-5 text-slate-600">{formatDateTime(item.deletedAt, locale)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">{p.table.noResults}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
