import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  TicketPercent,
} from 'lucide-react'
import whatsappIcon from '../../assets/whatsapp.svg'
import { Link } from '@tanstack/react-router'
import { useLocale } from '../../contexts/LocaleContext'
import type { LocaleStrings } from '../../locales'

type BillingKey = 'monthly' | 'quarterly' | 'yearly'

type PricingSummary = {
  total: number
  oldTotal?: number
  perBranchText: string
  periodText: string
  promoText?: string
  promoCode?: string
  breakdown: string[]
}

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

  return {
    monthlyBase: tierOneCount * tierOne + tierTwoCount * tierTwo + tierThreeCount * tierThree,
    tierOneCount, tierTwoCount, tierThreeCount, tierOne, tierTwo, tierThree,
  }
}

function buildPricingSummary(
  branches: number,
  billing: BillingKey,
  t: LocaleStrings
): PricingSummary {
  const safeBranches = clampBranches(branches)

  const unitLabels: Record<BillingKey, string> = {
    monthly: t.pricing.unitLabels.monthly,
    quarterly: t.pricing.unitLabels.quarterly,
    yearly: t.pricing.unitLabels.yearly,
  }

  const { monthlyBase, tierOneCount, tierTwoCount, tierThreeCount, tierOne, tierTwo, tierThree } =
    buildMonthlyBaseForBranches(safeBranches)

  const months = BILLING_MONTHS[billing]
  const discount = BILLING_DISCOUNTS[billing]
  const subtotalBeforeBillingDiscount = monthlyBase * months
  const totalAfterDiscount = subtotalBeforeBillingDiscount * (1 - discount)
  const averagePerBranchPerMonth = monthlyBase / safeBranches

  const breakdown: string[] = []
  if (tierOneCount > 0) breakdown.push(t.pricing.tierBreakdown.tier1(tierOneCount, tierOne))
  if (tierTwoCount > 0) breakdown.push(t.pricing.tierBreakdown.tier2(tierTwoCount, '16.8', tierTwo))
  if (tierThreeCount > 0) breakdown.push(t.pricing.tierBreakdown.tier3(tierThreeCount, '33.6', tierThree))

  return {
    total: billing === 'yearly' ? roundUpTo9Ending(totalAfterDiscount) : totalAfterDiscount,
    oldTotal: billing === 'monthly' ? subtotalBeforeBillingDiscount : undefined,
    perBranchText: `${Math.round(averagePerBranchPerMonth)} ${t.pricing.currency}`,
    periodText: unitLabels[billing],
    promoText: billing === 'monthly' ? t.pricing.promoText : undefined,
    promoCode: billing === 'monthly' ? t.pricing.promoCode : undefined,
    breakdown,
  }
}

export default function Pricing() {
  const { t, dir, isRTL } = useLocale()
  const [billing, setBilling] = useState<BillingKey>('monthly')
  const [branches, setBranches] = useState(1)

  const safeBranches = clampBranches(branches)
  const summary = useMemo(() => buildPricingSummary(safeBranches, billing, t), [safeBranches, billing, t])

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
          {/* Billing tabs */}
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
              {/* Plan + counter */}
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

              {/* Average + breakdown */}
              <div className={`flex flex-col items-${isRTL ? 'end' : 'start'} gap-3 ${textAlign}`}>
                <div>
                  <div className="text-[14px] font-medium text-slate-500">{t.pricing.averageLabel}</div>
                  <div className="mt-1 flex items-end justify-end gap-2">
                    <span className="text-[16px] font-bold text-teal-600">{summary.periodText}</span>
                    <span className="text-[2rem] font-bold leading-none text-teal-600">{summary.perBranchText}</span>
                  </div>
                </div>
                <div className={`mt-3 space-y-1 ${textAlign}`}>
                  {summary.breakdown.map((line) => (
                    <div key={line} className="text-[13px] text-teal-600">{line}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price display */}
            <div className="mt-6 overflow-hidden rounded-[18px]">
              <div className={`bg-[#0f9d94] px-6 py-6 ${textAlign}`}>
                <div className="text-[17px] font-semibold text-white/90">{summary.periodText}</div>
                {summary.oldTotal ? (
                  <div className="text-[15px] text-white/45 line-through">
                    {formatPrice(summary.oldTotal)} {t.pricing.currency}
                  </div>
                ) : null}
                <div className="mt-2 flex items-start justify-start gap-2">
                  <span className="text-[18px] font-bold text-white/90">{t.pricing.currency}</span>
                  <span className="text-[3rem] font-bold leading-none text-white">{formatPrice(summary.total)}</span>
                </div>
              </div>

              {billing === 'monthly' && summary.promoText && summary.promoCode ? (
                <div className="flex items-center justify-between gap-3 bg-[#f6bc00] px-5 py-3">
                  <div className="flex items-center gap-2 text-[15px] font-bold text-[#764d00]">
                    <TicketPercent className="h-4 w-4" />
                    <span>{summary.promoText}</span>
                  </div>
                  <div className="rounded-lg bg-[#e1a800] px-3 py-2 text-[13px] font-bold tracking-wide text-[#5a3900]">
                    {summary.promoCode}
                  </div>
                </div>
              ) : null}
            </div>

            {/* CTA */}
            <div className="mt-3 flex justify-center">
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-8 py-3 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#0f9d94] to-[#16a085] shadow-[0_14px_30px_rgba(13,148,136,0.22)] hover:from-[#0d8f87] hover:to-[#128f7d] hover:shadow-[0_18px_34px_rgba(13,148,136,0.32)] hover:-translate-y-[1px]"
              >
                <ArrowIcon className="h-4 w-4" />
                <span>{t.pricing.cta}</span>
              </Link>
            </div>

            <p className="mt-2 text-center text-[14px] text-slate-400">{t.pricing.cancel}</p>
          </div>
        </div>

        {/* Features */}
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
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-[#22c55e] bg-[#eafff3] px-6 py-3 text-[18px] font-semibold text-[#16a34a] shadow-[0_4px_12px_rgba(34,197,94,0.15)] transition-all duration-300 hover:border-[#16a34a] hover:bg-[#dcfce7] hover:text-[#16a34a] hover:shadow-[0_6px_18px_rgba(34,197,94,0.25)] hover:scale-105"
            >
              <img src={whatsappIcon} alt="whatsapp" className="h-5 w-5 object-contain" />
              <span>{t.pricing.whatsappLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
