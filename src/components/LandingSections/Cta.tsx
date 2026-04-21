import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
type CtaFeature = {
  label: string
}

type CtaTrustItem = {
  label: string
  icon: React.ReactNode
}

const CTA_CONTENT = {
  title: 'جاهز تربط موقعك بجوجل؟',
  description:
    'انضم لـ 50+ نشاط تجاري في السعودية وفّروا 30+ ساعة شهرياً مع ريبما. سواء تدير مطعم، فندق، متجر، أو عيادة - منافسينك يستخدمون الردود التقليدية. اسبقهم مع ريبما',
  ctaLabel: 'ابدأ الآن',
  features: [
    { label: 'إعداد 5 دقائق' },
    { label: 'الشهر الأول مجاناً' },
    { label: 'إلغاء في أي وقت' },
  ] satisfies CtaFeature[],
  trustItems: [
    { label: 'خرائط جوجل', icon: <MapPin className="h-4 w-4" /> },
    { label: 'آمن 100%', icon: <ShieldCheck className="h-4 w-4" /> },
    { label: '🇸🇦 صُنع في السعودية', icon: <span className="text-[14px] leading-none">•</span> },
  ] satisfies CtaTrustItem[],
} as const

const STYLES = {
  section:
    'relative overflow-hidden bg-[linear-gradient(180deg,#f9fffd_0%,#f4fcf9_100%)]',
  gridOverlay:
    'pointer-events-none absolute inset-0 opacity-100 ' +
    '[background-image:linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] ' +
    '[background-size:25px_25px]',
  glowLeft:
    'pointer-events-none absolute left-[-120px] top-[-40px] h-[300px] w-[300px] rounded-full bg-teal-100/50 blur-3xl',
  glowRight:
    'pointer-events-none absolute bottom-[-80px] right-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-100/50 blur-3xl',
  container:
    'relative mx-auto flex w-full max-w-7xl justify-center px-4 py-14 sm:py-16 lg:py-20',
  inner: 'flex w-full max-w-[920px] flex-col items-center text-center',
  title:
    'max-w-[720px] text-[34px] font-bold leading-[1.2] tracking-[-0.03em] text-slate-900 sm:text-[46px] lg:text-[56px]',
  description:
    'mt-5 max-w-[760px] text-[16px] leading-[2] text-slate-600 sm:text-[18px]',
  featuresWrap:
    'mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4',
  featurePill:
    'inline-flex items-center gap-2 rounded-full border border-[#E8F2EF] bg-white px-5 py-3 text-[14px] font-bold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:px-6',
  featureIcon:
    'h-5 w-5 shrink-0 rounded-full bg-emerald-100 p-1 text-emerald-500',
  ctaWrap: 'mt-8 flex justify-center',
  ctaButton:
    'inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-8 py-4 text-[20px] font-bold text-white transition-all duration-300 ' +
    'bg-gradient-to-r from-[#0ea5a4] to-[#10b981] ' +
    'shadow-[0_16px_30px_rgba(16,185,129,0.22)] ' +
    'hover:from-[#0d9488] hover:to-[#0f9f72] hover:-translate-y-[1px] hover:shadow-[0_20px_36px_rgba(16,185,129,0.28)]',
  ctaIcon: 'h-5 w-5 shrink-0',
  trustWrap:
    'mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center',
  trustItem:
    'inline-flex items-center gap-1.5 text-[14px] font-medium text-slate-500 sm:text-[15px]',
} as const

function CtaFeaturePill({ label }: CtaFeature) {
  return (
    <div className={STYLES.featurePill}>
      <CheckCircle2 className={STYLES.featureIcon} strokeWidth={2.4} />
      <span>{label}</span>
    </div>
  )
}

function CtaTrustRow() {
  return (
    <div className={STYLES.trustWrap}>
      {CTA_CONTENT.trustItems.map((item) => (
        <div key={item.label} className={STYLES.trustItem}>
          <span className="text-teal-500">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function Cta() {
  return (
    <section dir="rtl" className={STYLES.section} id='cta'>
      <div className={STYLES.gridOverlay} />
      <div className={STYLES.glowLeft} />
      <div className={STYLES.glowRight} />

      <div className={STYLES.container}>
        <div className={STYLES.inner}>
          <h2 className={STYLES.title}>{CTA_CONTENT.title}</h2>

          <p className={STYLES.description}>{CTA_CONTENT.description}</p>

          <div className={STYLES.featuresWrap}>
            {CTA_CONTENT.features.map((feature) => (
              <CtaFeaturePill key={feature.label} label={feature.label} />
            ))}
          </div>

          <div className={STYLES.ctaWrap}>
            <Link to="/login" className={STYLES.ctaButton}>
  <Sparkles className="h-4 w-4 shrink-0" />
  <span>{CTA_CONTENT.ctaLabel}</span>
  <ArrowRight className={STYLES.ctaIcon} />
</Link>
          </div>

          <CtaTrustRow />
        </div>
      </div>
    </section>
  )
}