import { useEffect, useRef, useState } from 'react'
import { Activity, BarChart3, FileText, TriangleAlert } from 'lucide-react'

type AnalyticsPoint = {
  id: string
  title: string
  description: string
  icon: typeof Activity
}

const CONTENT = {
  analytics: {
    badge: 'رؤى وتحليلات',
    sectionTitle: 'سمعتك في نظرة واحدة',
    sectionSubtitle:
      'تابع الأداء، اكتشف الاتجاهات، واتخذ قرارات مبنية على بيانات — كل شي من لوحة تحكم واحدة.',
    points: [
      {
        id: 'health-score',
        title: 'مؤشر الصحة',
        description:
          'رقم واحد يختصر لك بالضبط كيف حال نشاطك التجاري على جوجل — من 0 إلى 100.',
        icon: Activity,
      },
      {
        id: 'trends',
        title: 'الاتجاهات والأنماط',
        description:
          'شوف كيف تتغير تقييماتك ومشاعر العملاء وحجم التقييمات مع الوقت برسوم بيانية واضحة.',
        icon: BarChart3,
      },
      {
        id: 'complaints',
        title: 'تحليل الشكاوى الذكي',
        description:
          'الذكاء الاصطناعي يحدد المواضيع المتكررة في التقييمات السلبية عشان تعرف بالضبط إيش تصلح أولًا.',
        icon: TriangleAlert,
      },
      {
        id: 'pdf-reports',
        title: 'تقارير PDF',
        description:
          'حمّل تقارير احترافية تشاركها مع فريقك أو أصحاب القرار.',
        icon: FileText,
      },
    ] satisfies AnalyticsPoint[],
  },
} as const

const STYLES = {
  analytics: {
    wrapper: 'bg-[#f8fafc]',
    container: 'pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20',
    layout:
      'mx-auto mt-8 grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12',
    reveal: {
      base: 'transition-all duration-700 ease-out',
      rightHidden: 'translate-x-10 opacity-0',
      leftHidden: '-translate-x-10 opacity-0',
      visible: 'translate-x-0 opacity-100',
    },

    badge:
      'inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-teal-700 sm:text-sm',
    badgeIcon: 'ml-2 h-4 w-4',

    textWrap: 'text-right',
    dashboardWrap: '',

    title:
      'mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem]',
    subtitle:
      'mt-3 max-w-xl text-[17px] leading-8 text-slate-600 sm:text-[18px]',

    pointsList: 'mt-6 space-y-4',
    pointRow: 'flex items-start gap-2.5',
    pointIconWrap:
      'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600',
    pointIcon: 'h-4 w-4',
    pointTitle: 'text-[1.05rem] font-bold text-slate-900',
    pointDescription: 'mt-1 text-[15px] leading-7 text-slate-600',

    dashboardOuter:
      'relative mx-auto w-full max-w-[400px] sm:max-w-[430px] lg:max-w-[470px] min-h-[300px]',
    dashboardShadow:
      'absolute inset-x-6 bottom-[-18px] h-14 rounded-full bg-teal-100/70 blur-2xl',
    dashboardCard:
      'relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]',

    dashboardTopBar:
      'flex items-center justify-between border-b border-slate-200 bg-[#f4f8f8] px-3 py-2 sm:px-3.5 sm:py-2.5',
    dashboardTopTabs: 'flex items-center gap-2',
    dashboardTopTitle:
      'flex items-center gap-1.5 text-xs font-bold text-slate-800 sm:text-sm',
    statusDot: 'h-2.5 w-2.5 rounded-full bg-emerald-500',

    periodPillBase:
      'rounded-md px-2 py-1 text-[10px] font-medium leading-none sm:px-2.5 sm:text-[11px]',
    periodPillMuted: 'bg-transparent text-slate-400',
    periodPillActive: 'bg-emerald-100 text-teal-700',

    dashboardBody: 'p-4 text-right sm:p-4.5',
    dashboardHero: 'flex items-center justify-between',
    dashboardHeroText:
      'flex w-full flex-col items-end text-right leading-none',

    scoreRingWrap:
      'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14',
    scoreRing: 'absolute inset-0 rounded-full',
    scoreRingCenter: 'absolute inset-[5px] rounded-full bg-white sm:inset-[6px]',
    scoreValue:
      'relative z-10 text-sm font-bold text-slate-900 sm:text-lg',
    scoreGroup: 'flex items-center justify-end gap-2',

    dashboardHeroTitle: 'text-sm font-bold text-slate-900 sm:text-base',
    dashboardHeroSub:
      'mt-0.5 w-full text-right text-[11px] font-bold text-emerald-600 sm:text-xs',

    statsGrid: 'mt-4 grid grid-cols-3 gap-2',
    statCard:
      'rounded-xl bg-[#f5f7f9] px-2 py-2.5 text-center sm:px-2.5 sm:py-3',
    statValue: 'text-base font-bold text-slate-900 sm:text-xl',
    statLabel: 'mt-0.5 text-[9px] text-slate-500 sm:text-[10px]',
    statTrend: 'mt-0.5 text-[9px] font-bold text-emerald-600 sm:text-[10px]',

    chartCard: 'mt-4 rounded-xl bg-[#f5f7f9] px-5 py-3',
    chartTitle: 'text-right text-[11px] font-bold text-slate-500 sm:text-xs',
    chartBars:
      'mt-2 flex h-12 flex-row-reverse items-end justify-between gap-1',
    chartBar:
      'flex-1 rounded-t-md bg-gradient-to-t from-[#40c9b3] to-[#5fd6c3]',
  },
} as const

const MOTION = {
  sectionThreshold: 0.2,
} as const

