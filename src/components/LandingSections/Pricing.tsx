import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
} from 'lucide-react'
import whatsappIcon from '../../assets/whatsapp.svg'
import { whatsappUrl } from '../../config'
import { useLocale } from '../../contexts/LocaleContext'
import type { LocaleStrings } from '../../locales'
import { isAuthenticated } from '../../utils/auth'

type BillingKey = 'monthly' | 'quarterly' | 'yearly'

// ─── Display-only pricing ─────────────────────────────────────────────────────
// Display only. Backend is source of truth.
//
// These values mirror the backend PricingTier seed data exactly:
//   Monthly:   119 SAR/branch
//   Quarterly: 299 SAR/branch  (~16% saving vs monthly × 3 = 357 SAR)
//   Yearly:    999 SAR/branch  (~30% saving vs monthly × 12 = 1428 SAR)
//
// Formula: total = pricePerBranch[cycle] × branchesCount
// No multi-branch tier discounts applied — backend TODO not yet implemented.
// When the backend introduces tier discounts, update both here and the backend.

const DISPLAY_PRICE_PER_BRANCH: Record<BillingKey, number> = {
  monthly: 119,
  quarterly: 299,
  yearly: 999,
}

const DISPLAY_MONTHS: Record<BillingKey, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
}

// Monthly base price — used to compute "equivalent if paid monthly" for savings display
const MONTHLY_BASE = 119

function clampBranches(value: number) {
  return Math.min(Math.max(value, 1), 30)
}

type PricingSummary = {
  total: number
  oldTotal?: number  // monthly-equivalent price (crossed out) to show savings
  avgPerBranchPerMonth: number
  periodText: string
}

// Display only. Backend is source of truth.
function buildPricingSummary(
  branches: number,
  cycle: BillingKey,
  t: LocaleStrings
): PricingSummary {
  const safe = clampBranches(branches)
  const pricePerBranch = DISPLAY_PRICE_PER_BRANCH[cycle]
  const total = pricePerBranch * safe

  // Show the monthly-equivalent total as crossed-out for quarterly and yearly
  const monthlyEquivalent = MONTHLY_BASE * DISPLAY_MONTHS[cycle] * safe
  const oldTotal = cycle !== 'monthly' ? monthlyEquivalent : undefined

  const avgPerBranchPerMonth = pricePerBranch / DISPLAY_MONTHS[cycle]

  const periodLabels: Record<BillingKey, string> = {
    monthly: t.pricing.unitLabels.monthly,
    quarterly: t.pricing.unitLabels.quarterly,
    yearly: t.pricing.unitLabels.yearly,
  }

  return { total, oldTotal, avgPerBranchPerMonth, periodText: periodLabels[cycle] }
}

