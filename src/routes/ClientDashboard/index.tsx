import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BadgeCheck,
  CalendarDays,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  SmilePlus,
  Star,
  TriangleAlert,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/ClientDashboard/')({
  component: ClientDashboardHomePage,
})

type Envelope<T> = { data: T }
type Listing = {
  _id: string
  businessName?: string
  locationName?: string
  status: string
}
type Analytics = {
  listing: { _id: string; businessName: string }
  summary: {
    performanceScore: number
    newReviews: number
    averageRating: number
    sentimentPositivePercent: number
  }
  charts: {
    ratingOverTime: Array<{ date: string; avgRating: number; count: number }>
    sentimentOverTime: Array<{
      date: string
      positive: number
      neutral: number
      negative: number
    }>
    reviewVolume: Array<{ date: string; count: number }>
    ratingDistribution: Array<{ stars: number; count: number }>
    complaintTrends: Array<{
      date: string
      complaints: number
      positives: number
    }>
  }
  insights: {
    repeatedPositives: Array<{ keyword: string; count: number }>
    repeatedComplaints: Array<{ keyword: string; count: number }>
  }
  reviews: Array<{
    _id: string
    reviewerName?: string
    rating: number
    comment?: string
    reviewCreatedAt: string
  }>
}

function ClientDashboardHomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [listingId, setListingId] = useState('')
  const [range, setRange] = useState('30d')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadListings = useCallback(async () => {
    await apiRequest('/zernio/sync-reviews', {
      method: 'POST',
    }).catch(() => null)
    const response = await apiRequest<
      Envelope<{ listings: Listing[] }>
    >('/listings')
    const connected = (response.data?.listings ?? []).filter(
      (listing) => listing.status === 'connected',
    )
    setListings(connected)
    setListingId((current) => current || connected[0]?._id || '')
    if (connected.length === 0) {
      setAnalytics(null)
      setLoading(false)
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    if (!listingId) return
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest<Envelope<Analytics>>(
        `/client/dashboard/analytics?listingId=${encodeURIComponent(listingId)}&range=${range}`,
      )
      setAnalytics(response.data)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'تعذر تحميل التحليلات.',
      )
    } finally {
      setLoading(false)
    }
  }, [listingId, range])

  useEffect(() => {
    void loadListings().catch((requestError) => {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'تعذر تحميل المواقع.',
      )
      setLoading(false)
    })
  }, [loadListings])

  useEffect(() => {
    if (listingId) void loadAnalytics()
  }, [listingId, range, loadAnalytics])

  const maxVolume = useMemo(
    () =>
      Math.max(
        1,
        ...(analytics?.charts.reviewVolume.map((point) => point.count) ?? []),
      ),
    [analytics],
  )

  if (!loading && listings.length === 0) {
    return (
      <EmptyDashboard
        title="اربط موقعك لبدء التحليلات"
        description="بعد ربط Google Business سنزامن التقييمات ونملأ لوحة التحكم تلقائياً."
      />
    )
  }

  return (
    <section dir="rtl" className="w-full text-right">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-6 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              لوحة التحكم
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              تحليلات حقيقية من تقييمات Google Business.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={listingId}
              onChange={(event) => setListingId(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"
            >
              {listings.map((listing) => (
                <option key={listing._id} value={listing._id}>
                  {listing.locationName || listing.businessName || 'موقع'}
                </option>
              ))}
            </select>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"
            >
              <option value="7d">آخر 7 أيام</option>
              <option value="30d">آخر 30 يوماً</option>
              <option value="90d">آخر 90 يوماً</option>
              <option value="180d">آخر 180 يوماً</option>
            </select>
            <button
              type="button"
              onClick={() => {
                void apiRequest('/zernio/sync-reviews', {
                  method: 'POST',
                }).finally(() => void loadAnalytics())
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        {loading || !analytics ? (
          <div className="flex min-h-[420px] items-center justify-center text-teal-600">
            <LoaderCircle className="h-9 w-9 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
              <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    ملخص الأداء
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    جودة السمعة بناءً على التقييم والمشاعر.
                  </p>
                </div>
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-teal-300 bg-teal-50 text-4xl font-extrabold text-teal-700">
                  {analytics.summary.performanceScore}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  label="تقييمات جديدة"
                  value={analytics.summary.newReviews}
                  icon={<MessageSquareText />}
                />
                <MetricCard
                  label="متوسط التقييم"
                  value={analytics.summary.averageRating.toFixed(1)}
                  icon={<Star />}
                />
                <MetricCard
                  label="مشاعر إيجابية"
                  value={`${analytics.summary.sentimentPositivePercent}%`}
                  icon={<SmilePlus />}
                />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              اتجاهات السمعة
            </h2>
            <div className="grid gap-4 xl:grid-cols-2">
              <ChartCard title="التقييم عبر الزمن">
                <LineChart
                  data={analytics.charts.ratingOverTime.map((point) => ({
                    label: formatBucket(point.date),
                    value: point.avgRating,
                  }))}
                  max={5}
                />
              </ChartCard>
              <ChartCard title="اتجاه المشاعر">
                <LineChart
                  data={analytics.charts.sentimentOverTime.map((point) => ({
                    label: formatBucket(point.date),
                    value: point.positive,
                  }))}
                  max={100}
                  suffix="%"
                />
              </ChartCard>
              <ChartCard title="حجم التقييمات">
                <BarChart
                  data={analytics.charts.reviewVolume.map((point) => ({
                    label: formatBucket(point.date),
                    value: point.count,
                  }))}
                  max={maxVolume}
                />
              </ChartCard>
              <ChartCard title="توزيع التقييمات">
                <DistributionChart
                  data={analytics.charts.ratingDistribution}
                />
              </ChartCard>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              تحليل الملاحظات
            </h2>
            <div className="grid gap-4 xl:grid-cols-2">
              <TopicsCard
                title="إيجابيات متكررة"
                items={analytics.insights.repeatedPositives}
                positive
              />
              <TopicsCard
                title="انتقادات متكررة"
                items={analytics.insights.repeatedComplaints}
              />
              <ChartCard title="اتجاه الشكاوى">
                <BarChart
                  data={analytics.charts.complaintTrends.map((point) => ({
                    label: formatBucket(point.date),
                    value: point.complaints,
                  }))}
                  max={Math.max(
                    1,
                    ...analytics.charts.complaintTrends.map(
                      (point) => point.complaints,
                    ),
                  )}
                  color="#f97316"
                />
              </ChartCard>
              <ChartCard title="أحدث التقييمات">
                <div className="space-y-3">
                  {analytics.reviews.slice(0, 5).map((review) => (
                    <div
                      key={review._id}
                      className="rounded-xl border border-slate-100 p-3"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">
                          {review.reviewerName || 'عميل Google'}
                        </span>
                        <span className="text-amber-500">
                          {'★'.repeat(review.rating)}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {review.comment || 'بدون تعليق'}
                      </p>
                    </div>
                  ))}
                  <Link
                    to="/ClientDashboard/Reviews"
                    className="inline-block font-bold text-teal-700"
                  >
                    عرض كل التقييمات
                  </Link>
                </div>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-extrabold text-slate-900">{value}</p>
        </div>
        <span className="rounded-xl bg-teal-50 p-3 text-teal-600">{icon}</span>
      </div>
    </div>
  )
}

function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-5 text-xl font-extrabold text-slate-900">{title}</h3>
      {children}
    </div>
  )
}

function LineChart({
  data,
  max,
  suffix = '',
}: {
  data: Array<{ label: string; value: number }>
  max: number
  suffix?: string
}) {
  if (!data.length) return <NoData />
  const width = 640
  const height = 230
  const pad = 30
  const points = data.map((point, index) => ({
    ...point,
    x: pad + (index * (width - pad * 2)) / Math.max(1, data.length - 1),
    y: height - pad - (point.value / max) * (height - pad * 2),
  }))
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[560px]">
        {[0, 1, 2, 3, 4].map((line) => {
          const y = pad + (line * (height - pad * 2)) / 4
          return (
            <line
              key={line}
              x1={pad}
              x2={width - pad}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="4 5"
            />
          )
        })}
        <polyline
          fill="none"
          stroke="#0f9d94"
          strokeWidth="3"
          points={points.map((point) => `${point.x},${point.y}`).join(' ')}
        />
        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle cx={point.x} cy={point.y} r="4" fill="#0f9d94" />
            <title>
              {point.label}: {point.value}
              {suffix}
            </title>
            {index % Math.ceil(data.length / 6) === 0 ? (
              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {point.label}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  )
}

function BarChart({
  data,
  max,
  color = '#0f9d94',
}: {
  data: Array<{ label: string; value: number }>
  max: number
  color?: string
}) {
  if (!data.length) return <NoData />
  return (
    <div className="flex h-56 items-end gap-2 overflow-x-auto border-b border-slate-200 px-2">
      {data.map((point) => (
        <div
          key={point.label}
          className="flex min-w-8 flex-1 flex-col items-center justify-end gap-2"
        >
          <span className="text-xs font-bold text-slate-500">{point.value}</span>
          <div
            title={`${point.label}: ${point.value}`}
            className="w-full max-w-10 rounded-t-md"
            style={{
              height: `${Math.max(3, (point.value / max) * 170)}px`,
              backgroundColor: color,
            }}
          />
          <span className="max-w-14 truncate text-[10px] text-slate-500">
            {point.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function DistributionChart({
  data,
}: {
  data: Array<{ stars: number; count: number }>
}) {
  const max = Math.max(1, ...data.map((item) => item.count))
  return (
    <div className="space-y-4">
      {[...data].reverse().map((item) => (
        <div key={item.stars} className="flex items-center gap-3">
          <span className="w-10 text-sm font-bold">{item.stars} ★</span>
          <div className="h-4 flex-1 rounded-full bg-slate-100">
            <div
              className="h-4 rounded-full bg-teal-600"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 text-sm text-slate-500">{item.count}</span>
        </div>
      ))}
    </div>
  )
}

function TopicsCard({
  title,
  items,
  positive = false,
}: {
  title: string
  items: Array<{ keyword: string; count: number }>
  positive?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        positive
          ? 'border-emerald-200 bg-emerald-50/40'
          : 'border-orange-200 bg-orange-50/40'
      }`}
    >
      <div className="flex items-center gap-2">
        {positive ? (
          <BadgeCheck className="h-5 w-5 text-emerald-600" />
        ) : (
          <TriangleAlert className="h-5 w-5 text-orange-600" />
        )}
        <h3 className="text-xl font-extrabold">{title}</h3>
      </div>
      {items.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.keyword}
              className="rounded-lg border border-current/15 bg-white px-3 py-2 text-sm"
            >
              {item.keyword} <b>{item.count}</b>
            </span>
          ))}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  )
}

function NoData() {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-slate-400">
      لا توجد بيانات كافية في الفترة المحددة.
    </div>
  )
}

function EmptyDashboard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      dir="rtl"
      className="flex min-h-[65vh] flex-col items-center justify-center text-center"
    >
      <MessageSquareText className="h-12 w-12 text-teal-600" />
      <h1 className="mt-5 text-3xl font-extrabold text-slate-900">{title}</h1>
      <p className="mt-3 max-w-lg text-slate-500">{description}</p>
      <Link
        to="/ClientDashboard/Accounts"
        className="mt-6 rounded-xl bg-teal-600 px-5 py-3 font-bold text-white"
      >
        إضافة موقع
      </Link>
    </div>
  )
}

function formatBucket(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ar-SA', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}
