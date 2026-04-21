
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  TicketPercent,
  MessageCircle,
} from 'lucide-react'
import whatsappIcon from '../../assets/whatsapp.svg'
import { Link } from '@tanstack/react-router'
type BillingKey = 'monthly' | 'quarterly' | 'yearly'

type BillingOption = {
  key: BillingKey
  label: string
  unitLabel: string
  badge?: string
}

type PricingSummary = {
  total: number
  oldTotal?: number
  perBranchText: string
  periodText: string
  promoText?: string
  promoCode?: string
  breakdown: string[]
}

const BILLING_OPTIONS: BillingOption[] = [
  { key: 'monthly', label: 'شهريًا', unitLabel: '/ شهر' },
  { key: 'quarterly', label: '3 أشهر', unitLabel: '/  شهر', badge: '16%-' },
  { key: 'yearly', label: 'سنويًا', unitLabel: '/ سنة', badge: '30%-' },
]

const CONTENT = {
  title: 'تسعير واضح وشفاف',
  subtitle:
    'خصومات على الكميات للفروع المتعددة — كلما زادت فروعك، كان السعر أفضل',
  planTitle: 'باقة البداية',
  branchLabel: 'كم عدد فروعك؟',
  averageLabel: 'متوسط لكل فرع',
  ctaLabel: 'ابدأ الآن',
  cancelLabel: 'إلغاء في أي وقت',
  featuresTitle: 'يشمل:',
  features: [
    'ردود غير محدودة لكل موقع',
    'لهجة سعودية',
    'بدون التزام طويل',
    'أضف مواقع حسب الحاجة',
    'تحديث تلقائي كل ساعتين',
  ],
  whatsappPrompt: 'عندك أسئلة؟ تواصل معنا مباشرة',
  whatsappLabel: 'WhatsApp',
  promoTextMonthly: 'احصل على خصم 50%',
  promoCodeMonthly: 'FIRST50',
} as const

