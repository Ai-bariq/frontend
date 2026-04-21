import { ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import avatar from '../../assets/avatar.png'
import maps from '../../assets/maps.png'

import logo1 from '../../assets/logo1.png'
import logo2 from '../../assets/logo2.png'
import logo3 from '../../assets/logo3.png'
import logo4 from '../../assets/logo4.png'
import logo5 from '../../assets/logo5.png'
import logo6 from '../../assets/logo6.png'

const trustedLogos = [
  { name: 'Logo 1', src: logo1 },
  { name: 'Logo 2', src: logo2 },
  { name: 'Logo 3', src: logo3 },
  { name: 'Logo 4', src: logo4 },
  { name: 'Logo 5', src: logo5 },
  { name: 'Logo 6', src: logo6 },
]

function TrustedLogos() {
  return (
    <div className="mt-16 w-full sm:mt-20">
      <p className="mb-5 text-center text-xs font-medium text-slate-400 sm:text-sm">
        يثقون ببريق
      </p>

      <div className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="logo-marquee-track hover:[animation-play-state:paused]">
          <div className="logo-marquee-group">
            {trustedLogos.map((logo) => (
              <div key={`group-a-${logo.name}`} className="logo-item">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-16 w-auto object-contain sm:h-20"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="logo-marquee-group" aria-hidden="true">
            {trustedLogos.map((logo) => (
              <div key={`group-b-${logo.name}`} className="logo-item">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-12 w-auto object-contain sm:h-14"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const typedWords = ['مستشفيات', 'مطاعم', 'فنادق', 'متاجر', 'مقاهي']

function TypewriterWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = typedWords[wordIndex]
    const typingSpeed = isDeleting ? 60 : 110
    const pauseBeforeDelete = 1400
    const pauseBeforeNextWord = 250

    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % typedWords.length)
      timeout = setTimeout(() => {}, pauseBeforeNextWord)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentWord.slice(0, displayText.length - 1)
            : currentWord.slice(0, displayText.length + 1)
        )
      }, typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex])

  return (
    <span className="inline-flex min-w-[72px] items-center justify-center rounded-2xl bg-amber-100 px-4 py-2 leading-none text-amber-800 shadow-sm">
      <span className="inline-block min-h-[1em] whitespace-nowrap">
        {displayText || '\u00A0'}
      </span>
      <span className="mr-1 inline-block h-[1em] w-[2px] animate-pulse self-center bg-amber-700" />
    </span>
  )
}

export default function HeroSection() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden border-t border-slate-200 bg-white" id='hero'
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.08),transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#d9e1e7_0.7px,transparent_0.7px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[92vh] flex-col items-center justify-center py-14 sm:py-16 lg:py-20">
          <div className="mb-8 sm:mb-10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-teal-100 bg-white/70 shadow-[0_20px_60px_rgba(20,184,166,0.16)] sm:h-28 sm:w-28">
              <img
                src={avatar}
                alt="مساعد الذكاء الاصطناعي"
                className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
              />
            </div>
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-balance text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] font-extrabold leading-[1.15] tracking-tight text-slate-950 ">
              لا تشيل هم الردود في قوقل ماب
            </h1>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 text-xl font-bold sm:mt-7 sm:flex-row sm:gap-4 sm:text-2xl lg:text-[2rem]">
              <span className="text-teal-600">نظام ذكي يرد على تقييمات</span>
              <TypewriterWord />
              <span className="text-teal-600">تلقائيًا باللهجة السعودية</span>
            </div>

            <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12">
              <p className="text-lg font-bold text-teal-600 sm:text-xl">
                جرّب بنفسك الآن
              </p>

              <ArrowDown className="h-6 w-6 text-teal-500" />
            </div>

            <div className="mx-auto mt-10 w-full max-w-[770px] rounded-2xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600 p-5 shadow-[0_18px_50px_rgba(13,148,136,0.22)] sm:mt-12 sm:p-6 lg:p-7">
              <div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
                  <img
                    src={maps}
                    alt="Google Maps"
                    className="h-6 w-6 shrink-0 object-contain"
                  />

                  <input
                    type="text"
                    placeholder="اكتب اسم نشاطك التجاري هنا"
                    className="flex-1 bg-transparent text-right text-sm text-black placeholder:text-slate-400 focus:outline-none sm:text-base"
                  />
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-slate-100 sm:text-sm">
                30 ثانية فقط - مجاني بالكامل - بدون تسجيل
              </p>
            </div>
          </div>

          <TrustedLogos />
        </div>
      </div>
    </section>
  )
}
