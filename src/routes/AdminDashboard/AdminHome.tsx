import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  Pencil,
  Trash2,
  Search,
  Star,
  Bot,
  Clock3,
  Building2,
} from 'lucide-react'
import { useFilteredSearch } from '../../hooks/UseFilteredSearch'

export const Route = createFileRoute('/AdminDashboard/AdminHome')({
  component: AdminHome,
})

type ReviewRow = {
  responseId: string
  reviewId: string
  clientName: string
  clientEmail: string
  stars: number
  reviewText: string
  aiResponse: string
  reviewCreatedAt: string
  responseCreatedAt: string
}

type SortOption = 'latest' | 'oldest' | 'highestStars' | 'lowestStars'

type Business = {
  id: string
  name: string
  email: string
  agentEnabled: boolean
}

const initialReviews: ReviewRow[] = [
  {
    responseId: 'RESP-1001',
    reviewId: 'REV-501',
    clientName: 'أحمد علي',
    clientEmail: 'ahmed@example.com',
    stars: 5,
    reviewText: 'الخدمة كانت ممتازة جدًا والموظف كان متعاون.',
    aiResponse:
      'شكرًا جدًا على تقييمك الكريم، سعداء جدًا بتجربتك معنا ونتطلع لخدمتك مرة أخرى.',
    reviewCreatedAt: '2026-04-18 10:30',
    responseCreatedAt: '2026-04-18 10:33',
  },
  {
    responseId: 'RESP-1002',
    reviewId: 'REV-502',
    clientName: 'سارة محمد',
    clientEmail: 'sara@example.com',
    stars: 3,
    reviewText: 'المكان نظيف لكن وقت الانتظار كان طويل.',
    aiResponse:
      'نشكر ملاحظتك، ونعتذر عن وقت الانتظار. نعمل حاليًا على تحسين سرعة الخدمة.',
    reviewCreatedAt: '2026-04-18 12:10',
    responseCreatedAt: '2026-04-18 12:15',
  },
  {
    responseId: 'RESP-1003',
    reviewId: 'REV-503',
    clientName: 'محمود إبراهيم',
    clientEmail: 'mahmoud@example.com',
    stars: 4,
    reviewText: 'الطعام جيد جدًا لكن السعر أعلى من المتوقع.',
    aiResponse:
      'شكرًا لك على مشاركتنا رأيك، نقدر ملاحظتك بخصوص الأسعار وسنأخذها بعين الاعتبار.',
    reviewCreatedAt: '2026-04-19 09:00',
    responseCreatedAt: '2026-04-19 09:04',
  },
  {
    responseId: 'RESP-1004',
    reviewId: 'REV-504',
    clientName: 'نهى خالد',
    clientEmail: 'noha@example.com',
    stars: 5,
    reviewText: 'تجربة ممتازة وسأعود مرة أخرى بالتأكيد.',
    aiResponse:
      'يسعدنا جدًا سماع ذلك، شكرًا لثقتك ونتمنى رؤيتك مرة أخرى قريبًا.',
    reviewCreatedAt: '2026-04-19 11:20',
    responseCreatedAt: '2026-04-19 11:22',
  },
  {
    responseId: 'RESP-1005',
    reviewId: 'REV-505',
    clientName: 'منى سمير',
    clientEmail: 'mona@example.com',
    stars: 2,
    reviewText: '',
    aiResponse:
      'نشكر تقييمك، ونأسف أن التجربة لم تكن بالمستوى المتوقع. نعمل على التحسين.',
    reviewCreatedAt: '2026-04-19 12:10',
    responseCreatedAt: '2026-04-19 12:14',
  },
]