export default function Pricing() {
  const { t, dir, isRTL } = useLocale()
  const [billing, setBilling] = useState<BillingKey>('monthly')
  const [branches, setBranches] = useState(1)

  const safeBranches = clampBranches(branches)
  const summary = useMemo(() => buildPricingSummary(safeBranches, billing, t), [safeBranches, billing, t])

  const checkoutHref = `/subscribe?billingCycle=${billing}&branchesCount=${safeBranches}`
  const pricingCtaHref = isAuthenticated()
    ? checkoutHref
    : `/Login?redirect=${encodeURIComponent(checkoutHref)}`

  const billingOptions = [
    { key: 'monthly' as BillingKey, label: t.pricing.billing.monthly },
    { key: 'quarterly' as BillingKey, label: t.pricing.billing.quarterly, badge: t.pricing.billingBadges.quarterly },
    { key: 'yearly' as BillingKey, label: t.pricing.billing.yearly, badge: t.pricing.billingBadges.yearly },
  ]

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const textAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <section dir={dir} className="bg-[#f8fafc]" id="pricing">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[3rem]">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-[16px] leading-8 text-slate-500 sm:text-[17px]">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[640px] rounded-[22px] border border-[#dcebe6] bg-[#eef7f5] p-6 shadow-[0_12px_26px_rgba(15,23,42,0.08)] sm:p-7">
          {/* Billing cycle tabs */}
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
              {billingOptions.map((option) => {
                const isActive = billing === option.key
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setBilling(option.key)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-[0_6px_14px_rgba(13,148,136,0.18)]'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>{option.label}</span>
                    {option.badge && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-teal-700">
                        {option.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-6 mt-8">
              {/* Plan title + branch counter */}
              <div className={`flex flex-col items-${isRTL ? 'end' : 'start'} gap-3 ${textAlign}`}>
                <div>
                  <h3 className="text-[2rem] font-bold leading-none text-slate-900">{t.pricing.planTitle}</h3>
                  <div className="mt-4 text-[15px] font-semibold text-slate-500">{t.pricing.branchLabel}</div>
                </div>
                <div className={`mt-3 flex items-center ${isRTL ? 'justify-end' : 'justify-start'} gap-3`}>
                  <button
                    type="button"
                    onClick={() => setBranches((prev) => Math.max(prev - 1, 1))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:text-teal-600"
                    aria-label={t.pricing.decreaseBranches}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="min-w-[34px] text-center text-[2rem] font-bold leading-none text-slate-900">
                    {safeBranches}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBranches((prev) => Math.min(prev + 1, 30))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:text-teal-600"
                    aria-label={t.pricing.increaseBranches}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Average per branch per month */}
              <div className={`flex flex-col items-${isRTL ? 'end' : 'start'} gap-3 ${textAlign}`}>
                <div>
                  <div className="text-[14px] font-medium text-slate-500">{t.pricing.averageLabel}</div>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-[16px] font-bold text-teal-600">{summary.periodText}</span>
                    <span className="text-[2rem] font-bold leading-none text-teal-600">
                      {Math.round(summary.avgPerBranchPerMonth)} {t.pricing.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total price display */}
            <div className="mt-6 overflow-hidden rounded-[18px]">
              <div className={`bg-[#0f9d94] px-6 py-6 ${textAlign}`}>
                <div className="text-[17px] font-semibold text-white/90">{summary.periodText}</div>
                {summary.oldTotal ? (
                  <div className="text-[15px] text-white/45 line-through">
                    {summary.oldTotal} {t.pricing.currency}
                  </div>
                ) : null}
                <div className="mt-2 flex items-start justify-start gap-2">
                  <span className="text-[18px] font-bold text-white/90">{t.pricing.currency}</span>
                  <span className="text-[3rem] font-bold leading-none text-white">{summary.total}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-3 flex justify-center">
              <a
                href={pricingCtaHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-8 py-3 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#0f9d94] to-[#16a085] shadow-[0_14px_30px_rgba(13,148,136,0.22)] hover:from-[#0d8f87] hover:to-[#128f7d] hover:shadow-[0_18px_34px_rgba(13,148,136,0.32)] hover:-translate-y-[1px]"
              >
                <ArrowIcon className="h-4 w-4" />
                <span>{t.pricing.cta}</span>
              </a>
            </div>

            <p className="mt-2 text-center text-[14px] text-slate-400">{t.pricing.cancel}</p>
          </div>
        </div>

        {/* Features list */}
        <div className="mx-auto max-w-[540px]">
          <div className={`mx-auto max-w-[540px] ${textAlign}`}>
            <div className="text-[16px] font-bold text-slate-900">{t.pricing.featuresTitle}</div>
            <div className="mt-2 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-10">
              {t.pricing.features.map((feature) => (
                <div key={feature} className="flex items-center justify-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span className="text-[15px] text-slate-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center">
            <p className="text-center text-[15px] text-slate-500">{t.pricing.whatsappPrompt}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-[#22c55e] bg-[#eafff3] px-6 py-3 text-[18px] font-semibold text-[#16a34a] shadow-[0_4px_12px_rgba(34,197,94,0.15)] transition-all duration-300 hover:border-[#16a34a] hover:bg-[#dcfce7] hover:text-[#16a34a] hover:shadow-[0_6px_18px_rgba(34,197,94,0.25)] hover:scale-105"
            >
              <img src={whatsappIcon} alt="whatsapp" className="h-5 w-5 object-contain" />
              <span>{t.pricing.whatsappLabel}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
