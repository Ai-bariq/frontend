import { useEffect, useState } from 'react'
import { BellOff, TrendingDown, Wallet } from 'lucide-react'

type FeatureCard = {
  id: string
  title: string
  description: string
  highlight: string
  icon: typeof BellOff
  iconColor: string
  iconBg: string
  highlightTextColor: string
  highlightBg: string
}

const CONTENT = {
  lostReviews: {
    sectionTitle: 'التقييمات بدون رد فرص ضائعة',
    sectionSubtitle:
      '93% من العملاء يقرؤون التقييمات قبل ما يتجاوزون. كل تقييم بدون رد = فرصة ضائعة.',
    cards: [
      {
        id: 'no-replies',
        title: 'تقييمات بدون أي رد',
        description:
          'أغلب الأعمال تترك التقييمات بدون رد. العملاء يشوفون هالشي — ويروحون للمنافس اللي يرد. جوجل يكافئ الأعمال النشطة بترتيب أعلى.',
        highlight: '93% يقرؤون التقييمات أولًا',
        icon: BellOff,
        iconColor: 'text-rose-500',
        iconBg: 'bg-rose-50',
        highlightTextColor: 'text-rose-500',
        highlightBg: 'bg-rose-50',
      },
      {
        id: 'lower-ranking',
        title: 'ترتيبك في جوجل ينزل',
        description:
          'جوجل يعطي أولوية للأعمال اللي ترد باستمرار — حتى على تقييمات النجمة الواحدة. بدون ردود = ظهور أقل وعملاء أقل لمنافسيك.',
        highlight: 'ترتيب أقل = عملاء أقل',
        icon: TrendingDown,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50',
        highlightTextColor: 'text-amber-600',
        highlightBg: 'bg-amber-50',
      },
      {
        id: 'expensive-agencies',
        title: 'الوكالات غالية وغير منتظمة',
        description:
          'توظيف وكالة يكلّف 1,000–3,000 ريال شهريًا — وبرضو يوقفون تقييمات، بدون متابعة أو يستخدمون ردود نسخ-لصق عامة ما فيها روح.',
        highlight: '1,000–3,000 ريال شهريًا',
        icon: Wallet,
        iconColor: 'text-pink-600',
        iconBg: 'bg-pink-50',
        highlightTextColor: 'text-pink-600',
        highlightBg: 'bg-pink-50',
      },
    ] satisfies FeatureCard[],
  },
} as const

const STYLES = {
  shared: {
    container: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionHeader: 'mx-auto max-w-2xl text-center',
    sectionTitle:
      'text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem]',
    sectionSubtitle: 'mt-2 text-sm leading-7 text-slate-500 sm:text-base',
  },

  lostReviews: {
    wrapper: 'bg-[#f8fafc]',
    container: 'py-16 sm:py-20 lg:py-24',
    grid:
      'mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
    card: {
      base:
        'group rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300',
      hover:
        'hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)]',
      entrance: 'transition-all duration-500 ease-out',
      hidden: 'translate-x-6 opacity-0',
      visible: 'translate-x-0 opacity-100',
    },
    icon: {
      wrapper:
        'mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
      icon:
        'h-7 w-7 transition-transform duration-300 group-hover:scale-110',
    },
    text: {
      title: 'text-xl font-bold text-slate-900',
      description: 'mt-4 text-[15px] leading-8 text-slate-500',
      highlight:
        'mt-6 rounded-2xl px-4 py-3 text-center text-base font-bold',
    },
  },
} as const

const MOTION = {
  staggerMs: 120,
} as const

function LostReviewsCard({
  card,
  isVisible,
  delay,
}: {
  card: FeatureCard
  isVisible: boolean
  delay: number
}) {
  const Icon = card.icon

  return (
    <article
      className={[
        STYLES.lostReviews.card.base,
        STYLES.lostReviews.card.hover,
        STYLES.lostReviews.card.entrance,
        isVisible
          ? STYLES.lostReviews.card.visible
          : STYLES.lostReviews.card.hidden,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`${STYLES.lostReviews.icon.wrapper} ${card.iconBg}`}>
        <Icon className={`${STYLES.lostReviews.icon.icon} ${card.iconColor}`} />
      </div>

      <h3 className={STYLES.lostReviews.text.title}>{card.title}</h3>
      <p className={STYLES.lostReviews.text.description}>{card.description}</p>

      <div
        className={`${STYLES.lostReviews.text.highlight} ${card.highlightBg} ${card.highlightTextColor}`}
      >
        {card.highlight}
      </div>
    </article>
  )
}

export default function LostReviewsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section dir="rtl" className={STYLES.lostReviews.wrapper}>
      <div className={`${STYLES.shared.container} ${STYLES.lostReviews.container}`}>
        <div className={STYLES.shared.sectionHeader}>
          <h2 className={STYLES.shared.sectionTitle}>
            {CONTENT.lostReviews.sectionTitle}
          </h2>
          <p className={STYLES.shared.sectionSubtitle}>
            {CONTENT.lostReviews.sectionSubtitle}
          </p>
        </div>

        <div className={STYLES.lostReviews.grid}>
          {CONTENT.lostReviews.cards.map((card, index) => (
            <LostReviewsCard
              key={card.id}
              card={card}
              isVisible={isVisible}
              delay={index * MOTION.staggerMs}
            />
          ))}
        </div>
      </div>
    </section>
  )
}