const STYLES = {
  section: {
    wrapper: 'bg-[#f8fafc]',
    container:
      'mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24',
    header: 'mx-auto max-w-3xl text-center',
  },

  text: {
    title:
      'text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem]',
    subtitle: 'mt-3 text-[16px] leading-8 text-slate-500 sm:text-[17px]',
    planTitle:
      'text-right text-[2rem] font-bold leading-none text-slate-900',
    branchLabel: 'mt-4 text-right text-[15px] font-semibold text-slate-500',
    averageLabel: 'text-[14px] font-medium text-slate-500',
    averageValue:
      'mt-1 text-[2rem] font-bold leading-none text-teal-600',
    averageUnit: 'text-[16px] font-bold text-teal-600',
    innerUnit: 'text-[17px] font-semibold text-white/90',
    oldPrice: 'text-[15px] text-white/45 line-through',
    price: 'text-[3rem] font-bold leading-none text-white',
    currency: 'text-[18px] font-bold text-white/90',
    cancel: 'mt-2 text-center text-[14px] text-slate-400',
    featuresTitle: 'text-right text-[16px] font-bold text-slate-900',
    feature: 'inline-flex items-center gap-2 text-[15px] text-slate-600',
    whatsappPrompt: 'text-center text-[15px] text-slate-500',
  },

  card: {
    shell:
      'mx-auto mt-12 max-w-[640px] rounded-[22px] border border-[#dcebe6] bg-[#eef7f5] p-6 shadow-[0_12px_26px_rgba(15,23,42,0.08)] sm:p-7',
    tabsWrap: 'flex justify-center',
    tabs:
      'inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_8px_18px_rgba(15,23,42,0.08)]',
    tabBase:
      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all',
    tabActive:
      'bg-teal-600 text-white shadow-[0_6px_14px_rgba(13,148,136,0.18)]',
    tabInactive: 'text-slate-500 hover:bg-slate-50',
    tabBadge:
      'rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-teal-700',
    topArea: 'mt-10 flex flex-col gap-4',
    topRow: 'flex items-start justify-between gap-6 mt-8',
    counterArea: 'text-right',
    counter: 'mt-3 flex items-center justify-end gap-3',
    counterButton:
      'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:text-teal-600',
    counterValue:
      'min-w-[34px] text-center text-[2rem] font-bold leading-none text-slate-900',
    innerPriceCard: 'mt-6 overflow-hidden rounded-[18px]',
    innerPriceMain: 'bg-[#0f9d94] px-6 py-6 text-right',
    innerPriceBottom:
      'flex items-center justify-between gap-3 bg-[#f6bc00] px-5 py-3 text-right',
    promoRight:
      'flex items-center gap-2 text-[15px] font-bold text-[#764d00]',
    promoCode:
      'rounded-lg bg-[#e1a800] px-3 py-2 text-[13px] font-bold tracking-wide text-[#5a3900]',
    ctaWrap: 'mt-3 flex justify-center',
    ctaButton:
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-8 py-3 text-base font-bold text-white transition-all duration-300 ' +
  'bg-gradient-to-r from-[#0f9d94] to-[#16a085] ' +
  'shadow-[0_14px_30px_rgba(13,148,136,0.22)] ' +
  'hover:from-[#0d8f87] hover:to-[#128f7d] ' + 
  'hover:shadow-[0_18px_34px_rgba(13,148,136,0.32)] ' +
  'hover:-translate-y-[1px]',
    ctaIcon: 'h-4 w-4',
    breakdownWrap: 'mt-3 space-y-1 text-right',
    breakdownLine: 'text-[13px] text-teal-600',
  },

  bottom: {
    wrap: 'mx-auto  max-w-[540px]',
    featuresGrid: 'mt-4 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2',
    featureItem: 'flex items-center justify-end gap-2',
    featureIcon: 'h-5 w-5 shrink-0 text-emerald-400',
    whatsappWrap: 'mt-10 flex flex-col items-center justify-center',
   whatsappButton:
  'mt-3 inline-flex items-center gap-2 rounded-full border-2 border-[#22c55e] bg-[#eafff3] px-6 py-3 text-[18px] font-semibold text-[#16a34a] shadow-[0_4px_12px_rgba(34,197,94,0.15)] transition-all duration-300 hover:border-[#16a34a] hover:bg-[#dcfce7] hover:text-[#16a34a] hover:shadow-[0_6px_18px_rgba(34,197,94,0.25)] hover:scale-105',
   whatsappIcon: 'h-5 w-5',
  },
} as const

const BASE_MONTHLY_PRICE = 119
const RANGE_TWO_DISCOUNT = 0.168
const RANGE_THREE_DISCOUNT = 0.336

const BILLING_DISCOUNTS: Record<BillingKey, number> = {
  monthly: 0.5,
  quarterly: 0.16,
  yearly: 0.3,
}

const BILLING_MONTHS: Record<BillingKey, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
}

function formatPrice(value: number) {
  return value.toFixed(2)
}

function clampBranches(value: number) {
  return Math.min(Math.max(value, 1), 30)
}

function roundUpTo9Ending(value: number) {
  return Math.ceil(value / 10) * 10 - 1
}

function getRangeMonthlyPrices() {
  return {
    tierOne: 119,
    tierTwo: Math.round(BASE_MONTHLY_PRICE * (1 - RANGE_TWO_DISCOUNT)),
    tierThree: Math.round(BASE_MONTHLY_PRICE * (1 - RANGE_THREE_DISCOUNT)),
  }
}

function buildMonthlyBaseForBranches(branches: number) {
  const safeBranches = clampBranches(branches)
  const { tierOne, tierTwo, tierThree } = getRangeMonthlyPrices()

  const tierOneCount = Math.min(safeBranches, 3)
  const tierTwoCount = Math.max(Math.min(safeBranches, 9) - 3, 0)
  const tierThreeCount = Math.max(safeBranches - 9, 0)

  const monthlyBase =
    tierOneCount * tierOne +
    tierTwoCount * tierTwo +
    tierThreeCount * tierThree

  return {
    monthlyBase,
    tierOneCount,
    tierTwoCount,
    tierThreeCount,
    tierOne,
    tierTwo,
    tierThree,
  }
}