const fakeBusinesses: Business[] = [
  {
    id: 'BUS-201',
    name: 'مطعم الذوق',
    email: 'contact@taste.com',
    agentEnabled: true,
  },
  {
    id: 'BUS-202',
    name: 'عيادة النور',
    email: 'info@elnour.com',
    agentEnabled: true,
  },
  {
    id: 'BUS-203',
    name: 'كافيه المدينة',
    email: 'hello@citycafe.com',
    agentEnabled: false,
  },
  {
    id: 'BUS-204',
    name: 'صيدلية الشفاء',
    email: 'support@shifa.com',
    agentEnabled: true,
  },
  {
    id: 'BUS-205',
    name: 'فندق الماسة',
    email: 'booking@almassa.com',
    agentEnabled: true,
  },
]

const REVIEW_SEARCH_FIELDS: (keyof ReviewRow)[] = [
  'responseId',
  'reviewId',
  'clientEmail',
  'reviewText',
  'aiResponse',
]

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

function getDateValue(value: string) {
  const parsed = new Date(value.replace(' ', 'T')).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function StarsDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < value
        return (
          <Star
            key={index}
            className={`h-4 w-4 ${
              filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        )
      })}
    </div>
  )
}

function calculateAverageResponseTimeInMinutes(items: ReviewRow[]) {
  if (!items.length) return 0

  const totalMinutes = items.reduce((sum, item) => {
    const reviewTime = getDateValue(item.reviewCreatedAt)
    const responseTime = getDateValue(item.responseCreatedAt)

    if (!reviewTime || !responseTime || responseTime < reviewTime) return sum

    const diffInMinutes = Math.round((responseTime - reviewTime) / 60000)
    return sum + diffInMinutes
  }, 0)

  return Math.round(totalMinutes / items.length)
}

export default function AdminHome() {
  const [reviews, setReviews] = useState<ReviewRow[]>(initialReviews)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedResponse, setEditedResponse] = useState('')

  const totalResponses = reviews.length
  const averageResponseTime = calculateAverageResponseTimeInMinutes(reviews)
  const totalBusinesses = fakeBusinesses.filter(
    (business) => business.agentEnabled
  ).length

  const searchedReviews = useFilteredSearch(
    reviews,
    search,
    REVIEW_SEARCH_FIELDS
  )

  const filteredAndSortedReviews = useMemo(() => {
    return [...searchedReviews].sort((a, b) => {
      if (sortBy === 'latest') {
        return getDateValue(b.reviewCreatedAt) - getDateValue(a.reviewCreatedAt)
      }

      if (sortBy === 'oldest') {
        return getDateValue(a.reviewCreatedAt) - getDateValue(b.reviewCreatedAt)
      }

      if (sortBy === 'highestStars') {
        return b.stars - a.stars
      }

      return a.stars - b.stars
    })
  }, [searchedReviews, sortBy])

  const startEdit = (row: ReviewRow) => {
    setEditingId(row.responseId)
    setEditedResponse(row.aiResponse)
  }

  const saveEdit = (responseId: string) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.responseId === responseId
          ? {
              ...item,
              aiResponse: editedResponse.trim() || item.aiResponse,
              responseCreatedAt: new Date()
                .toISOString()
                .slice(0, 16)
                .replace('T', ' '),
            }
          : item
      )
    )

    setEditingId(null)
    setEditedResponse('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditedResponse('')
  }

  const deleteResponse = (responseId: string) => {
    setReviews((prev) => prev.filter((item) => item.responseId !== responseId))
  }

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-[90%] max-w-none space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-extrabold text-slate-900">
                الصفحة الرئيسية
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                آخر تقييمات العملاء وردود الذكاء الاصطناعي مع إجراءات الإدارة.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 xl:w-auto xl:flex-row">
              <div className="relative w-full xl:w-[360px]">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث بـ ID أو البريد الإلكتروني أو كلمة..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-4 text-right text-sm text-slate-700 outline-none transition focus:border-slate-400"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
              >
                <option value="latest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="highestStars">أعلى تقييم</option>
                <option value="lowestStars">أقل تقييم</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-slate-100 p-3">
                <Bot className="h-6 w-6 text-slate-700" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">عدد الردود</p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {totalResponses}
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  إجمالي ردود الذكاء الاصطناعي
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-slate-100 p-3">
                <Clock3 className="h-6 w-6 text-slate-700" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">
                  متوسط وقت الرد
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {averageResponseTime} دقيقة
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  متوسط المدة بين التقييم والرد
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-slate-100 p-3">
                <Building2 className="h-6 w-6 text-slate-700" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">
                  عدد الأنشطة التجارية
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {totalBusinesses}
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  الشركات التي تستخدم الوكلاء
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full table-fixed text-right text-base">
            <thead className="bg-slate-100">
              <tr className="text-sm font-bold text-slate-700">
                <th className="w-[8%] px-2 py-3">ID الرد</th>
                <th className="w-[7%] px-2 py-3">ID التقييم</th>
                <th className="w-[9%] px-2 py-3">اسم العميل</th>
                <th className="w-[12%] px-2 py-3">البريد</th>
                <th className="w-[8%] px-2 py-3">النجوم</th>
                <th className="w-[16%] px-2 py-3">التقييم</th>
                <th className="w-[18%] px-2 py-3">الرد</th>
                <th className="w-[9%] px-2 py-3">وقت التقييم</th>
                <th className="w-[9%] px-2 py-3">وقت الرد</th>
                <th className="w-[14%] px-2 py-3">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedReviews.length > 0 ? (
                filteredAndSortedReviews.map((row) => {
                  const isEditing = editingId === row.responseId

                  return (
                    <tr
                      key={row.responseId}
                      className="border-t border-slate-100 align-top text-sm text-slate-700"
                    >
                      <td className="truncate whitespace-nowrap px-2 py-3 font-semibold text-slate-900">
                        {row.responseId}
                      </td>

                      <td className="truncate whitespace-nowrap px-2 py-3 text-slate-700">
                        {row.reviewId}
                      </td>

                      <td className="truncate px-2 py-3 font-semibold text-slate-900">
                        {row.clientName}
                      </td>

                      <td className="truncate px-2 py-3 text-slate-600">
                        {row.clientEmail}
                      </td>

                      <td className="px-2 py-3">
                        <div className="space-y-1">
                          <div className="text-right font-semibold text-slate-800">
                            {row.stars}/5
                          </div>
                          <StarsDisplay value={row.stars} />
                        </div>
                      </td>

                      <td className="px-2 py-3 leading-6 text-slate-700">
                        {row.reviewText.trim() ? (
                          <p
                            className="line-clamp-3 break-words"
                            title={row.reviewText}
                          >
                            {row.reviewText}
                          </p>
                        ) : (
                          <span className="text-slate-400">
                            تقييم بالنجوم فقط
                          </span>
                        )}
                      </td>

                      <td className="px-2 py-3 leading-6">
                        {isEditing ? (
                          <div className="space-y-2">
                            <textarea
                              value={editedResponse}
                              onChange={(e) => setEditedResponse(e.target.value)}
                              rows={4}
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={cancelEdit}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                              >
                                إلغاء
                              </button>
                              <button
                                onClick={() => saveEdit(row.responseId)}
                                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                              >
                                حفظ
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p
                            className="line-clamp-3 break-words text-slate-700"
                            title={row.aiResponse}
                          >
                            {row.aiResponse}
                          </p>
                        )}
                      </td>

                      <td className="px-2 py-3 text-xs leading-5 text-slate-600">
                        {formatDateTime(row.reviewCreatedAt)}
                      </td>

                      <td className="px-2 py-3 text-xs leading-5 text-slate-600">
                        {formatDateTime(row.responseCreatedAt)}
                      </td>

                      <td className="px-2 py-3">
                        {!isEditing && (
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => startEdit(row)}
                              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              تعديل
                            </button>

                            <button
                              onClick={() => deleteResponse(row.responseId)}
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              حذف
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    لا توجد نتائج مطابقة.
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