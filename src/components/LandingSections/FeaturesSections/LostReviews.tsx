import { useEffect, useState } from 'react'
import { BellOff, TrendingDown, Wallet } from 'lucide-react'
import { useLocale } from '../../../contexts/LocaleContext'

const CARD_STYLES = [
  { iconColor: 'text-rose-500', iconBg: 'bg-rose-50', highlightTextColor: 'text-rose-500', highlightBg: 'bg-rose-50', icon: BellOff },
  { iconColor: 'text-amber-600', iconBg: 'bg-amber-50', highlightTextColor: 'text-amber-600', highlightBg: 'bg-amber-50', icon: TrendingDown },
  { iconColor: 'text-pink-600', iconBg: 'bg-pink-50', highlightTextColor: 'text-pink-600', highlightBg: 'bg-pink-50', icon: Wallet },
] as const

const STYLES = {
  shared: {
    container: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionHeader: 'mx-auto max-w-2xl text-center',
    sectionTitle: 'text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem]',
    sectionSubtitle: 'mt-2 text-sm leading-7 text-slate-500 sm:text-base',
  },
  lostReviews: {
    wrapper: 'bg-[#f8fafc]',
    container: 'py-16 sm:py-20 lg:py-24',
    grid: 'mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
    card: {
      base: 'group rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300',
      hover: 'hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]',
      entrance: 'transition-all duration-500 ease-out',
      hidden: 'translate-x-6 opacity-0',
      visible: 'translate-x-0 opacity-100',
    },
    icon: {
      wrapper: 'mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
      icon: 'h-7 w-7 transition-transform duration-300 group-hover:scale-110',
    },
    text: {
      title: 'text-xl font-bold text-slate-900',
      description: 'mt-4 text-[15px] leading-8 text-slate-500',
      highlight: 'mt-6 rounded-2xl px-4 py-3 text-center text-base font-bold',
    },
  },
} as const

const MOTION = { staggerMs: 120 } as const

export default function LostReviewsSection() {
  const { t, dir } = useLocale()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section dir={dir} className={STYLES.lostReviews.wrapper}>
      <div className={`${STYLES.shared.container} ${STYLES.lostReviews.container}`}>
        <div className={STYLES.shared.sectionHeader}>
          <h2 className={STYLES.shared.sectionTitle}>{t.features.lostReviews.sectionTitle}</h2>
          <p className={STYLES.shared.sectionSubtitle}>{t.features.lostReviews.sectionSubtitle}</p>
        </div>

        <div className={STYLES.lostReviews.grid}>
          {t.features.lostReviews.cards.map((card, index) => {
            const style = CARD_STYLES[index]
            const Icon = style.icon
            return (
              <article
                key={card.id}
                className={[
                  STYLES.lostReviews.card.base,
                  STYLES.lostReviews.card.hover,
                  STYLES.lostReviews.card.entrance,
                  isVisible ? STYLES.lostReviews.card.visible : STYLES.lostReviews.card.hidden,
                ].join(' ')}
                style={{ transitionDelay: `${index * MOTION.staggerMs}ms` }}
              >
                <div className={`${STYLES.lostReviews.icon.wrapper} ${style.iconBg}`}>
                  <Icon className={`${STYLES.lostReviews.icon.icon} ${style.iconColor}`} />
                </div>
                <h3 className={STYLES.lostReviews.text.title}>{card.title}</h3>
                <p className={STYLES.lostReviews.text.description}>{card.description}</p>
                <div className={`${STYLES.lostReviews.text.highlight} ${style.highlightBg} ${style.highlightTextColor}`}>
                  {card.highlight}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
