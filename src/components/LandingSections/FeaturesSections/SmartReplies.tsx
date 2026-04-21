import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  MapPinned,
  TrendingUp,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

type SmartReplyCard = {
  id: string
  title: string
  description: string
  icon: typeof MapPin
  iconColor: string
  iconBg: string
  size: 'large' | 'small'
}

const CONTENT = {
  smartReplies: {
    sectionTitle: 'نظام ذكي يرد على تقييماتك تلقائيًا',
    sectionSubtitle: 'ميزات مميزة فعلًا تفرق',
    ctaLabel: 'ابدأ الآن',
    cards: [
      {
        id: 'every-review',
        title: 'كل تقييم ياخذ رد',
        description:
          'ما تشيل هم تقييمات بدون رد. كل عميل يكتب تقييم ياخذ رد — تلقائيًا خلال ساعات. سمعتك محمية.',
        icon: MapPinned,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        size: 'large',
      },
      {
        id: 'saudi-tone',
        title: 'لهجة سعودية أصيلة، مو ترجمة جوجل',
        description:
          'ردودك طبيعية ودافئة وأصيلة فعلًا، زي ما يكتبها سعودي حقيقي. مو عربي رسمي العملاء يعرفون إنه آلي. يشعرون إنك تهتم فيهم لأنك تتكلم بطريقتهم.',
        icon: BriefcaseBusiness,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        size: 'large',
      },
      {
        id: 'all-branches',
        title: 'كل فروعك في مكان واحد',
        description:
          'يشوف تقييمات كل فروعك ويقدر يرد من مكان واحد. أضفت فرع جديد؟ ينشاف في أي وقت. سواء عندك مطعم واحد أو عشرة، كل شيء منظم.',
        icon: MapPin,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        size: 'small',
      },
      {
        id: 'runs-alone',
        title: 'يشتغل لوحده',
        description:
          'فعلناه مرة وبعدين يصير يشتغل. ما تحتاج تراجعه يوميًا أو تحدثيات. أنت ركز على مطعمك، احنا نتولى التقييمات.',
        icon: BriefcaseBusiness,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        size: 'small',
      },
      {
        id: 'know-customers',
        title: 'اعرف ايش يحبون العملاء',
        description:
          'يشوف مواضيع تعجب العملاء بتقييماتك؟ الخدمة؟ الأسعار؟ اعرف بالضبط ايش تتابع وايش تحتاج تصلح.',
        icon: TrendingUp,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        size: 'small',
      },
      {
        id: 'ready-fast',
        title: 'جاهز خلال 5 دقائق',
        description:
          'ربط بسيط مع جوجل، وخلصنا. ما تحتاج خطوات معقدة أو انتظار. ابدأ تحمي تقييماتك اليوم.',
        icon: Clock3,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        size: 'small',
      },
    ] satisfies SmartReplyCard[],
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

  smartReplies: {
    wrapper: 'bg-[#eef7f5]',
    container: 'py-16 sm:py-20 lg:py-24',
    grid: 'mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-12',
    card: {
      base:
        'group rounded-[20px] border border-emerald-100 bg-white/95 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition-all duration-500 sm:p-5',
      hover:
        'hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(16,185,129,0.08)]',
      hidden: 'translate-y-8 opacity-0',
      visible: 'translate-y-0 opacity-100',
      large: 'lg:col-span-6 min-h-[160px] sm:min-h-[170px]',
      small: 'lg:col-span-3 min-h-[150px] sm:min-h-[160px]',
    },
    icon: {
      wrapper:
        'mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11',
      icon:
        'h-5 w-5 transition-transform duration-300 group-hover:scale-110 sm:h-5.5 sm:w-5.5',
    },
    text: {
      title: 'text-lg font-bold leading-7 text-slate-900 sm:text-[1.15rem]',
      description: 'mt-2 text-[14px] leading-7 text-slate-500',
    },
    ctaWrap: 'mt-10 flex justify-center',
  },

  button: {
    gradient:
      'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-8 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(13,148,136,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(13,148,136,0.28)]',
    icon: 'h-4 w-4',
  },
} as const

const MOTION = {
  staggerMs: 120,
  sectionThreshold: 0.2,
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

function GradientButton({ children }: { children: React.ReactNode }) {
  return (
    <Link to="/login" className={STYLES.button.gradient}>
      <ArrowLeft className={STYLES.button.icon} />
      <span>{children}</span>
    </Link>
  )
}

function SmartRepliesCard({
  card,
  isVisible,
  delay,
}: {
  card: SmartReplyCard
  isVisible: boolean
  delay: number
}) {
  const Icon = card.icon
  const sizeClass =
    card.size === 'large'
      ? STYLES.smartReplies.card.large
      : STYLES.smartReplies.card.small

  return (
    <article
      className={[
        STYLES.smartReplies.card.base,
        STYLES.smartReplies.card.hover,
        sizeClass,
        isVisible
          ? STYLES.smartReplies.card.visible
          : STYLES.smartReplies.card.hidden,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`${STYLES.smartReplies.icon.wrapper} ${card.iconBg}`}>
        <Icon className={`${STYLES.smartReplies.icon.icon} ${card.iconColor}`} />
      </div>

      <h3 className={STYLES.smartReplies.text.title}>{card.title}</h3>
      <p className={STYLES.smartReplies.text.description}>{card.description}</p>
    </article>
  )
}

export default function SmartRepliesSection() {
  const { ref, isVisible } = useRevealOnScroll()

  const largeCards = useMemo(
    () => CONTENT.smartReplies.cards.filter((card) => card.size === 'large'),
    []
  )

  const smallCards = useMemo(
    () => CONTENT.smartReplies.cards.filter((card) => card.size === 'small'),
    []
  )

  return (
    <section ref={ref} dir="rtl" className={STYLES.smartReplies.wrapper}>
      <div className={`${STYLES.shared.container} ${STYLES.smartReplies.container}`}>
        <div className={STYLES.shared.sectionHeader}>
          <h2 className={STYLES.shared.sectionTitle}>
            {CONTENT.smartReplies.sectionTitle}
          </h2>
          <p className={STYLES.shared.sectionSubtitle}>
            {CONTENT.smartReplies.sectionSubtitle}
          </p>
        </div>

        <div className={STYLES.smartReplies.grid}>
          {largeCards.map((card, index) => (
            <SmartRepliesCard
              key={card.id}
              card={card}
              isVisible={isVisible}
              delay={index * MOTION.staggerMs}
            />
          ))}

          {smallCards.map((card, index) => (
            <SmartRepliesCard
              key={card.id}
              card={card}
              isVisible={isVisible}
              delay={(largeCards.length + index) * MOTION.staggerMs}
            />
          ))}
        </div>

        <div className={STYLES.smartReplies.ctaWrap}>
          <GradientButton>{CONTENT.smartReplies.ctaLabel}</GradientButton>
        </div>
      </div>
    </section>
  )
}