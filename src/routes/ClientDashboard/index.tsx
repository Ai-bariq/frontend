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

type DashboardSummary = {
  performanceScore: number | null
  performanceLabel?: string | null
  performanceDescription?: string | null
  newReviews: number
  averageRating: number | null
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
}

type TopicItem = {
  label: string
  count: number
}

type TimeSeriesPoint = {
  label: string
  value: number
}

type RatingDistributionItem = {
  stars: 1 | 2 | 3 | 4 | 5
  count: number
}

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
  summary: {
    performanceScore: null,
    performanceLabel: null,
    performanceDescription: null,
    newReviews: 0,
    averageRating: null,
    sentiment: {
      positive: 0,
      neutral: 0,
      negative: 0,
    },
  },
  analytics: {
    ratingTrend: [],
    sentimentTrend: [],
    reviewVolume: [],
    complaintTrend: [],
    ratingDistribution: [],
    repeatedPositives: [],
    repeatedComplaints: [],
  },
  demographics: {
    topLanguages: [],
    topCountries: [],
    customerTypes: [],
  },
}

const STYLES = {
  page: 'w-full',
  container: 'mx-auto flex w-full max-w-[1380px] flex-col gap-6',
  toolbarRow: 'flex flex-wrap items-end justify-between gap-3 my-6',

  heroRow: 'flex flex-col gap-4 xl:flex-row xl:items-stretch',
  heroTextCard: 'flex-1 rounded-[22px] border border-slate-200 bg-white p-6',
  heroScoreCard:
    'flex w-full shrink-0 items-center justify-between rounded-[22px] border border-slate-200 bg-white p-6 xl:w-[360px]',
  heroScoreCircle:
    'flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-rose-300 bg-rose-50',
  heroScoreValue: 'text-[58px] font-extrabold leading-none text-red-500',

  statsRow: 'flex flex-col gap-4 lg:flex-row',
  statCard: 'flex-1 rounded-[20px] border border-slate-200 bg-white p-5',

  sectionTitleWrap: 'flex justify-start',
  sectionTitle: 'text-[32px] font-extrabold text-slate-900',

  chartsWrap: 'flex flex-col gap-4',
chartPair: 'grid grid-cols-1 gap-4 xl:grid-cols-2',
  chartCard: 'rounded-[20px] border border-slate-200 bg-white p-5',

  complaintGrid: 'grid grid-cols-1 gap-4 2xl:grid-cols-2',
  topicCard: 'rounded-[20px] border p-5',
  demographicsCard: 'rounded-[20px] border border-slate-200 bg-white p-5',

  button:
    'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50',
} as const

export const Route = createFileRoute('/ClientDashboard/')({
  component: ClientDashboardHomePage,
})

