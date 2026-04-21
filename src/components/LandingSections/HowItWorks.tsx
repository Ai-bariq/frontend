import googleLogo from '../../assets/google.png'
import mapsLogo from '../../assets/maps.png'
import avatar from '../../assets/avatar.png'
import { ArrowLeft, CheckCircle2, Clock3 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
type Step = {
  id: string
  title: string
  description: string
  badge: string
  image: string
  imageAlt: string
}

const CONTENT = {
  title: 'كيف يعمل؟ ثلاث خطوات بس',
  subtitle: 'إجمالي وقت الإعداد: ~5 دقائق',
  ctaLabel: 'ابدأ الآن',
  footerTitle: 'شريك معتمد لخرائط جوجل',
  footerPoints: [
    'تحديث فوري للتقييمات',
    'إضافة مواقع متعددة',
    'ربط تلقائي',
    'اتصال آمن',
  ],
  steps: [
    {
      id: 'connect-google',
      title: 'اربط حساب جوجل',
      description:
        'اربط حساب خرائط جوجل بضغطة واحدة. آمن ومستقر بمستوى البنوك. يمكنك الفصل في أي وقت.',
      badge: '1-2 دقيقة',
      image: googleLogo,
      imageAlt: 'Google',
    },
    {
      id: 'import-location',
      title: 'استورد موقعك',
      description:
        'اختر موقعك من قائمة مواقعك في جوجل. بدر ينتقل تلقائيًا ويتعلم عن نشاطك التجاري في الخلفية — القائمة، الخدمات، المنتجات، كل شيء.',
      badge: '2-3 دقائق',
      image: mapsLogo,
      imageAlt: 'Google Maps',
    },
    {
      id: 'live-replies',
      title: 'خلّيه يشتغل 24/7',
      description:
        'بدر جاهز فورًا ويرد تلقائيًا على كل تقييم جديد باللهجة السعودية البيضاء الأصيلة. أنت بس استرخي وشوف.',
      badge: 'فورًا وقت مستمر',
      image: avatar,
      imageAlt: 'Badr avatar',
    },
  ] satisfies Step[],
} as const

const STYLES = {
  wrapper: 'bg-white',
  container:
    'mx-auto w-full max-w-7xl lg: py-16 px-4 sm:px-6 lg:px-8',

  header: 'mx-auto max-w-3xl text-center',
  title:
    'text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem]',
  subtitle: 'mt-3 text-base font-semibold text-slate-400 sm:text-lg',

  stepsWrap: 'relative mx-auto mt-14 max-w-6xl',

  stepsList: 'space-y-10 lg:space-y-14',

  row: 'flex justify-start',
stepInner: 'flex w-full max-w-4xl items-start justify-start gap-6',
textCol: 'flex flex-1 justify-start',
logoCol: 'flex shrink-0 justify-start',

  

  textBox:
    'flex w-full max-w-2xl flex-col items-start text-right mx-6 sm:mx-10 ',

  badgeWrap: 'mb-3 flex w-full justify-start',

  badge:
    'inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-teal-700',
  badgeIcon: 'h-3.5 w-3.5',

  stepTitle:
    'text-2xl font-bold text-slate-900 sm:text-[2rem] text-left',
  stepDescription:
    'mt-3 text-xl leading-8 text-slate-500 sm:text-[18px] text-right',

  visualWrap: 'flex justify-end',
  visualOuter:
    'relative flex h-[84px] w-[84px] items-center justify-center rounded-full border border-emerald-100 bg-[#edf9f5] shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:h-[92px] sm:w-[92px]',
  visualImage:
    'h-[52px] w-[52px] object-contain sm:h-[58px] sm:w-[58px]',
  visualAvatar:
    'h-[58px] w-[58px] rounded-full object-cover sm:h-[64px] sm:w-[64px]',

  ctaWrap: 'mt-12 flex justify-center',
  button:
    'inline-flex min-h-14.5 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-14 py-3 text-base font-bold text-white shadow-[0_14px_30px_rgba(13,148,136,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(13,148,136,0.28)]',
  buttonIcon: 'h-4 w-4',

  footer: 'mt-14 border-t border-slate-200 pt-6 bg-[#f9faf9] py-6' ,
  footerTitleWrap:
    'flex items-center justify-center gap-2 text-center',
  footerLogo: 'h-5 w-5 object-contain',
  footerTitle:
    'text-sm font-bold text-slate-700 sm:text-base',
  footerPoints:
    'mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-400',
  footerPoint: 'inline-flex items-center gap-1.5',
  footerPointIcon: 'h-4 w-4 text-emerald-500',
} as const

function GradientButton({ children }: { children: React.ReactNode }) {
  return (
    <Link to="/login" className={STYLES.button}>
      <ArrowLeft className={STYLES.buttonIcon} />
      <span>{children}</span>
    </Link>
  )
}

function StepVisual({ step }: { step: Step }) {
  const isAvatar = step.id === 'live-replies'

  return (
    <div className={STYLES.visualWrap}>
      <div className={STYLES.visualOuter}>
        <img
          src={step.image}
          alt={step.imageAlt}
          className={
            isAvatar ? STYLES.visualAvatar : STYLES.visualImage
          }
        />
      </div>
    </div>
  )
}

function StepText({ step }: { step: Step }) {
  return (
    <div className={STYLES.textBox}>
      <div className={STYLES.badgeWrap}>
        <span className={STYLES.badge}>
          <Clock3 className={STYLES.badgeIcon} />
          {step.badge}
        </span>
      </div>

      <h3 className={STYLES.stepTitle}>{step.title}</h3>
      <p className={STYLES.stepDescription}>
        {step.description}
      </p>
    </div>
  )
}

function HowItWorksStep({ step }: { step: Step }) {
  return (
    <article className={STYLES.row}>
      {/* LOGO first */}
        <div className={STYLES.logoCol}>
          <StepVisual step={step} />
        </div>
      
      <div className={STYLES.stepInner}>
        {/* TEXT second */}
        <div className={STYLES.textCol}>
          <StepText step={step} />
        </div>
      </div>

        
    </article>
  )
}

export default function HowItWorks() {
  return (
    <section dir="rtl" className={STYLES.wrapper} id='how-it-works'>
      <div className={STYLES.container}>
        <div className={STYLES.header}>
          <h2 className={STYLES.title}>{CONTENT.title}</h2>
          <p className={STYLES.subtitle}>
            {CONTENT.subtitle}
          </p>
        </div>

        <div className={STYLES.stepsWrap}>

          <div className={STYLES.stepsList}>
            {CONTENT.steps.map((step) => (
              <HowItWorksStep key={step.id} step={step} />
            ))}
          </div>
        </div>

        <div className={STYLES.ctaWrap}>
          <GradientButton>
            {CONTENT.ctaLabel}
          </GradientButton>
        </div>

      
      </div>
        <div className={STYLES.footer}>
          <div className={STYLES.footerTitleWrap}>
            <img
              src={mapsLogo}
              alt="Google Maps"
              className={STYLES.footerLogo}
            />
            <span className={STYLES.footerTitle}>
              {CONTENT.footerTitle}
            </span>
          </div>

          <div className={STYLES.footerPoints}>
            {CONTENT.footerPoints.map((point) => (
              <span key={point} className={STYLES.footerPoint}>
                <CheckCircle2
                  className={STYLES.footerPointIcon}
                />
                {point}
              </span>
            ))}
          </div>
        </div>
    </section>
  )
}