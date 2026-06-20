import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useLocale } from '../../contexts/LocaleContext'

export default function Cta() {
  const { t, dir, isRTL } = useLocale()

  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft
  const trustIcons = [
    <MapPin className="h-4 w-4" />,
    <ShieldCheck className="h-4 w-4" />,
    <span className="text-[14px] leading-none">•</span>,
  ]

  return (
    <section dir={dir} className="relative overflow-hidden bg-[linear-gradient(180deg,#f9fffd_0%,#f4fcf9_100%)]" id="cta">
      <div className="pointer-events-none absolute inset-0 opacity-100 [background-image:linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:25px_25px]" />
      <div className="pointer-events-none absolute left-[-120px] top-[-40px] h-[300px] w-[300px] rounded-full bg-teal-100/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-80px] right-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl justify-center px-4 py-14 sm:py-16 lg:py-20">
        <div className="flex w-full max-w-[920px] flex-col items-center text-center">
          <h2 className="max-w-[720px] text-[34px] font-bold leading-[1.2] tracking-[-0.03em] text-slate-900 sm:text-[46px] lg:text-[56px]">
            {t.cta.title}
          </h2>

          <p className="mt-5 max-w-[760px] text-[16px] leading-[2] text-slate-600 sm:text-[18px]">
            {t.cta.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {t.cta.features.map((feature) => (
              <div
                key={feature}
                className="inline-flex items-center gap-2 rounded-full border border-[#E8F2EF] bg-white px-5 py-3 text-[14px] font-bold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:px-6"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 rounded-full bg-emerald-100 p-1 text-emerald-500" strokeWidth={2.4} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/Login"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-8 py-4 text-[20px] font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#0ea5a4] to-[#10b981] shadow-[0_16px_30px_rgba(16,185,129,0.22)] hover:from-[#0d9488] hover:to-[#0f9f72] hover:-translate-y-[1px] hover:shadow-[0_20px_36px_rgba(16,185,129,0.28)]"
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{t.cta.label}</span>
              <ArrowIcon className="h-5 w-5 shrink-0" />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
            {t.cta.trust.map((item, i) => (
              <div key={item.label} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-slate-500 sm:text-[15px]">
                <span className="text-teal-500">{trustIcons[i]}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