function buildPricingSummary(
  branches: number,
  billing: BillingKey
): PricingSummary {
  const safeBranches = clampBranches(branches)
  const activeBilling = BILLING_OPTIONS.find((item) => item.key === billing)!

  const {
    monthlyBase,
    tierOneCount,
    tierTwoCount,
    tierThreeCount,
    tierOne,
    tierTwo,
    tierThree,
  } = buildMonthlyBaseForBranches(safeBranches)

  const months = BILLING_MONTHS[billing]
  const discount = BILLING_DISCOUNTS[billing]

  const subtotalBeforeBillingDiscount = monthlyBase * months
  const totalAfterDiscount = subtotalBeforeBillingDiscount * (1 - discount)
  const averagePerBranchPerMonth = monthlyBase / safeBranches

  const breakdown: string[] = []

  if (tierOneCount > 0) {
    breakdown.push(`الفروع 1–3 (${tierOneCount}×) ${tierOne} ريال`)
  }

  if (tierTwoCount > 0) {
    breakdown.push(`الفروع 4–9 (${tierTwoCount}×) −16.8% ${tierTwo} ريال`)
  }

  if (tierThreeCount > 0) {
    breakdown.push(`الفروع 10–30 (${tierThreeCount}×) −33.6% ${tierThree} ريال`)
  }

  return {
    total:
      billing === 'yearly'
        ? roundUpTo9Ending(totalAfterDiscount)
        : totalAfterDiscount,
    oldTotal: billing === 'monthly' ? subtotalBeforeBillingDiscount : undefined,
    perBranchText: `${Math.round(averagePerBranchPerMonth)} ريال`,
    periodText: activeBilling.unitLabel,
    promoText: billing === 'monthly' ? CONTENT.promoTextMonthly : undefined,
    promoCode: billing === 'monthly' ? CONTENT.promoCodeMonthly : undefined,
    breakdown,
  }
}