const ANALYTICS_DASHBOARD = {
  periods: ['7 أيام', '30 يوم', '90 يوم'],
  score: 75,
  scoreLabel: 'مؤشر الصحة',
  scoreStatus: 'جيد',
  stats: [
    { id: 'reviews', value: '24', label: 'تقييمات', trend: '+12%' },
    { id: 'rating', value: '4.5', label: 'متوسط التقييم', trend: '+0.3' },
    { id: 'sentiment', value: '82%', label: 'المشاعر', trend: '+5%' },
  ],
  bars: [28, 33, 25, 30, 27, 32, 23, 29, 20, 25, 18, 23],
} as const

function useRevealOnScroll() {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: MOTION.sectionThreshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isVisible])

  return { ref, isVisible }
}

function AnalyticsPointItem({ point }: { point: AnalyticsPoint }) {
  const Icon = point.icon

  return (
    <div className={STYLES.analytics.pointRow}>
      <div className={STYLES.analytics.pointIconWrap}>
        <Icon className={STYLES.analytics.pointIcon} />
      </div>

      <div>
        <h3 className={STYLES.analytics.pointTitle}>{point.title}</h3>
        <p className={STYLES.analytics.pointDescription}>{point.description}</p>
      </div>
    </div>
  )
}

function AnalyticsDashboard() {
  return (
    <div className={STYLES.analytics.dashboardOuter}>
      <div className={STYLES.analytics.dashboardShadow} />

      <div className={STYLES.analytics.dashboardCard}>
        <div className={STYLES.analytics.dashboardTopBar}>
          <div className={STYLES.analytics.dashboardTopTitle}>
            <span className={STYLES.analytics.statusDot} />
            لوحة التحكم
          </div>

          <div className={STYLES.analytics.dashboardTopTabs}>
            <span
              className={`${STYLES.analytics.periodPillBase} ${STYLES.analytics.periodPillActive}`}
            >
              {ANALYTICS_DASHBOARD.periods[0]}
            </span>
            <span
              className={`${STYLES.analytics.periodPillBase} ${STYLES.analytics.periodPillMuted}`}
            >
              {ANALYTICS_DASHBOARD.periods[1]}
            </span>
            <span
              className={`${STYLES.analytics.periodPillBase} ${STYLES.analytics.periodPillMuted}`}
            >
              {ANALYTICS_DASHBOARD.periods[2]}
            </span>
          </div>
        </div>

        <div className={STYLES.analytics.dashboardBody}>
          <div className={STYLES.analytics.dashboardHero}>
            <div className={STYLES.analytics.scoreGroup}>
              <div className={STYLES.analytics.scoreRingWrap}>
                <div
                  className={STYLES.analytics.scoreRing}
                  style={{
                    background: `conic-gradient(#10b981 ${
                      ANALYTICS_DASHBOARD.score * 3.6
                    }deg, #e5eef0 0deg)`,
                  }}
                />
                <div className={STYLES.analytics.scoreRingCenter} />
                <span className={STYLES.analytics.scoreValue}>
                  {ANALYTICS_DASHBOARD.score}
                </span>
              </div>

              <div className={STYLES.analytics.dashboardHeroText}>
                <p className={STYLES.analytics.dashboardHeroTitle}>
                  {ANALYTICS_DASHBOARD.scoreLabel}
                </p>
                <p className={STYLES.analytics.dashboardHeroSub}>
                  {ANALYTICS_DASHBOARD.scoreStatus}
                </p>
              </div>
            </div>
          </div>

          <div className={STYLES.analytics.statsGrid}>
            {ANALYTICS_DASHBOARD.stats.map((stat) => (
              <div key={stat.id} className={STYLES.analytics.statCard}>
                <div className={STYLES.analytics.statValue}>{stat.value}</div>
                <div className={STYLES.analytics.statLabel}>{stat.label}</div>
                <div className={STYLES.analytics.statTrend}>{stat.trend}</div>
              </div>
            ))}
          </div>

          <div className={STYLES.analytics.chartCard}>
            <div className={STYLES.analytics.chartTitle}>اتجاه التقييمات</div>

            <div className={STYLES.analytics.chartBars}>
              {ANALYTICS_DASHBOARD.bars.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className={STYLES.analytics.chartBar}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsSection() {
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section ref={ref} dir="rtl" className={STYLES.analytics.wrapper}>
      <div
        className={`${STYLES.analytics.container} mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`}
      >
        <div className={STYLES.analytics.layout}>
          <div
            className={[
              STYLES.analytics.textWrap,
              STYLES.analytics.reveal.base,
              isVisible
                ? STYLES.analytics.reveal.visible
                : STYLES.analytics.reveal.rightHidden,
            ].join(' ')}
          >
            <div className={STYLES.analytics.badge}>
              <BarChart3 className={STYLES.analytics.badgeIcon} />
              {CONTENT.analytics.badge}
            </div>

            <h2 className={STYLES.analytics.title}>
              {CONTENT.analytics.sectionTitle}
            </h2>

            <p className={STYLES.analytics.subtitle}>
              {CONTENT.analytics.sectionSubtitle}
            </p>

            <div className={STYLES.analytics.pointsList}>
              {CONTENT.analytics.points.map((point) => (
                <AnalyticsPointItem key={point.id} point={point} />
              ))}
            </div>
          </div>

          <div
            className={[
              STYLES.analytics.dashboardWrap,
              STYLES.analytics.reveal.base,
              isVisible
                ? STYLES.analytics.reveal.visible
                : STYLES.analytics.reveal.leftHidden,
            ].join(' ')}
          >
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </section>
  )
}