function ClientDashboardHomePage() {
  const data = EMPTY_DATA

  const sentimentPercent = getDominantSentimentPercent(data.summary.sentiment)
  const sentimentLabel = getSentimentLabel(data.summary.sentiment)

  return (
    <section dir="rtl" className="w-full text-right">
      <div className={STYLES.container}>
        <DashboardToolbar />
        
<div className={STYLES.heroScoreCard}>
            <div className="text-right">
              <div className="text-[30px] font-extrabold text-slate-900">
                ملخص الأداء
              </div>
              <p className="mt-2 max-w-[180px] text-[15px] leading-7 text-slate-500">
                صحة تفاصيلك بناءً على التقييم والمشاعر
              </p>
            </div>

            <div className={STYLES.heroScoreCircle}>
              <span className={STYLES.heroScoreValue}>
                {data.summary.performanceScore ?? 0}
              </span>
            </div>
          </div>
        
        <div className={STYLES.statsRow}>
          <SummaryCard
            title="تقييمات جديدة"
            value={String(data.summary.newReviews)}
            icon={<MessageSquareText className="h-5 w-5" />}
          />

          <SummaryCard
            title="متوسط التقييم"
            value={
              data.summary.averageRating !== null
                ? data.summary.averageRating.toFixed(1)
                : '0'
            }
            icon={<Star className="h-5 w-5" />}
          />

          <SummaryCard
            title="المشاعر"
            value={`${sentimentPercent}%`}
            subtitle={sentimentLabel}
            icon={<SmilePlus className="h-5 w-5" />}
            emoji="🫤"
          />
        </div>

        <SectionTitle title="اتجاهات السمعة" />

        <div className={STYLES.chartsWrap}>
  <div className={STYLES.chartPair}>
    <ChartCard title="اتجاه المشاعر">
      <EmptyLineChart yLabels={['0%', '25%', '50%', '75%', '100%']} />
    </ChartCard>

    <ChartCard title="التقييم عبر الزمن">
      <EmptyLineChart yLabels={['0', '2', '5']} />
    </ChartCard>
  </div>

  <div className={STYLES.chartPair}>
    <ChartCard title="حجم التقييمات">
      <EmptyBarsChart />
    </ChartCard>

    <ChartCard title="توزيع التقييمات">
      <EmptyDistributionChart />
    </ChartCard>
  </div>
</div>

        <SectionTitle title="تحليل الشكاوى" />

        <div className={STYLES.complaintGrid}>
          <TopicsCard
            title="انتقادات متكررة"
            subtitle="ما يذكره العملاء بشكل سلبي مرارًا"
            icon={<TriangleAlert className="h-4 w-4" />}
            tone="negative"
            items={data.analytics.repeatedComplaints}
            emptyText="لا توجد بيانات بعد. ننتظر Sync أو Backfill لتحليل التقييمات."
          />

          <TopicsCard
            title="إيجابيات متكررة"
            subtitle="ما يمدحه العملاء مرارًا"
            icon={<BadgeCheck className="h-4 w-4" />}
            tone="positive"
            items={data.analytics.repeatedPositives}
            emptyText="لا توجد بيانات بعد. ننتظر Sync أو Backfill لتحليل التقييمات."
          />

          <ChartCard title="اتجاه الشكاوى">
            <EmptyLineChart yLabels={['0', '1', '3']} />
          </ChartCard>

          <DemographicsCard demographics={data.demographics} />
        </div>
      </div>
    </section>
  )
}