function BillingTabs({
  active,
  onChange,
}: {
  active: BillingKey
  onChange: (value: BillingKey) => void
}) {
  return (
    <div className={STYLES.card.tabsWrap}>
      <div className={STYLES.card.tabs}>
        {BILLING_OPTIONS.map((option) => {
          const isActive = active === option.key

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className={[
                STYLES.card.tabBase,
                isActive ? STYLES.card.tabActive : STYLES.card.tabInactive,
              ].join(' ')}
            >
              <span>{option.label}</span>
              {option.badge ? (
                <span className={STYLES.card.tabBadge}>{option.badge}</span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BranchCounter({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number
  onDecrease: () => void
  onIncrease: () => void
}) {
  return (
    <div className={STYLES.card.counter}>
      <button
        type="button"
        onClick={onDecrease}
        className={STYLES.card.counterButton}
        aria-label="تقليل عدد الفروع"
      >
        <Minus className="h-5 w-5" />
      </button>

      <span className={STYLES.card.counterValue}>{value}</span>

      <button
        type="button"
        onClick={onIncrease}
        className={STYLES.card.counterButton}
        aria-label="زيادة عدد الفروع"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}

function PriceDisplay({
  summary,
  billing,
}: {
  summary: PricingSummary
  billing: BillingKey
}) {
  const unitLabel =
    billing === 'monthly'
      ? '/ شهر'
      : billing === 'quarterly'
      ? '/ 3 أشهر'
      : '/ سنة'

  return (
    <div className={STYLES.card.innerPriceCard}>
      <div className={STYLES.card.innerPriceMain}>
        <div className={STYLES.text.innerUnit}>{unitLabel}</div>

        {summary.oldTotal ? (
          <div className={STYLES.text.oldPrice}>
            {formatPrice(summary.oldTotal)} ريال
          </div>
        ) : null}

        <div className="mt-2 flex  items-start justify-start gap-2">
          <span className={STYLES.text.currency}>ريال</span>
          <span className={STYLES.text.price}>
            {formatPrice(summary.total)}
          </span>
        </div>
      </div>

      {billing === 'monthly' && summary.promoText && summary.promoCode ? (
        <div className={STYLES.card.innerPriceBottom}>
          <div className={STYLES.card.promoRight}>
            <TicketPercent className="h-4 w-4" />
            <span>{summary.promoText}</span>
          </div>

          <div className={STYLES.card.promoCode}>{summary.promoCode}</div>
        </div>
      ) : null}
    </div>
  )
}

function PricingFeatures() {
  return (
    <div className={STYLES.bottom.wrap}>
     <div className="mx-auto  max-w-[540px] text-right">
  <div className="text-[16px] font-bold text-slate-900">
    {CONTENT.featuresTitle}
  </div>

  <div className="mt-2 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-10">
    {CONTENT.features.map((feature) => (
      <div
        key={feature}
        className="flex items-center justify-start gap-2"
      >
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        <span className="text-[15px] text-slate-600">{feature}</span>
        
      </div>
    ))}
  </div>
</div>

      <div className={STYLES.bottom.whatsappWrap}>
        <p className={STYLES.text.whatsappPrompt}>{CONTENT.whatsappPrompt}</p>

        <button type="button" className={STYLES.bottom.whatsappButton}>
          <img
  src={whatsappIcon}
  alt="whatsapp"
  className="h-5 w-5 object-contain"
/>
          <span>{CONTENT.whatsappLabel}</span>
        </button>
      </div>
    </div>
  )
}

export default function Pricing() {
  const [billing, setBilling] = useState<BillingKey>('monthly')
  const [branches, setBranches] = useState(1)

  const safeBranches = clampBranches(branches)

  const summary = useMemo(
    () => buildPricingSummary(safeBranches, billing),
    [safeBranches, billing]
  )

  const handleIncrease = () => {
    setBranches((prev) => Math.min(prev + 1, 30))
  }

  const handleDecrease = () => {
    setBranches((prev) => Math.max(prev - 1, 1))
  }

  return (
    <section dir="rtl" className={STYLES.section.wrapper} id='pricing'>
      <div className={STYLES.section.container}>
        <div className={STYLES.section.header}>
          <h2 className={STYLES.text.title}>{CONTENT.title}</h2>
          <p className={STYLES.text.subtitle}>{CONTENT.subtitle}</p>
        </div>

        <div className={STYLES.card.shell}>
          <BillingTabs active={billing} onChange={setBilling} />

   <div className={STYLES.card.topArea}>
  <div className={STYLES.card.topRow}>
    {/* Right side: plan + counter */}
    <div className="flex flex-col items-end gap-3 text-right">
      <div>
        <h3 className={STYLES.text.planTitle}>{CONTENT.planTitle}</h3>
        <div className={STYLES.text.branchLabel}>{CONTENT.branchLabel}</div>
      </div>

      <BranchCounter
        value={safeBranches}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
      />
    </div>

    {/* Left side: average + breakdown */}
    <div className="flex flex-col items-start gap-3 text-right">
      <div>
        <div className={STYLES.text.averageLabel}>{CONTENT.averageLabel}</div>

        <div className="mt-1 flex items-end justify-end gap-2">
          <span className={STYLES.text.averageUnit}>{summary.periodText}</span>
          <span className={STYLES.text.averageValue}>{summary.perBranchText}</span>
        </div>
      </div>

      <div className={STYLES.card.breakdownWrap}>
        {summary.breakdown.map((line) => (
          <div key={line} className={STYLES.card.breakdownLine}>
            {line}
          </div>
        ))}
      </div>
    </div>
  </div>

  <PriceDisplay summary={summary} billing={billing} />

  <div className={STYLES.card.ctaWrap}>
    <Link to="/login" className={STYLES.card.ctaButton}>
  <ArrowLeft className={STYLES.card.ctaIcon} />
  <span>{CONTENT.ctaLabel}</span>
</Link>
  </div>

  <p className={STYLES.text.cancel}>{CONTENT.cancelLabel}</p>
</div>
          </div>
          <PricingFeatures />
        </div>

        
      
    </section>
    
  )}

