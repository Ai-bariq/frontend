import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { Check, ShieldAlert, Loader2, CalendarClock, WifiOff } from 'lucide-react'
import logo from '../assets/logo.png'
import { useLocale } from '../contexts/LocaleContext'
import LocaleToggle from '../components/UI/LocaleToggle'
import { createCheckout, getBillingMe, type BillingCycle } from '../services/paymentServices'
import {
  clearAuthStorage,
  hasValidSession,
  isUnauthorizedError,
} from '../utils/auth'

export const Route = createFileRoute('/subscribe')({
  beforeLoad: async ({ location }) => {
    if (!(await hasValidSession())) {
      throw redirect({
        to: '/Login',
        search: { redirect: location.href },
      })
    }
  },
  component: SubscribePage,
})

function BlockedShell({
  children,
  dir,
}: {
  children: React.ReactNode
  dir: 'ltr' | 'rtl'
}) {
  return (
    <div dir={dir} className="flex min-h-screen flex-col items-center justify-center bg-[#F4FAF8] px-4">
      <div className="mb-6 flex w-full max-w-md items-center justify-between">
        <img src={logo} alt="Bariq AI" className="h-auto w-[90px] object-contain" />
        <LocaleToggle />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-[0_10px_30px_rgba(15,23,42,0.08)] text-center">
        {children}
      </div>
    </div>
  )
}

// Display-only pricing — backend is source of truth for actual charge amount
const DISPLAY_PRICE: Record<BillingCycle, number> = {
  monthly: 119,
  quarterly: 299,
  yearly: 999,
}

const BILLING_CYCLES: BillingCycle[] = ['monthly', 'quarterly', 'yearly']
const MAX_BRANCHES = 10 // cards shown; +/- handles beyond
const MIN_BRANCHES = 1
const ABS_MAX = 30

function getUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function SubscribePage() {
  // All hooks must come before any conditional returns (React Rules of Hooks).
  const { t, dir, isRTL, locale } = useLocale()

  const user = getUser()
  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin'

  // 'checking' until the mount effect confirms no redirect is needed.
  // Returning null prevents a flash of subscribe content during redirect.
  const [status, setStatus] = useState<'checking' | 'ready'>('checking')
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [branches, setBranches] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Subscription gate — check on mount if user already has an active/past_due subscription
  const [subCheckDone, setSubCheckDone] = useState(false)
  const [subCheckError, setSubCheckError] = useState(false)
  const [activeUntil, setActiveUntil] = useState<string | null>(null)   // ISO date string
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)
  const [isPastDue, setIsPastDue] = useState(false)

  // Guard concurrent clicks — state updates are async so disabled={loading} alone
  // doesn't block a second tap that fires before the first re-render.
  const inFlight = useRef(false)

  const runSubCheck = () => {
    if (isAdmin) { setSubCheckDone(true); return }
    setSubCheckDone(false)
    setSubCheckError(false)
    setIsPastDue(false)
    getBillingMe()
      .then((data) => {
        const sub = data.subscription
        if (sub?.status === 'active') {
          setActiveUntil(sub.currentPeriodEnd ?? null)
          setCancelAtPeriodEnd(sub.cancelAtPeriodEnd ?? false)
        } else if (sub?.status === 'past_due') {
          setIsPastDue(true)
        }
      })
      .catch((error) => {
        if (isUnauthorizedError(error)) {
          clearAuthStorage()
          const subscribePath =
            `${window.location.pathname}${window.location.search}`
          window.location.replace(
            `/Login?redirect=${encodeURIComponent(subscribePath)}`,
          )
          return
        }
        setSubCheckError(true)
      })
      .finally(() => setSubCheckDone(true))
  }

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const queryCycle = params.get('billingCycle') as BillingCycle | null
      const queryBranches = Number(params.get('branchesCount'))
      if (queryCycle && BILLING_CYCLES.includes(queryCycle)) {
        setBilling(queryCycle)
      }
      if (
        Number.isInteger(queryBranches) &&
        queryBranches >= MIN_BRANCHES &&
        queryBranches <= ABS_MAX
      ) {
        setBranches(queryBranches)
      }

      const storedSelection = sessionStorage.getItem('bariq:checkout-selection')
      if (storedSelection) {
        sessionStorage.removeItem('bariq:checkout-selection')
        const selection = JSON.parse(storedSelection) as {
          billingCycle?: BillingCycle
          branchesCount?: number
        }
        if (BILLING_CYCLES.includes(selection.billingCycle as BillingCycle)) {
          setBilling(selection.billingCycle as BillingCycle)
        }
        if (
          Number.isInteger(selection.branchesCount) &&
          Number(selection.branchesCount) >= MIN_BRANCHES &&
          Number(selection.branchesCount) <= ABS_MAX
        ) {
          setBranches(Number(selection.branchesCount))
        }
      }
    } catch {
      sessionStorage.removeItem('bariq:checkout-selection')
    }

    // Post-payment history cleanup: result.tsx called history.go(-2) to land here
    // so that window.location.replace() can discard Tap + /result from the forward
    // history stack in a single operation. See result.tsx navigateAfterSuccess.
    const ppr = sessionStorage.getItem('bariq_ppr')
    if (ppr) {
      sessionStorage.removeItem('bariq_ppr')
      window.location.replace(ppr)
      return
    }
    setStatus('ready')
    runSubCheck()
  }, [])

  if (status === 'checking') return null

  const safeBranches = Math.min(Math.max(branches, MIN_BRANCHES), ABS_MAX)
  const totalPrice = DISPLAY_PRICE[billing] * safeBranches

  const handleContinue = async () => {
    if (isAdmin) return
    if (inFlight.current) return
    inFlight.current = true
    setError(null)
    setLoading(true)
    try {
      const data = await createCheckout({ billingCycle: billing, branchesCount: safeBranches })
      if (data.paymentUrl) {
        sessionStorage.setItem('bariq_flow', 'subscribe')
        // Record history depth so result.tsx can compute exact steps back,
        // regardless of how many entries Tap adds internally.
        sessionStorage.setItem('bariq_ppr_origin_length', String(window.history.length))
        window.location.href = data.paymentUrl
      } else {
        setError('No payment URL received. Please try again.')
        setLoading(false)
        inFlight.current = false
      }
    } catch (err) {
      if (isUnauthorizedError(err)) {
        clearAuthStorage()
        const subscribePath =
          `${window.location.pathname}${window.location.search}`
        window.location.href = `/Login?redirect=${encodeURIComponent(subscribePath)}`
        return
      }
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
      inFlight.current = false
    }
  }

  // ── Admin block ────────────────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div dir={dir} className="flex min-h-screen flex-col items-center justify-center bg-[#F4FAF8] px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-[0_10px_30px_rgba(15,23,42,0.08)] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <ShieldAlert className="h-8 w-8 text-slate-500" />
          </div>
          <h1 className="mt-5 text-xl font-extrabold text-slate-900">{t.subscribe.adminBlocked}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.subscribe.adminBlockedSubtitle}</p>
          <button
            type="button"
            onClick={() => { window.location.href = '/AdminDashboard' }}
            className="mt-6 w-full rounded-xl bg-[#159A8C] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#13897d]"
          >
            {t.subscribe.goToAdmin}
          </button>
        </div>
      </div>
    )
  }

  // ── Subscription gate loading ──────────────────────────────────────────────
  if (!subCheckDone) {
    return (
      <div dir={dir} className="flex min-h-screen items-center justify-center bg-[#F4FAF8]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0F9D94]" />
      </div>
    )
  }

  // ── Subscription check failed ──────────────────────────────────────────────
  if (subCheckError) {
    return (
      <BlockedShell dir={dir}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <WifiOff className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-slate-900">{t.subscribe.checkFailed}</h1>
        <p className="mt-2 text-sm text-slate-500">{t.subscribe.checkFailedSubtitle}</p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={runSubCheck}
            className="w-full rounded-xl bg-[#159A8C] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#13897d]"
          >
            {t.subscribe.retry}
          </button>
          <button
            type="button"
            onClick={() => { window.location.href = '/ClientDashboard/Billing' }}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
          >
            {t.subscribe.goToDashboard}
          </button>
        </div>
      </BlockedShell>
    )
  }

  // ── Already subscribed (active, auto-renews) ───────────────────────────────
  if (activeUntil !== null && !cancelAtPeriodEnd) {
    return (
      <BlockedShell dir={dir}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF7F4]">
          <CalendarClock className="h-8 w-8 text-[#0F9D94]" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-slate-900">{t.subscribe.alreadyActive}</h1>
        <p className="mt-2 text-sm text-slate-500">{t.subscribe.alreadyActiveSubtitle}</p>
        <button
          type="button"
          onClick={() => { window.location.href = '/ClientDashboard/Billing' }}
          className="mt-6 w-full rounded-xl bg-[#159A8C] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#13897d]"
        >
          {t.subscribe.goToDashboard}
        </button>
      </BlockedShell>
    )
  }

  // ── Cancelled but still active until period end ────────────────────────────
  if (activeUntil !== null && cancelAtPeriodEnd) {
    const formattedDate = new Date(activeUntil).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return (
      <BlockedShell dir={dir}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <CalendarClock className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-slate-900">{t.subscribe.cancelledActive}</h1>
        <p className="mt-2 text-sm text-slate-500">{t.subscribe.cancelledActiveSubtitle(formattedDate)}</p>
        <button
          type="button"
          onClick={() => { window.location.href = '/ClientDashboard/Billing' }}
          className="mt-6 w-full rounded-xl bg-[#159A8C] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#13897d]"
        >
          {t.subscribe.goToDashboard}
        </button>
      </BlockedShell>
    )
  }

  // ── Past-due subscription — cannot subscribe again, must resolve billing ──
  if (isPastDue) {
    return (
      <BlockedShell dir={dir}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <ShieldAlert className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-slate-900">
          {isRTL ? 'الاشتراك متأخر الدفع' : 'Payment Past Due'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isRTL
            ? 'لديك اشتراك قائم بدفعة متأخرة. يرجى إدارة الفوترة من لوحة التحكم.'
            : 'You have an existing subscription with a missed payment. Please manage billing from your dashboard.'}
        </p>
        <button
          type="button"
          onClick={() => { window.location.href = '/ClientDashboard/Billing' }}
          className="mt-6 w-full rounded-xl bg-[#159A8C] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#13897d]"
        >
          {t.subscribe.goToDashboard}
        </button>
      </BlockedShell>
    )
  }

  // ── Main page ──────────────────────────────────────────────────────────────
  return (
    <div dir={dir} className="min-h-screen bg-[#F4FAF8] px-4 py-8 sm:px-6 lg:px-8">
      {/* Top bar */}
      <div className="mx-auto mb-8 flex max-w-2xl items-center justify-between">
        <img src={logo} alt="Bariq AI" className="h-auto w-[100px] object-contain" />
        <LocaleToggle />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-2xl font-extrabold text-slate-900">{t.subscribe.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{t.subscribe.subtitle}</p>
        </div>

        {/* ── Billing Period ── */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
          <h2 className={`mb-4 text-[13px] font-bold uppercase tracking-wide text-slate-500 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t.subscribe.billingPeriod}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {BILLING_CYCLES.map((cycle) => {
              const selected = billing === cycle
              const badge = cycle !== 'monthly' ? t.subscribe.billingBadges[cycle as 'quarterly' | 'yearly'] : null
              return (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBilling(cycle)}
                  className={`relative flex flex-col items-center rounded-xl border-2 px-3 py-4 text-center transition-all ${
                    selected
                      ? 'border-[#0F9D94] bg-[#EAF7F4]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {badge && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0F9D94] px-2 py-0.5 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                  <span className={`text-[13px] font-bold ${selected ? 'text-[#0F9D94]' : 'text-slate-700'}`}>
                    {t.clientPages.billing.billingCycles[cycle]}
                  </span>
                  <span className={`mt-1 text-xl font-extrabold ${selected ? 'text-slate-900' : 'text-slate-800'}`}>
                    {DISPLAY_PRICE[cycle]}
                  </span>
                  <span className={`text-[11px] ${selected ? 'text-[#0F9D94]' : 'text-slate-500'}`}>
                    {t.subscribe.currency} {t.subscribe.perPeriod[cycle]}
                  </span>
                  {selected && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#0F9D94]">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Branch Count ── */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
          <h2 className={`mb-4 text-[13px] font-bold uppercase tracking-wide text-slate-500 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t.subscribe.branchCount}
          </h2>
          {/* Cards for 1–MAX_BRANCHES */}
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-5">
            {Array.from({ length: MAX_BRANCHES }, (_, i) => i + 1).map((n) => {
              const selected = safeBranches === n
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBranches(n)}
                  className={`relative flex flex-col items-center rounded-xl border-2 py-3 text-center transition-all ${
                    selected
                      ? 'border-[#0F9D94] bg-[#EAF7F4]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-lg font-extrabold leading-none ${selected ? 'text-[#0F9D94]' : 'text-slate-800'}`}>
                    {n}
                  </span>
                  {selected && (
                    <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0F9D94]">
                      <Check className="h-2 w-2 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* +/- for 11–30 */}
          <div className={`mt-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <span className="text-[13px] text-slate-500">{safeBranches > MAX_BRANCHES ? t.subscribe.branchLabel(safeBranches) : ''}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBranches((b) => Math.max(MIN_BRANCHES, b - 1))}
                disabled={safeBranches <= MIN_BRANCHES}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-30"
              >
                −
              </button>
              <span className="min-w-[3ch] text-center text-[15px] font-extrabold text-slate-900">{safeBranches}</span>
              <button
                type="button"
                onClick={() => setBranches((b) => Math.min(ABS_MAX, b + 1))}
                disabled={safeBranches >= ABS_MAX}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ── Order Summary + CTA ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[13px] font-bold text-slate-500">{t.subscribe.totalLabel}</span>
            <div className={`flex items-baseline gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-3xl font-extrabold text-slate-900">{totalPrice.toLocaleString()}</span>
              <span className="text-sm font-bold text-slate-500">{t.subscribe.currency} {t.subscribe.perPeriod[billing]}</span>
            </div>
          </div>
          <p className={`mt-1 text-[12px] text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t.subscribe.branchLabel(safeBranches)} · {t.clientPages.billing.billingCycles[billing]}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#159A8C] px-4 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#13897d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.subscribe.processing}
              </>
            ) : (
              t.subscribe.continue
            )}
          </button>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            {/* Display only — backend is source of truth for final amount */}
            {isRTL
              ? 'المبلغ النهائي يُحسب على الخادم. سيظهر مبلغ الدفع الفعلي في صفحة الدفع.'
              : 'Final amount is calculated server-side. The exact charge will appear on the payment screen.'}
          </p>
        </div>
      </div>
    </div>
  )
}
