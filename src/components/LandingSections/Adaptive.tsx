import { useEffect, useRef, useState } from 'react'
import {
  BriefcaseBusiness,
  Building2,
  Coffee,
  Hospital,
  MapPinned,
  UtensilsCrossed,
} from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'

const cardIcons = [UtensilsCrossed, Building2, BriefcaseBusiness, Coffee, Hospital, MapPinned]

const cardAccents = [
  { border: 'border-[#f3d98a]', icon: 'text-[#e6b325]', gradientFrom: 'from-[#f9f3db]', gradientVia: 'via-[#fbf7eb]' },
  { border: 'border-[#cfe0fa]', icon: 'text-[#7aa7f8]', gradientFrom: 'from-[#edf3fb]', gradientVia: 'via-[#f5f8fc]' },
  { border: 'border-[#ddd4fb]', icon: 'text-[#9b72f8]', gradientFrom: 'from-[#f4f1fb]', gradientVia: 'via-[#faf8fd]' },
  { border: 'border-[#f1d2a7]', icon: 'text-[#e7b160]', gradientFrom: 'from-[#faf3ea]', gradientVia: 'via-[#fcf8f2]' },
  { border: 'border-[#bfeee4]', icon: 'text-[#29c9bc]', gradientFrom: 'from-[#ebf8f5]', gradientVia: 'via-[#f5fbfa]' },
  { border: 'border-[#b8eccb]', icon: 'text-[#22c578]', gradientFrom: 'from-[#ebf8f0]', gradientVia: 'via-[#f5fbf7]' },
]

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

export default function AdaptiveSectors() {
  const { t, dir, isRTL } = useLocale()
  const { ref, isVisible } = useRevealOnScroll()

  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <section ref={ref} dir={dir} className="bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem]">
            {t.adaptive.title}
          </h2>
          <p className="mt-3 text-[16px] leading-8 text-slate-500 sm:text-[17px]">
            {t.adaptive.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {t.adaptive.cards.map((card, index) => {
            const accent = cardAccents[index]
            const Icon = cardIcons[index]

            return (
              <article
                key={card.title}
                className={[
                  'group rounded-[22px] border bg-gradient-to-br to-white p-6 sm:p-7',
                  'hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]',
                  accent.border,
                  accent.gradientFrom,
                  accent.gradientVia,
                  'transition-all duration-700 ease-out will-change-transform',
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
                ].join(' ')}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="flex min-h-[210px] flex-col justify-between">
                  <div className="flex justify-start">
                    <div className="inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className={`h-10 w-10 ${accent.icon}`} />
                    </div>
                  </div>

                  <div className={`flex justify-start ${textAlign}`}>
                    <div>
                      <h3 className="text-[1.9rem] font-bold leading-none text-slate-900">{card.title}</h3>
                      <p className="mt-3 text-[15px] leading-7 text-slate-500">{card.description}</p>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
