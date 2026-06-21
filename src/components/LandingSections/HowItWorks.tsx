import googleLogo from '../../assets/google.png'
import mapsLogo from '../../assets/maps.png'
import avatar from '../../assets/avatar.png'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useLocale } from '../../contexts/LocaleContext'

const stepImages = [googleLogo, mapsLogo, avatar]
const stepIds = ['connect-google', 'import-location', 'live-replies']

export default function HowItWorks() {
  const { t, dir, isRTL } = useLocale()

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <section dir={dir} className="bg-white" id="how-it-works">
      <div className="mx-auto w-full max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem]">
            {t.howItWorks.title}
          </h2>
          <p className="mt-3 text-base font-semibold text-slate-400 sm:text-lg">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl">
          <div className="space-y-10 lg:space-y-14">
            {t.howItWorks.steps.map((step, index) => {
              const isAvatar = stepIds[index] === 'live-replies'
              return (
                <article key={stepIds[index]} className="flex justify-start">
                  <div className="flex shrink-0 justify-start">
                    <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border border-emerald-100 bg-[#edf9f5] shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:h-[92px] sm:w-[92px]">
                      <img
                        src={stepImages[index]}
                        alt={step.title}
                        className={
                          isAvatar
                            ? 'h-[58px] w-[58px] rounded-full object-cover sm:h-[64px] sm:w-[64px]'
                            : 'h-[52px] w-[52px] object-contain sm:h-[58px] sm:w-[58px]'
                        }
                      />
                    </div>
                  </div>

                  <div className="flex w-full max-w-4xl items-start justify-start gap-6">
                    <div className="flex flex-1 justify-start">
                      <div className={`flex w-full max-w-2xl flex-col items-start mx-6 sm:mx-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="mb-3 flex w-full justify-start">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-teal-700">
                            <Clock3 className="h-3.5 w-3.5" />
                            {step.badge}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 sm:text-[2rem]">{step.title}</h3>
                        <p className="mt-3 text-xl leading-8 text-slate-500 sm:text-[18px]">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/Register"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-14 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(13,148,136,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(13,148,136,0.28)]"
          >
            <ArrowIcon className="h-4 w-4" />
            <span>{t.howItWorks.cta}</span>
          </Link>
        </div>
      </div>

      <div className="mt-14 border-t border-slate-200 pt-6 bg-[#f9faf9] py-6">
        <div className="flex items-center justify-center gap-2 text-center">
          <img src={mapsLogo} alt="Google Maps" className="h-5 w-5 object-contain" />
          <span className="text-sm font-bold text-slate-700 sm:text-base">{t.howItWorks.footerTitle}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-400">
          {t.howItWorks.footerPoints.map((point) => (
            <span key={point} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {point}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
