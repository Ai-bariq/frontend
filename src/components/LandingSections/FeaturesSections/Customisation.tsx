import { useEffect, useRef, useState } from 'react'
import { Clock3, MessageSquareMore, PenLine, SlidersHorizontal } from 'lucide-react'
import avatar from '../../../assets/avatar.png'
import { useLocale } from '../../../contexts/LocaleContext'

const POINT_ICONS = [MessageSquareMore, PenLine, SlidersHorizontal, Clock3]

const STYLES = {
  customization: {
    wrapper: 'bg-[#f8fafc]',
    container: 'py-16 sm:py-20 lg:py-24',
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
    profileRow: 'flex items-center justify-start border-b border-slate-200 pb-4',
    profileGroup: 'flex items-center gap-3',
    profileTextWrap: 'text-right',
    avatarWrap: 'flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-teal-200 bg-white',
    avatarImage: 'h-full w-full rounded-full object-cover',
    profileName: 'text-sm font-bold text-slate-900',
    profileStatusRow: 'mt-0.5 flex items-center justify-end gap-1.5',
    profileStatusDot: 'h-2 w-2 rounded-full bg-emerald-500',
    profileStatusText: 'text-[10px] font-medium text-slate-500',
    fieldGroup: 'mt-4',
    fieldLabel: 'mb-2 block text-[11px] font-bold text-slate-500',
    segmentedControl: 'grid grid-cols-3 gap-2',
    segmentedButtonBase: 'rounded-xl px-3 py-2 text-[11px] font-bold transition-colors',
    segmentedButtonMuted: 'bg-slate-100 text-slate-500',
    segmentedButtonActive: 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-[0_8px_20px_rgba(13,148,136,0.18)]',
    textarea: 'min-h-[30px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] leading-5 text-slate-500 outline-none placeholder:text-slate-400',
    settingsList: 'mt-4 space-y-3',
    settingRow: 'grid grid-cols-[1fr_auto] items-center gap-3',
    settingBadge: 'justify-self-start rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-teal-700',
    settingLabel: 'text-right text-[11px] font-medium text-slate-500',
    signatureCard: 'mt-4 rounded-xl border border-teal-100 bg-gradient-to-br from-[#edf9f6] to-[#e8f6f3] px-4 py-3',
    signatureTitle: 'text-[11px] font-bold text-teal-700',
    signatureLine: 'mt-1 text-[11px] text-slate-500',
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

export default function CustomizationSection() {
  const { t, dir, isRTL } = useLocale()
  const { ref, isVisible } = useRevealOnScroll()

  const textAlign = isRTL ? 'text-right' : 'text-left'
  const dash = t.features.customization.dashboard

  const layoutDir = isRTL ? '[direction:rtl]' : '[direction:ltr]'
  const textCol = isRTL ? STYLES.customization.reveal.rightHidden : STYLES.customization.reveal.leftHidden
  const dashCol = isRTL ? STYLES.customization.reveal.leftHidden : STYLES.customization.reveal.rightHidden

  return (
    <section ref={ref} dir={dir} className={STYLES.customization.wrapper}>
      <div className={`${STYLES.customization.container} mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`}>
        <div className={`mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${layoutDir}`}>
          <div className={[textAlign, STYLES.customization.reveal.base, isVisible ? STYLES.customization.reveal.visible : textCol].join(' ')}>
            <div className={STYLES.customization.badge}>
              <SlidersHorizontal className={STYLES.customization.badgeIcon} />
              {t.features.customization.badge}
            </div>
            <h2 className={STYLES.customization.title}>{t.features.customization.sectionTitle}</h2>
            <p className={STYLES.customization.subtitle}>{t.features.customization.sectionSubtitle}</p>
            <div className={STYLES.customization.pointsList}>
              {t.features.customization.points.map((point, i) => {
                const Icon = POINT_ICONS[i]
                return (
                  <div key={point.id} className={STYLES.customization.pointRow}>
                    <div className={STYLES.customization.pointIconWrap}>
                      <Icon className={STYLES.customization.pointIcon} />
                    </div>
                    <div>
                      <h3 className={STYLES.customization.pointTitle}>{point.title}</h3>
                      <p className={STYLES.customization.pointDescription}>{point.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={[STYLES.customization.reveal.base, isVisible ? STYLES.customization.reveal.visible : dashCol].join(' ')}>
            <div className={STYLES.customization.dashboardOuter}>
              <div className={STYLES.customization.dashboardShadow} />
              <div className={STYLES.customization.dashboardCard}>
                <div className={STYLES.customization.dashboardTopBar}>
                  <div className={STYLES.customization.topBarGroup}>
                    <SlidersHorizontal className={STYLES.customization.dashboardTopAction} />
                    <div className={STYLES.customization.dashboardTopTitle}>{dash.title}</div>
                  </div>
                </div>

                <div className={STYLES.customization.dashboardBody}>
                  <div className={STYLES.customization.profileRow}>
                    <div className={STYLES.customization.profileGroup}>
                      <div className={STYLES.customization.avatarWrap}>
                        <img src={avatar} alt="avatar" className={STYLES.customization.avatarImage} />
                      </div>
                      <div className={STYLES.customization.profileTextWrap}>
                        <div className={STYLES.customization.profileName}>{dash.agentName}</div>
                        <div className={STYLES.customization.profileStatusRow}>
                          <span className={STYLES.customization.profileStatusDot} />
                          <span className={STYLES.customization.profileStatusText}>{dash.agentStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={STYLES.customization.fieldGroup}>
                    <label className={STYLES.customization.fieldLabel}>{dash.toneLabel}</label>
                    <div className={STYLES.customization.segmentedControl}>
                      {dash.toneOptions.map((opt, i) => (
                        <button key={opt} type="button" className={`${STYLES.customization.segmentedButtonBase} ${i === 0 ? STYLES.customization.segmentedButtonActive : STYLES.customization.segmentedButtonMuted}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={STYLES.customization.fieldGroup}>
                    <label className={STYLES.customization.fieldLabel}>{dash.instructionsLabel}</label>
                    <textarea className={STYLES.customization.textarea} defaultValue={dash.instructionsPlaceholder} />
                  </div>

                  <div className={STYLES.customization.settingsList}>
                    <div className={STYLES.customization.settingRow}>
                      <span className={STYLES.customization.settingLabel}>{dash.emojiLabel}</span>
                      <span className={STYLES.customization.settingBadge}>{dash.emojiValue}</span>
                    </div>
                    <div className={STYLES.customization.settingRow}>
                      <span className={STYLES.customization.settingLabel}>{dash.lengthLabel}</span>
                      <span className={STYLES.customization.settingBadge}>{dash.lengthValue}</span>
                    </div>
                    <div className={STYLES.customization.settingRow}>
                      <span className={STYLES.customization.settingLabel}>{dash.timingLabel}</span>
                      <span className={STYLES.customization.settingBadge}>30-60 min</span>
                    </div>
                  </div>

                  <div className={STYLES.customization.signatureCard}>
                    <div className={STYLES.customization.signatureTitle}>{dash.signatureTitle}</div>
                    <div className={STYLES.customization.signatureLine}>{dash.signatureTeam}</div>
                    <div className={STYLES.customization.signatureLine}>966+ XXX XXXX</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
