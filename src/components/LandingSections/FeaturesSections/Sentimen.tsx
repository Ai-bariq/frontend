import { useEffect, useRef, useState } from 'react'
import { BrainCircuit, Tags, Target } from 'lucide-react'
import { useLocale } from '../../../contexts/LocaleContext'

const POINT_ICONS = [BrainCircuit, Tags, Target]

const TOPIC_CHIP_CLASSES: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-600',
  negative: 'bg-rose-50 text-rose-500',
  neutral: 'bg-teal-50 text-teal-600',
  warning: 'bg-amber-50 text-amber-600',
}

const STYLES = {
  sentiment: {
    wrapper: 'bg-white',
    container: 'py-16 sm:py-20 lg:py-20',
    layout: 'mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16',
    reveal: {
      base: 'transition-all duration-700 ease-out',
      leftHidden: '-translate-x-10 opacity-0',
      rightHidden: 'translate-x-10 opacity-0',
      visible: 'translate-x-0 opacity-100',
    },
    badge: 'inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-teal-700 sm:text-sm',
    badgeIcon: 'ml-2 h-4 w-4',
    title: 'mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.85rem]',
    subtitle: 'mt-3 max-w-xl text-[17px] leading-8 text-slate-600 sm:text-[18px]',
    pointsList: 'mt-8 space-y-5',
    pointRow: 'flex items-start gap-3',
    pointIconWrap: 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600',
    pointIcon: 'h-4 w-4',
    pointTitle: 'text-[1.05rem] font-bold text-slate-900',
    pointDescription: 'mt-1 text-[15px] leading-7 text-slate-600',
    dashboardOuter: 'relative mx-auto w-full max-w-[360px] sm:max-w-[390px] lg:max-w-[430px]',
    dashboardShadow: 'absolute inset-x-6 bottom-[-18px] h-14 rounded-full bg-teal-100/70 blur-2xl',
    dashboardCard: 'relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]',
    dashboardTopBar: 'flex items-center justify-start border-b border-slate-200 bg-[#f4f8f8] px-3 py-2 sm:px-3.5 sm:py-2.5',
    topBarGroup: 'flex items-center gap-2',
    dashboardTopTitle: 'flex items-center gap-1.5 text-xs font-bold text-slate-800 sm:text-sm',
    dashboardTopAction: 'h-4 w-4 text-teal-600',
    dashboardBody: 'p-4 sm:p-4.5',
    sentimentHeader: 'flex items-start justify-between gap-4',
    donutWrap: 'relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full sm:h-[72px] sm:w-[72px]',
    donutCenter: 'absolute inset-[8px] rounded-full bg-white',
    donutValue: 'relative z-10 text-[17px] font-bold text-slate-900',
    donutLabel: 'mt-0.5 text-[9px] font-bold text-emerald-600',
    donutRing: 'absolute inset-0 rounded-full',
    legend: 'space-y-1.5 text-[11px] text-slate-500',
    legendRow: 'flex items-center justify-end gap-2',
    legendDot: 'h-2.5 w-2.5 rounded-full',
    topicsWrap: 'mt-5',
    topicsTitle: 'text-[11px] font-bold text-slate-500',
    topicsGrid: 'mt-3 flex flex-wrap justify-start gap-2',
    topicChip: 'rounded-full px-3 py-1.5 text-[12px] font-bold',
    chartCard: 'mt-4 rounded-xl bg-[#f5f7f9] px-3 py-3.5',
    chartTitle: 'text-[11px] font-bold text-slate-500',
    lineChartWrap: 'mt-3 h-12 rounded-lg px-3 py-2.5',
    lineChartSvg: 'h-full w-full',
  },
} as const

const MOTION = { sectionThreshold: 0.2 } as const

function useRevealOnScroll() {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element || isVisible) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } },
      { threshold: MOTION.sectionThreshold }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [isVisible])
  return { ref, isVisible }
}

