import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts'
import { Star, TrendingUp, MessageSquare, Smile, AlertCircle, RefreshCw } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/ClientDashboard/Analytics')({
  component: AnalyticsPage,
})

// ─── Types ────────────────────────────────────────────────────────────────────

type Range = '7d' | '30d' | '90d' | '180d'

type Listing = {
  _id: string
  businessName?: string
  locationName?: string
  status: string
}

type AnalyticsData = {
  listing: { _id: string; businessName: string; status: string }
  summary: {
    performanceScore: number
    newReviews: number
    averageRating: number
    sentimentPositivePercent: number
  }
  charts: {
    ratingOverTime: { date: string; avgRating: number; count: number }[]
    sentimentOverTime: { date: string; positive: number; neutral: number; negative: number }[]
    reviewVolume: { date: string; count: number }[]
    ratingDistribution: { stars: number; count: number }[]
    complaintTrends: { date: string; complaints: number; positives: number }[]
  }
  insights: {
    repeatedPositives: { keyword: string; count: number }[]
    repeatedComplaints: { keyword: string; count: number }[]
  }
  reviews: {
    _id: string
    reviewerName?: string
    rating: number
    comment?: string
    reviewCreatedAt: string
    hasOwnerReply: boolean
  }[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAL = '#0F9D94'
const EMERALD = '#10B981'
const ROSE = '#F43F5E'
const SLATE = '#94A3B8'
const AMBER = '#F59E0B'

const STAR_COLORS: Record<number, string> = {
  1: '#F43F5E',
  2: '#FB923C',
  3: '#FBBF24',
  4: '#34D399',
  5: '#10B981',
}

const RANGES: Range[] = ['7d', '30d', '90d', '180d']

// ─── Small helpers ────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  )
}

function formatDate(iso: string, days: number) {
  if (iso.includes('W')) {
    // ISO week: "2024-W05"
    return iso.replace('W', 'W')
  }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function ScoreArc({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score))
  const r = 36
  const circumference = Math.PI * r // half circle
  const filled = (clamped / 100) * circumference
  return (
    <svg width="96" height="56" viewBox="0 0 96 56">
      <path
        d={`M 8 52 A ${r} ${r} 0 0 1 88 52`}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={`M 8 52 A ${r} ${r} 0 0 1 88 52`}
        fill="none"
        stroke={clamped >= 70 ? EMERALD : clamped >= 40 ? AMBER : ROSE}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`}
      />
      <text x="48" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0F172A">
        {clamped}
      </text>
    </svg>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { t, dir, isRTL } = useLocale()
  const p = t.clientPages.analytics
  const textAlign = isRTL ? 'text-right' : 'text-left'
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const [listings, setListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)

  const [selectedListing, setSelectedListing] = useState<string>('')
  const [range, setRange] = useState<Range>('30d')

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch connected listings on mount
  useEffect(() => {
    let cancelled = false
    apiRequest<{ data: Listing[] }>('/listings/', { token })
      .then((res) => {
        if (cancelled) return
        const all: Listing[] = (res as any).data ?? []
        const connected = all.filter((l) => l.status === 'connected')
        setListings(connected)
        if (connected.length > 0) setSelectedListing(connected[0]._id)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setListingsLoading(false) })
    return () => { cancelled = true }
  }, [token])

  // Fetch analytics whenever listing or range changes
  const fetchAnalytics = useCallback(async () => {
    if (!selectedListing) return
    setLoading(true)
    setError(null)
    try {
      const res = await apiRequest<{ success: boolean; data: AnalyticsData }>(
        `/client/dashboard/analytics?listingId=${selectedListing}&range=${range}`,
        { token }
      )
      setData((res as any).data)
    } catch (err) {
      setError(err instanceof Error ? err.message : p.error)
    } finally {
      setLoading(false)
    }
  }, [selectedListing, range, token, p.error])

  useEffect(() => {
    void fetchAnalytics()
  }, [fetchAnalytics])

  // ── Controls bar ────────────────────────────────────────────────────────────

  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      {/* Location selector */}
      <select
        value={selectedListing}
        onChange={(e) => setSelectedListing(e.target.value)}
        disabled={listingsLoading || listings.length === 0}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 disabled:opacity-50"
      >
        {listings.length === 0
          ? <option value="">{p.selectLocation}</option>
          : listings.map((l) => (
              <option key={l._id} value={l._id}>
                {l.businessName ?? l.locationName ?? l._id}
              </option>
            ))
        }
      </select>

      {/* Range selector */}
      <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`px-4 py-2.5 text-sm font-medium transition ${
              range === r
                ? 'bg-[#EAF7F4] text-[#0F9D94]'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {p.range[r]}
          </button>
        ))}
      </div>

      {/* Refresh */}
      <button
        type="button"
        onClick={() => void fetchAnalytics()}
        disabled={loading}
        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
        title="Refresh"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )

  // ── No listings state ────────────────────────────────────────────────────────

  if (!listingsLoading && listings.length === 0) {
    return (
      <section dir={dir} className="flex min-h-[calc(100vh-152px)] items-center justify-center">
        <div className={`text-center max-w-sm ${textAlign}`}>
          <p className="text-3xl font-extrabold text-slate-700">{p.noLocations}</p>
          <p className="mt-3 text-sm text-slate-400">{p.noLocationsSubtitle}</p>
          <Link
            to="/ClientDashboard/Locations"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#EAF7F4] px-5 py-3 text-sm font-bold text-[#0F9D94] transition hover:bg-[#dff3ee]"
          >
            {p.goToLocations}
          </Link>
        </div>
      </section>
    )
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────

  if (loading && !data) {
    return (
      <section dir={dir} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="h-7 w-40 animate-pulse rounded-lg bg-slate-100" />
              <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-slate-100" />
            </div>
            {controls}
          </div>
        </div>
        <div className="flex items-center justify-center py-32 text-sm text-slate-400">
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          {p.loading}
        </div>
      </section>
    )
  }

  const days = parseInt(range) // rough — fine for date formatting

  return (
    <section dir={dir} className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className={textAlign}>
            <h1 className="text-2xl font-extrabold text-slate-900">{p.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
          </div>
          {controls}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* No-data state */}
      {!loading && !error && data && data.summary.newReviews === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-lg font-bold text-slate-600">{p.noData}</p>
          <p className="mt-2 text-sm text-slate-400">{p.noDataSubtitle}</p>
        </div>
      )}

      {data && data.summary.newReviews > 0 && (
        <>
          {/* ── Summary cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {/* Performance Score */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center gap-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{p.summary.performanceScore}</p>
              <ScoreArc score={data.summary.performanceScore} />
              <p className="text-xs text-slate-400">/100</p>
            </div>

            {/* New Reviews */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                </div>
                <div className={`flex-1 ${textAlign}`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{p.summary.newReviews}</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{data.summary.newReviews}</p>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl bg-amber-50 p-3">
                  <Star className="h-5 w-5 text-amber-400" />
                </div>
                <div className={`flex-1 ${textAlign}`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{p.summary.averageRating}</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{data.summary.averageRating}</p>
                  <div className="mt-1"><Stars rating={Math.round(data.summary.averageRating)} /></div>
                </div>
              </div>
            </div>

            {/* Positive Sentiment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <Smile className="h-5 w-5 text-emerald-500" />
                </div>
                <div className={`flex-1 ${textAlign}`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{p.summary.sentimentPositive}</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{data.summary.sentimentPositivePercent}%</p>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${data.summary.sentimentPositivePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts row 1: Rating over time + Rating distribution ─────── */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Rating over time — 2/3 width */}
            <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className={`text-sm font-bold text-slate-800 ${textAlign}`}>{p.charts.ratingOverTime}</p>
              <p className={`mt-0.5 text-xs text-slate-400 ${textAlign}`}>{p.charts.ratingOverTimeDesc}</p>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.charts.ratingOverTime} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => formatDate(v, days)} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }}
                      formatter={(v: number) => [v.toFixed(2), p.legend.avgRating]}
                      labelFormatter={(v) => formatDate(v, days)}
                    />
                    <Line type="monotone" dataKey="avgRating" stroke={AMBER} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rating distribution — 1/3 width */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className={`text-sm font-bold text-slate-800 ${textAlign}`}>{p.charts.ratingDistribution}</p>
              <p className={`mt-0.5 text-xs text-slate-400 ${textAlign}`}>{p.charts.ratingDistributionDesc}</p>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.ratingDistribution} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 8 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis type="category" dataKey="stars" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                      tickFormatter={(v) => `★ ${v}`} width={32} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }}
                      formatter={(v: number) => [v, p.legend.count]}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
                      {data.charts.ratingDistribution.map((entry) => (
                        <Cell key={entry.stars} fill={STAR_COLORS[entry.stars] ?? TEAL} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Charts row 2: Sentiment + Volume ────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {/* Sentiment over time */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className={`text-sm font-bold text-slate-800 ${textAlign}`}>{p.charts.sentimentOverTime}</p>
              <p className={`mt-0.5 text-xs text-slate-400 ${textAlign}`}>{p.charts.sentimentOverTimeDesc}</p>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.charts.sentimentOverTime} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => formatDate(v, days)} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }}
                      formatter={(v: number, name: string) => [`${v}%`, p.legend[name as keyof typeof p.legend] ?? name]}
                      labelFormatter={(v) => formatDate(v, days)}
                    />
                    <Legend formatter={(v) => p.legend[v as keyof typeof p.legend] ?? v} />
                    <Area type="monotone" dataKey="positive" stackId="1" stroke={EMERALD} fill={EMERALD} fillOpacity={0.15} strokeWidth={2} />
                    <Area type="monotone" dataKey="neutral"  stackId="1" stroke={SLATE}   fill={SLATE}   fillOpacity={0.12} strokeWidth={2} />
                    <Area type="monotone" dataKey="negative" stackId="1" stroke={ROSE}    fill={ROSE}    fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Review volume */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className={`text-sm font-bold text-slate-800 ${textAlign}`}>{p.charts.reviewVolume}</p>
              <p className={`mt-0.5 text-xs text-slate-400 ${textAlign}`}>{p.charts.reviewVolumeDesc}</p>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.reviewVolume} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => formatDate(v, days)} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }}
                      formatter={(v: number) => [v, p.legend.count]}
                      labelFormatter={(v) => formatDate(v, days)}
                    />
                    <Bar dataKey="count" fill={TEAL} radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Charts row 3: Complaint trends ─────────────────────────── */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className={`text-sm font-bold text-slate-800 ${textAlign}`}>{p.charts.complaintTrends}</p>
            <p className={`mt-0.5 text-xs text-slate-400 ${textAlign}`}>{p.charts.complaintTrendsDesc}</p>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.charts.complaintTrends} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v) => formatDate(v, days)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }}
                    formatter={(v: number, name: string) => [v, p.legend[name as keyof typeof p.legend] ?? name]}
                    labelFormatter={(v) => formatDate(v, days)}
                  />
                  <Legend formatter={(v) => p.legend[v as keyof typeof p.legend] ?? v} />
                  <Line type="monotone" dataKey="positives"  stroke={EMERALD} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="complaints" stroke={ROSE}    strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Keyword Insights ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {/* Repeated positives */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Smile className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-sm font-bold text-slate-800">{p.insights.positives}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.insights.repeatedPositives.length === 0
                  ? <p className="text-xs text-slate-400">{p.insights.noPositives}</p>
                  : data.insights.repeatedPositives.map(({ keyword, count }) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      >
                        {keyword}
                        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
                      </span>
                    ))
                }
              </div>
            </div>

            {/* Repeated complaints */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <p className="text-sm font-bold text-slate-800">{p.insights.complaints}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.insights.repeatedComplaints.length === 0
                  ? <p className="text-xs text-slate-400">{p.insights.noComplaints}</p>
                  : data.insights.repeatedComplaints.map(({ keyword, count }) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                      >
                        {keyword}
                        <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
                      </span>
                    ))
                }
              </div>
            </div>
          </div>

          {/* ── Recent Reviews ────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className={`border-b border-slate-100 px-5 py-4 ${textAlign}`}>
              <p className="text-sm font-bold text-slate-800">{p.reviews.title}</p>
            </div>
            {data.reviews.length === 0
              ? (
                <p className="px-5 py-8 text-center text-sm text-slate-400">{p.reviews.noReviews}</p>
              )
              : (
                <ul className="divide-y divide-slate-100">
                  {data.reviews.map((rev) => (
                    <li key={rev._id} className={`flex items-start gap-4 px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar placeholder */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                        {(rev.reviewerName ?? '?').slice(0, 1).toUpperCase()}
                      </div>
                      <div className={`flex-1 min-w-0 ${textAlign}`}>
                        <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-semibold text-slate-900">{rev.reviewerName ?? '—'}</span>
                          <Stars rating={rev.rating} />
                          <span className={`ml-auto text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                            rev.hasOwnerReply ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {rev.hasOwnerReply ? p.reviews.replied : p.reviews.noReply}
                          </span>
                        </div>
                        {rev.comment && (
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{rev.comment}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-400">
                          {rev.reviewCreatedAt
                            ? new Date(rev.reviewCreatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                            : '—'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          </div>
        </>
      )}
    </section>
  )
}