function DashboardToolbar() {
  return (
    <div className={STYLES.toolbarRow}>
      <SectionTitle title="لوحة التحكم"  className="text-2xl font-extrabold text-slate-900 "/>
      <div>
        <button type="button" className={STYLES.button}>
        <CalendarDays className="h-4 w-4" />
        آخر 30 يوم
      </button>

      <button type="button" className={STYLES.button}>
        <RefreshCw className="h-4 w-4" />
        تحديث
      </button>
        </div>
      
    </div>

  )
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  emoji,
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  emoji?: string
}) {
  return (
    <div className={STYLES.statCard}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-end text-right">
          <div className="text-[14px] text-slate-500">{title}</div>

          <div className="mt-2 text-[42px] font-extrabold leading-none text-slate-900">
            {value}
          </div>

          {subtitle && (
            <div className="mt-1 text-[13px] text-slate-500">
              {subtitle}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#0F9D94]">
            {icon}
          </div>

          {emoji ? <span className="text-[36px]">{emoji}</span> : null}
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className={STYLES.sectionTitleWrap}>
      <h2 className={STYLES.sectionTitle}>{title}</h2>
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
    <div className={STYLES.chartCard}>
      <div className="mb-5 flex justify-start">
        <h3 className="text-[24px] font-extrabold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function TopicsCard({
  title,
  subtitle,
  tone,
  items,
  emptyText,
  icon,
}: {
  title: string
  subtitle: string
  tone: 'positive' | 'negative'
  items: TopicItem[]
  emptyText: string
  icon: React.ReactNode
}) {
  const toneClasses =
    tone === 'positive'
      ? 'border-emerald-200 bg-emerald-50/30'
      : 'border-rose-200 bg-rose-50/30'

  return (
    <div className={`${STYLES.chartCard} ${toneClasses}`}>
      <div className="mb-5 text-right">
        <div className="flex items-center justify-start gap-2">
          <span className="text-slate-400">{icon}</span>
          <h3 className="text-[22px] font-extrabold text-slate-900">
            {title}
          </h3>
        </div>

        <p className="mt-1 text-[14px] text-slate-500">
          {subtitle}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex h-[240px] items-center justify-center rounded-[14px] border border-dashed border-slate-200 bg-slate-50 text-center">
          <p className="max-w-[420px] text-[15px] leading-7 text-slate-500">
            {emptyText}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <span className="text-[14px] font-bold text-slate-900">
                {item.count}
              </span>
              <span className="text-[14px] text-slate-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DemographicsCard({
  demographics,
}: {
  demographics: DashboardDemographics
}) {
  const allEmpty =
    demographics.topLanguages.length === 0 &&
    demographics.topCountries.length === 0 &&
    demographics.customerTypes.length === 0

  return (
    <div className={STYLES.chartCard}>
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-start gap-2">
        <TrendingUp className="h-5 w-5 text-slate-400" />
        <h3 className="text-[22px] font-extrabold text-slate-900">
          الديموغرافيا
        </h3>
      </div>

      {/* CONTENT */}
      {allEmpty ? (
        <div className="flex h-[240px] items-center justify-center rounded-[14px] border border-dashed border-slate-200 bg-slate-50">
          <p className="text-[15px] text-slate-500">
            لا توجد بيانات ديموغرافية بعد.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <DemographicGroup title="اللغات" items={demographics.topLanguages} />
          <DemographicGroup title="الدول" items={demographics.topCountries} />
          <DemographicGroup title="أنواع العملاء" items={demographics.customerTypes} />
        </div>
      )}
    </div>
  )
}

function DemographicGroup({
  title,
  items,
}: {
  title: string
  items: TopicItem[]
}) {
  return (
    <div>
      <h4 className="mb-3 text-right text-[15px] font-bold text-slate-700">{title}</h4>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-[14px] text-slate-400">
          لا توجد بيانات
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <span className="text-[14px] font-bold text-slate-900">
                {item.count}
              </span>
              <span className="text-[14px] text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyLineChart({ yLabels }: { yLabels: string[] }) {
  return (
    <div className="relative h-[240px] rounded-[14px] border border-slate-100 bg-white">
      <div className="absolute inset-0 px-12 py-6">
        <div className="flex h-full flex-col justify-between">
          {yLabels.map((label) => (
            <div key={label} className="relative flex items-center">
              <span className="absolute right-[-38px] text-[11px] text-slate-400">
                {label}
              </span>
              <div className="h-px w-full border-t border-dashed border-slate-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-12 right-12 h-px bg-slate-300" />
      <div className="absolute bottom-6 right-12 top-6 w-px bg-slate-300" />
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
            <div
              key={i}
              className="border-r border-dashed border-slate-200 last:border-r-0"
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-12 right-12 h-px bg-slate-300" />
      <div className="absolute bottom-6 right-12 top-6 w-px bg-slate-300" />
    </div>
  )
}

function getDominantSentimentPercent(sentiment: DashboardSummary['sentiment']) {
  const total = sentiment.positive + sentiment.neutral + sentiment.negative
  if (total === 0) return 50

  const maxValue = Math.max(sentiment.positive, sentiment.neutral, sentiment.negative)
  return Math.round((maxValue / total) * 100)
}

function getSentimentLabel(sentiment: DashboardSummary['sentiment']) {
  const { positive, neutral, negative } = sentiment

  if (positive === 0 && neutral === 0 && negative === 0) return 'محايد'
  if (positive >= neutral && positive >= negative) return 'إيجابي'
  if (negative >= positive && negative >= neutral) return 'سلبي'
  return 'محايد'
}