export default function SentimentSection() {
  const { t, dir, isRTL } = useLocale()
  const { ref, isVisible } = useRevealOnScroll()

  const textAlign = isRTL ? 'text-right' : 'text-left'
  const dash = t.features.sentiment.dashboard

  const dashCol = isRTL ? STYLES.sentiment.reveal.rightHidden : STYLES.sentiment.reveal.leftHidden
  const textCol = isRTL ? STYLES.sentiment.reveal.leftHidden : STYLES.sentiment.reveal.rightHidden

  return (
    <section ref={ref} dir={dir} className={STYLES.sentiment.wrapper}>
      <div className={`${STYLES.sentiment.container} mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`}>
        <div className={STYLES.sentiment.layout}>
          <div className={[STYLES.sentiment.reveal.base, isVisible ? STYLES.sentiment.reveal.visible : dashCol].join(' ')}>
            <div className={STYLES.sentiment.dashboardOuter}>
              <div className={STYLES.sentiment.dashboardShadow} />
              <div className={STYLES.sentiment.dashboardCard}>
                <div className={STYLES.sentiment.dashboardTopBar}>
                  <div className={STYLES.sentiment.topBarGroup}>
                    <BrainCircuit className={STYLES.sentiment.dashboardTopAction} />
                    <div className={STYLES.sentiment.dashboardTopTitle}>{dash.title}</div>
                  </div>
                </div>

                <div className={STYLES.sentiment.dashboardBody}>
                  <div className={STYLES.sentiment.sentimentHeader}>
                    <div className="flex items-center gap-3">
                      <div className={STYLES.sentiment.donutWrap}>
                        <div className={STYLES.sentiment.donutRing} style={{ background: 'conic-gradient(#10b981 0deg 234deg, #f59e0b 234deg 306deg, #fb7185 306deg 360deg)' }} />
                        <div className={STYLES.sentiment.donutCenter} />
                        <div className="relative z-10 flex flex-col items-center">
                          <span className={STYLES.sentiment.donutValue}>82%</span>
                          <span className={STYLES.sentiment.donutLabel}>{dash.positive}</span>
                        </div>
                      </div>

                      <div className={STYLES.sentiment.legend}>
                        <div className={STYLES.sentiment.legendRow}>
                          <span className={`${STYLES.sentiment.legendDot} bg-emerald-500`} />
                          <span>65% — {dash.positive}</span>
                        </div>
                        <div className={STYLES.sentiment.legendRow}>
                          <span className={`${STYLES.sentiment.legendDot} bg-amber-500`} />
                          <span>20% — {dash.neutral}</span>
                        </div>
                        <div className={STYLES.sentiment.legendRow}>
                          <span className={`${STYLES.sentiment.legendDot} bg-rose-400`} />
                          <span>15% — {dash.negative}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={STYLES.sentiment.topicsWrap}>
                    <div className={STYLES.sentiment.topicsTitle}>{dash.topicsTitle}</div>
                    <div className={STYLES.sentiment.topicsGrid}>
                      {dash.topics.map((topic) => (
                        <span key={topic.label} className={`${STYLES.sentiment.topicChip} ${TOPIC_CHIP_CLASSES[topic.variant]}`}>
                          {topic.label} {topic.value}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={STYLES.sentiment.chartCard}>
                    <div className={`${STYLES.sentiment.chartTitle} ${textAlign}`}>{dash.chartTitle}</div>
                    <div className={STYLES.sentiment.lineChartWrap}>
                      <svg viewBox="0 0 220 36" preserveAspectRatio="none" className={STYLES.sentiment.lineChartSvg} aria-hidden="true">
                        <path d="M8 26 C 34 26, 46 24, 64 24 S 98 20, 118 20 S 150 14, 172 16 S 198 10, 212 12" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="212" cy="12" r="2" fill="#10b981" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={[textAlign, STYLES.sentiment.reveal.base, isVisible ? STYLES.sentiment.reveal.visible : textCol].join(' ')}>
            <div className={STYLES.sentiment.badge}>
              <BrainCircuit className={STYLES.sentiment.badgeIcon} />
              {t.features.sentiment.badge}
            </div>
            <h2 className={STYLES.sentiment.title}>{t.features.sentiment.sectionTitle}</h2>
            <p className={STYLES.sentiment.subtitle}>{t.features.sentiment.sectionSubtitle}</p>
            <div className={STYLES.sentiment.pointsList}>
              {t.features.sentiment.points.map((point, i) => {
                const Icon = POINT_ICONS[i]
                return (
                  <div key={point.id} className={STYLES.sentiment.pointRow}>
                    <div className={STYLES.sentiment.pointIconWrap}>
                      <Icon className={STYLES.sentiment.pointIcon} />
                    </div>
                    <div>
                      <h3 className={STYLES.sentiment.pointTitle}>{point.title}</h3>
                      <p className={STYLES.sentiment.pointDescription}>{point.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
