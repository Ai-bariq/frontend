import { useEffect, useRef, useState } from 'react'
import {
  BriefcaseBusiness,
  Building2,
  Coffee,
  Hospital,
  MapPinned,
  UtensilsCrossed,
} from 'lucide-react'

type SectorCard = {
  id: string
  title: string
  description: string
  icon: typeof UtensilsCrossed
  accent: {
    border: string
    icon: string
    gradientFrom: string
    gradientVia: string
  }
}

const CONTENT = {
  title: 'بريق يتكيّف مع نشاطك',
  subtitle:
    'سواء تدير مطعم، فندقي، أو عيادة — بريق يفهم قطاعك ويرد بما يناسبه.',
  cards: [
    {
      id: 'restaurants',
      title: 'مطاعم',
      description: 'كل تقييم يتم الرد عليه قبل ما يجي الضيف الجاي',
      icon: UtensilsCrossed,
      accent: {
        border: 'border-[#f3d98a]',
        icon: 'text-[#e6b325]',
        gradientFrom: 'from-[#f9f3db]',
        gradientVia: 'via-[#fbf7eb]',
      },
    },
    {
      id: 'hotels',
      title: 'فنادق',
      description: 'تعامل مع +100 تقييم شهريًا عبر كل الفروع',
      icon: Building2,
      accent: {
        border: 'border-[#cfe0fa]',
        icon: 'text-[#7aa7f8]',
        gradientFrom: 'from-[#edf3fb]',
        gradientVia: 'via-[#f5f8fc]',
      },
    },
    {
      id: 'stores',
      title: 'متاجر',
      description: 'حوّل ملاحظات العملاء إلى سمعة 5 نجوم',
      icon: BriefcaseBusiness,
      accent: {
        border: 'border-[#ddd4fb]',
        icon: 'text-[#9b72f8]',
        gradientFrom: 'from-[#f4f1fb]',
        gradientVia: 'via-[#faf8fd]',
      },
    },
    {
      id: 'cafes',
      title: 'مقاهي',
      description: 'ردود دافئة وشخصية تعكس أجواء مكانك',
      icon: Coffee,
      accent: {
        border: 'border-[#f1d2a7]',
        icon: 'text-[#e7b160]',
        gradientFrom: 'from-[#faf3ea]',
        gradientVia: 'via-[#fcf8f2]',
      },
    },
    {
      id: 'health',
      title: 'صحة',
      description: 'ردود احترافية وحساسة على تقييمات المرضى',
      icon: Hospital,
      accent: {
        border: 'border-[#bfeee4]',
        icon: 'text-[#29c9bc]',
        gradientFrom: 'from-[#ebf8f5]',
        gradientVia: 'via-[#f5fbfa]',
      },
    },
    {
      id: 'any-business',
      title: 'نشاطك',
      description: 'أي نشاط على خرائط جوجل — بريق يتكيّف',
      icon: MapPinned,
      accent: {
        border: 'border-[#b8eccb]',
        icon: 'text-[#22c578]',
        gradientFrom: 'from-[#ebf8f0]',
        gradientVia: 'via-[#f5fbf7]',
      },
    },
  ] satisfies SectorCard[],
} as const

const STYLES = {
  section: {
    wrapper: 'bg-white',
    container:
      'mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24',
    header: 'mx-auto max-w-3xl text-center',
  },

  text: {
    title:
      'text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem]',
    subtitle:
      'mt-3 text-[16px] leading-8 text-slate-500 sm:text-[17px]',
    cardTitle:
      'text-right text-[1.9rem] font-bold leading-none text-slate-900',
    cardDescription:
      'mt-3 text-right text-[15px] leading-7 text-slate-500',
  },

  grid: {
    wrapper:
      'mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3',
  },

  motion: {
    base:
      'transition-all duration-700 ease-out will-change-transform',
    hidden: 'translate-y-8 opacity-0',
    visible: 'translate-y-0 opacity-100',
  },

  card: {
    base:
      'group rounded-[22px] border bg-gradient-to-br to-white p-6 sm:p-7',
    layout:
  'flex min-h-[210px] flex-col justify-between text-right',
    hover:
      'hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]',
    iconRow:
      'flex justify-start',
    textRow:
      'flex justify-start',
    iconWrap:
      'inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
  },

  icon: {
    base: 'h-10 w-10',
  },
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
      { threshold: 0.18 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isVisible])

  return { ref, isVisible }
}

function SectorCardItem({
  card,
  isVisible,
  delay,
}: {
  card: SectorCard
  isVisible: boolean
  delay: number
}) {
  const Icon = card.icon

  return (
    <article
      className={[
        STYLES.card.base,
        STYLES.card.layout,
        STYLES.card.hover,
        card.accent.border,
        card.accent.gradientFrom,
        card.accent.gradientVia,
        STYLES.motion.base,
        isVisible ? STYLES.motion.visible : STYLES.motion.hidden,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={STYLES.card.iconRow}>
        <div className={STYLES.card.iconWrap}>
          <Icon className={[STYLES.icon.base, card.accent.icon].join(' ')} />
        </div>
      </div>

      <div className={STYLES.card.textRow}>
        <div>
          <h3 className={STYLES.text.cardTitle}>{card.title}</h3>
          <p className={STYLES.text.cardDescription}>{card.description}</p>
        </div>
      </div>
    </article>
  )
}

export default function AdaptiveSectors() {
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section ref={ref} dir="rtl" className={STYLES.section.wrapper}>
      <div className={STYLES.section.container}>
        <div className={STYLES.section.header}>
          <h2 className={STYLES.text.title}>{CONTENT.title}</h2>
          <p className={STYLES.text.subtitle}>{CONTENT.subtitle}</p>
        </div>

        <div className={STYLES.grid.wrapper}>
          {CONTENT.cards.map((card, index) => (
            <SectorCardItem
              key={card.id}
              card={card}
              isVisible={isVisible}
              delay={index * 90}
            />
          ))}
        </div>
      </div>
    </section>
  )
}