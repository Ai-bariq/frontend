import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarDays,
  MessageSquareText,
  RefreshCw,
  Star,
  SmilePlus,
  TriangleAlert,
  BadgeCheck,
  TrendingUp,
} from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'

type DashboardSummary = {
  performanceScore: number | null
  newReviews: number
  averageRating: number | null
  sentiment: { positive: number; neutral: number; negative: number }
}

type TopicItem = { label: string; count: number }
type TimeSeriesPoint = { label: string; value: number }
type RatingDistributionItem = { stars: 1 | 2 | 3 | 4 | 5; count: number }

type DashboardAnalytics = {
  ratingTrend: TimeSeriesPoint[]
  sentimentTrend: TimeSeriesPoint[]
  reviewVolume: TimeSeriesPoint[]
  complaintTrend: TimeSeriesPoint[]
  ratingDistribution: RatingDistributionItem[]
  repeatedPositives: TopicItem[]
  repeatedComplaints: TopicItem[]
}

type DashboardDemographics = {
  topLanguages: TopicItem[]
  topCountries: TopicItem[]
  customerTypes: TopicItem[]
}

type DashboardData = {
  summary: DashboardSummary
  analytics: DashboardAnalytics
  demographics: DashboardDemographics
}

const EMPTY_DATA: DashboardData = {
  summary: { performanceScore: null, newReviews: 0, averageRating: null, sentiment: { positive: 0, neutral: 0, negative: 0 } },
  analytics: { ratingTrend: [], sentimentTrend: [], reviewVolume: [], complaintTrend: [], ratingDistribution: [], repeatedPositives: [], repeatedComplaints: [] },
  demographics: { topLanguages: [], topCountries: [], customerTypes: [] },
}

export const Route = createFileRoute('/ClientDashboard/')({
  component: ClientDashboardHomePage,
})

function getDominantSentimentPercent(sentiment: DashboardSummary['sentiment']) {
  const total = sentiment.positive + sentiment.neutral + sentiment.negative
  if (total === 0) return 50
  return Math.round((Math.max(sentiment.positive, sentiment.neutral, sentiment.negative) / total) * 100)
}

function ClientDashboardHomePage() {
  const { t, dir, isRTL } = useLocale()
  const data = EMPTY_DATA
  const sentimentPercent = getDominantSentimentPercent(data.summary.sentiment)

  const getSentimentLabel = () => {
    const { positive, neutral, negative } = data.summary.sentiment
    if (positive === 0 && neutral === 0 && negative === 0) return t.clientDashboard.sentimentLabels.neutral
    if (positive >= neutral && positive >= negative) return t.clientDashboard.sentimentLabels.positive
    if (negative >= positive && negative >= neutral) return t.clientDashboard.sentimentLabels.negative
    return t.clientDashboard.sentimentLabels.neutral
  }

  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <section dir={dir} className={`w-full ${textAlign}`}>
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-end justify-between gap-3 my-6">
          <h2 className="text-2xl font-extrabold text-slate-900">{t.clientDashboard.toolbar.title}</h2>
          <div className="flex gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50">
              <CalendarDays className="h-4 w-4" />
              {t.clientDashboard.toolbar.last30days}
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50">
              <RefreshCw className="h-4 w-4" />
              {t.clientDashboard.toolbar.refresh}
            </button>
          </div>
        </div>

        {/* Performance card */}
        <div className="flex w-full shrink-0 items-center justify-between rounded-[22px] border border-slate-200 bg-white p-6">
          <div className={textAlign}>
            <div className="text-[30px] font-extrabold text-slate-900">{t.clientDashboard.performance.title}</div>
            <p className="mt-2 max-w-[180px] text-[15px] leading-7 text-slate-500">
              {t.clientDashboard.performance.description}
            </p>
          </div>
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-rose-300 bg-rose-50">
            <span className="text-[58px] font-extrabold leading-none text-red-500">
              {data.summary.performanceScore ?? 0}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {[
            { title: t.clientDashboard.stats.newReviews, value: String(data.summary.newReviews), icon: <MessageSquareText className="h-5 w-5" /> },
            { title: t.clientDashboard.stats.avgRating, value: data.summary.averageRating !== null ? data.summary.averageRating.toFixed(1) : '0', icon: <Star className="h-5 w-5" /> },
            { title: t.clientDashboard.stats.sentiment, value: `${sentimentPercent}%`, subtitle: getSentimentLabel(), icon: <SmilePlus className="h-5 w-5" />, emoji: '🫤' },
          ].map(({ title, value, subtitle, icon, emoji }) => (
            <div key={title} className="flex-1 rounded-[20px] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'} ${textAlign}`}>
                  <div className="text-[14px] text-slate-500">{title}</div>
                  <div className="mt-2 text-[42px] font-extrabold leading-none text-slate-900">{value}</div>
                  {subtitle && <div className="mt-1 text-[13px] text-slate-500">{subtitle}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#0F9D94]">
                    {icon}
                  </div>
                  {emoji ? <span className="text-[36px]">{emoji}</span> : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <SectionTitle title={t.clientDashboard.sections.reputation} isRTL={isRTL} />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartCard title={t.clientDashboard.charts.sentimentTrend}>
              <EmptyLineChart yLabels={['0%', '25%', '50%', '75%', '100%']} isRTL={isRTL} />
            </ChartCard>
            <ChartCard title={t.clientDashboard.charts.ratingOverTime}>
              <EmptyLineChart yLabels={['0', '2', '5']} isRTL={isRTL} />
            </ChartCard>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartCard title={t.clientDashboard.charts.reviewVolume}>
              <EmptyBarsChart />
            </ChartCard>
            <ChartCard title={t.clientDashboard.charts.ratingDistribution}>
              <EmptyDistributionChart />
            </ChartCard>
          </div>
        </div>

        <SectionTitle title={t.clientDashboard.sections.complaints} isRTL={isRTL} />

        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
          <TopicsCard
            title={t.clientDashboard.topics.criticisms}
            subtitle={t.clientDashboard.topics.criticismsSubtitle}
            icon={<TriangleAlert className="h-4 w-4" />}
            tone="negative"
            items={data.analytics.repeatedComplaints}
            emptyText={t.clientDashboard.topics.emptySync}
            isRTL={isRTL}
          />
          <TopicsCard
            title={t.clientDashboard.topics.positives}
            subtitle={t.clientDashboard.topics.positivesSubtitle}
            icon={<BadgeCheck className="h-4 w-4" />}
            tone="positive"
            items={data.analytics.repeatedPositives}
            emptyText={t.clientDashboard.topics.emptySync}
            isRTL={isRTL}
          />
          <ChartCard title={t.clientDashboard.charts.complaintTrend}>
            <EmptyLineChart yLabels={['0', '1', '3']} isRTL={isRTL} />
          </ChartCard>
          <DemographicsCard demographics={data.demographics} isRTL={isRTL} />
        </div>
      </div>
    </section>
  )
}

function SectionTitle({ title, isRTL }: { title: string; isRTL: boolean }) {
  return (
    <div className={`flex ${isRTL ? 'justify-start' : 'justify-start'}`}>
      <h2 className="text-[32px] font-extrabold text-slate-900">{title}</h2>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-5">
      <div className="mb-5 flex justify-start">
        <h3 className="text-[24px] font-extrabold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function TopicsCard({
  title, subtitle, tone, items, emptyText, icon, isRTL,
}: {
  title: string; subtitle: string; tone: 'positive' | 'negative'; items: TopicItem[]; emptyText: string; icon: React.ReactNode; isRTL: boolean
}) {
  const toneClasses = tone === 'positive' ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <div className={`rounded-[20px] border p-5 ${toneClasses}`}>
      <div className={`mb-5 ${textAlign}`}>
        <div className="flex items-center justify-start gap-2">
          <span className="text-slate-400">{icon}</span>
          <h3 className="text-[22px] font-extrabold text-slate-900">{title}</h3>
        </div>
        <p className="mt-1 text-[14px] text-slate-500">{subtitle}</p>
      </div>

      {items.length === 0 ? (
        <div className="flex h-[240px] items-center justify-center rounded-[14px] border border-dashed border-slate-200 bg-slate-50 text-center">
          <p className="max-w-[420px] text-[15px] leading-7 text-slate-500">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-[14px] font-bold text-slate-900">{item.count}</span>
              <span className="text-[14px] text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DemographicsCard({ demographics, isRTL }: { demographics: DashboardDemographics; isRTL: boolean }) {
  const { t } = useLocale()
  const allEmpty = demographics.topLanguages.length === 0 && demographics.topCountries.length === 0 && demographics.customerTypes.length === 0

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-start gap-2">
        <TrendingUp className="h-5 w-5 text-slate-400" />
        <h3 className="text-[22px] font-extrabold text-slate-900">{t.clientDashboard.demographics.title}</h3>
      </div>

      {allEmpty ? (
        <div className="flex h-[240px] items-center justify-center rounded-[14px] border border-dashed border-slate-200 bg-slate-50">
          <p className="text-[15px] text-slate-500">{t.clientDashboard.topics.emptySync}</p>
        </div>
      ) : (
        <div className="space-y-5">
          <DemographicGroup title={t.clientDashboard.demographics.languages} items={demographics.topLanguages} isRTL={isRTL} noDataLabel={t.clientDashboard.demographics.noData} />
          <DemographicGroup title={t.clientDashboard.demographics.countries} items={demographics.topCountries} isRTL={isRTL} noDataLabel={t.clientDashboard.demographics.noData} />
          <DemographicGroup title={t.clientDashboard.demographics.customerTypes} items={demographics.customerTypes} isRTL={isRTL} noDataLabel={t.clientDashboard.demographics.noData} />
        </div>
      )}
    </div>
  )
}

function DemographicGroup({ title, items, isRTL, noDataLabel }: { title: string; items: TopicItem[]; isRTL: boolean; noDataLabel: string }) {
  const textAlign = isRTL ? 'text-right' : 'text-left'
  return (
    <div>
      <h4 className={`mb-3 ${textAlign} text-[15px] font-bold text-slate-700`}>{title}</h4>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-[14px] text-slate-400">
          {noDataLabel}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-[14px] font-bold text-slate-900">{item.count}</span>
              <span className="text-[14px] text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyLineChart({ yLabels, isRTL }: { yLabels: string[]; isRTL: boolean }) {
  return (
    <div className="relative h-[240px] rounded-[14px] border border-slate-100 bg-white">
      <div className="absolute inset-0 px-12 py-6">
        <div className="flex h-full flex-col justify-between">
          {yLabels.map((label) => (
            <div key={label} className="relative flex items-center">
              <span className={`absolute ${isRTL ? 'right-[-38px]' : 'left-[-38px]'} text-[11px] text-slate-400`}>{label}</span>
              <div className="h-px w-full border-t border-dashed border-slate-200" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 left-12 right-12 h-px bg-slate-300" />
      <div className={`absolute bottom-6 ${isRTL ? 'right-12' : 'left-12'} top-6 w-px bg-slate-300`} />
    </div>
  )
}

function EmptyBarsChart() {
  return (
    <div className="relative h-[240px] rounded-[14px] border border-slate-100 bg-white">
      <div className="absolute inset-0 px-12 py-6">
        <div className="flex h-full flex-col justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-t border-dashed border-slate-200" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 left-12 right-12 h-px bg-slate-300" />
      <div className="absolute bottom-6 right-12 top-6 w-px bg-slate-300" />
    </div>
  )
}

function EmptyDistributionChart() {
  return (
    <div className="relative h-[240px] rounded-[14px] border border-slate-100 bg-white">
      <div className="absolute inset-0 px-12 py-6">
        <div className="grid h-full grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-r border-dashed border-slate-200 last:border-r-0" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 left-12 right-12 h-px bg-slate-300" />
      <div className="absolute bottom-6 right-12 top-6 w-px bg-slate-300" />
    </div>
  )
}
