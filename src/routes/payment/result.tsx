import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, Receipt, GitBranch, CalendarDays, Banknote } from 'lucide-react'
import logo from '../../assets/logo.png'
import { useLocale } from '../../contexts/LocaleContext'
import LocaleToggle from '../../components/UI/LocaleToggle'
import { verifyCharge, getBillingMe, type VerifyResult, type Subscription } from '../../services/paymentServices'

export const Route = createFileRoute('/payment/result')({
  component: PaymentResultPage,
})

const POLL_INTERVAL_MS = 3000
const MAX_POLLS = 20 // 60 seconds total

function PaymentResultPage() {
  const { t, dir, isRTL } = useLocale()

  const params = new URLSearchParams(window.location.search)
  const tapId = params.get('tap_id')

  const [result, setResult] = useState<VerifyResult | null>(null)
  const [chargeId, setChargeId] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  const pollCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settled = useRef(false)

  // ── History-safe navigation helpers ─────────────────────────────────────────
  // Tap's hosted checkout adds an unknown number of history entries internally
  // (its own redirects). A fixed history.go(-2) would land inside Tap's chain,
  // not on our page. Instead we record history.length before entering Tap and
  // compute the exact step count here.
  //
  // Technique:
  //   1. /subscribe or /checkout stored 'bariq_ppr_origin_length' = history.length
  //      before pushing the Tap URL.
  //   2. stepsBack = current history.length − originLength (= Tap entries + /result)
  //   3. Set 'bariq_ppr' and call history.go(-stepsBack) — lands on /subscribe
  //      or /checkout regardless of how many entries Tap added.
  //   4. That page detects 'bariq_ppr' on mount and calls replace(target),
  //      which removes all forward entries (Tap chain + /result) in one shot.
  //   Result: [..., /ClientDashboard/Billing] — Tap is fully gone.
  const navigateAfterSuccess = () => {
    const target = '/ClientDashboard/Billing'
    const flow = sessionStorage.getItem('bariq_flow')
    sessionStorage.removeItem('bariq_flow')
    const originLengthStr = sessionStorage.getItem('bariq_ppr_origin_length')
    sessionStorage.removeItem('bariq_ppr_origin_length')

    if ((flow === 'subscribe' || flow === 'checkout') && originLengthStr) {
      const stepsBack = window.history.length - parseInt(originLengthStr, 10)
      if (stepsBack > 0) {
        sessionStorage.setItem('bariq_ppr', target)
        window.history.go(-stepsBack)
        return
      }
    }
    // Fallback: no origin recorded or stepsBack ≤ 0 — replace /result directly
    window.location.replace(target)
  }

  const navigateAfterFailure = (target: string) => {
    sessionStorage.removeItem('bariq_flow')
    window.location.replace(target)
  }

  useEffect(() => {
    // Replace current history entry in place — normalises the URL and prevents
    // the result page from appearing as a distinct "back" step within our own
    // history (the real Tap-removal work is done by navigateAfterSuccess).
    window.history.replaceState(null, '', window.location.href)

    if (!tapId) {
      setResult('not_found')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = `/Login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
      return
    }

    const poll = async () => {
      if (settled.current) return
      try {
        const data = await verifyCharge(tapId)
        setChargeId(data.chargeId)

        if (data.result === 'pending_verification') {
          pollCount.current += 1
          if (pollCount.current >= MAX_POLLS) {
            settled.current = true
            setTimedOut(true)
            setResult('pending_verification')
            return
          }
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        } else {
          settled.current = true
          setResult(data.result)
          // On success, fetch subscription details to display in the receipt
          if (data.result === 'success') {
            try {
              const billing = await getBillingMe()
              if (billing.subscription) setSubscription(billing.subscription)
            } catch {
              // Non-fatal — receipt details are optional
            }
          }
        }
      } catch (err) {
        settled.current = true
        setError(err instanceof Error ? err.message : 'Unknown error')
        setResult('not_paid')
      }
    }

    poll()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [tapId])

  // ── Loading / verifying ────────────────────────────────────────────────────
  if (result === null || result === 'pending_verification') {
    // timedOut = true means we stopped polling after MAX_POLLS; payment status
    // is still unknown. Show a clear message instead of an infinite spinner.
    if (timedOut) {
      return (
        <Shell dir={dir}>
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
              <Loader2 className="h-10 w-10 text-amber-400" />
            </div>
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">
              {isRTL ? 'جارٍ التحقق — يستغرق وقتاً أطول من المعتاد' : 'Still verifying — taking longer than usual'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isRTL
                ? 'لم نتلقَّ تأكيداً من بوابة الدفع بعد. إذا تم خصم المبلغ من بطاقتك، ستُفعَّل خدمتك فور وصول التأكيد.'
                : "We haven't received confirmation from the payment gateway yet. If your card was charged, your subscription will activate automatically once confirmation arrives."}
            </p>
            <div className={`mt-6 flex w-full flex-col gap-3 ${isRTL ? 'items-end' : 'items-start'}`}>
              <button
                type="button"
                onClick={() => navigateAfterSuccess()}
                className="w-full rounded-xl bg-[#159A8C] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#13897d]"
              >
                {t.payment.result.goToDashboard}
              </button>
              <button
                type="button"
                onClick={() => { window.location.reload() }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                {isRTL ? 'تحديث الصفحة' : 'Refresh page'}
              </button>
            </div>
          </div>
        </Shell>
      )
    }

    return (
      <Shell dir={dir}>
        <div className="flex flex-col items-center py-8 text-center">
          <Loader2 className="h-14 w-14 animate-spin text-[#0F9D94]" />
          <h1 className="mt-5 text-xl font-extrabold text-slate-900">{t.payment.result.verifying}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.payment.result.pendingMessage}</p>
        </div>
      </Shell>
    )
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (result === 'success') {
    return (
      <Shell dir={dir}>
        {/* Icon */}
        <div className="flex flex-col items-center pb-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF7F4]">
            <CheckCircle2 className="h-10 w-10 text-[#0F9D94]" strokeWidth={2} />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">{t.payment.result.success}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{t.payment.result.successMessage}</p>
        </div>

        {/* Receipt card */}
        {subscription && (
          <div className="mb-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-[#F8FCFB] overflow-hidden">
            <ReceiptRow
              icon={<CalendarDays className="h-4 w-4 text-[#0F9D94]" />}
              label={t.payment.result.periodLabel}
              value={t.clientPages.billing.billingCycles[subscription.billingCycle]}
              isRTL={isRTL}
            />
            <ReceiptRow
              icon={<GitBranch className="h-4 w-4 text-[#0F9D94]" />}
              label={t.payment.result.branchesLabel}
              value={t.clientPages.billing.planBranches(subscription.branchesCount)}
              isRTL={isRTL}
            />
            <ReceiptRow
              icon={<Banknote className="h-4 w-4 text-[#0F9D94]" />}
              label={t.payment.result.amountLabel}
              value={`${subscription.amount.toLocaleString()} ${subscription.currency}`}
              isRTL={isRTL}
            />
            {chargeId && (
              <ReceiptRow
                icon={<Receipt className="h-4 w-4 text-slate-400" />}
                label={t.payment.result.transactionRef}
                value={chargeId}
                mono
                isRTL={isRTL}
              />
            )}
          </div>
        )}

        {/* If we couldn't load subscription details but have chargeId */}
        {!subscription && chargeId && (
          <div className={`mb-6 rounded-xl border border-slate-200 bg-[#F8FCFB] px-4 py-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-[11px] font-medium text-slate-500">{t.payment.result.transactionRef}</p>
            <p className="mt-0.5 font-mono text-[13px] text-slate-700 break-all">{chargeId}</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigateAfterSuccess()}
          className="w-full rounded-xl bg-[#159A8C] px-4 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#13897d]"
        >
          {t.payment.result.goToDashboard}
        </button>
      </Shell>
    )
  }

  // ── Failure / not found ────────────────────────────────────────────────────
  return (
    <Shell dir={dir}>
      <div className="flex flex-col items-center pb-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-10 w-10 text-red-500" strokeWidth={2} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900">{t.payment.result.failed}</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {error ? sanitiseError(error) : t.payment.result.failedMessage}
        </p>
      </div>

      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={() => navigateAfterFailure('/subscribe')}
          className="flex-1 rounded-xl bg-[#159A8C] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#13897d]"
        >
          {t.payment.result.retryPayment}
        </button>
        <button
          type="button"
          onClick={() => navigateAfterFailure('/ClientDashboard/Billing')}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
        >
          {t.payment.result.backToBilling}
        </button>
      </div>
    </Shell>
  )
}

// ── Shell layout ──────────────────────────────────────────────────────────────

function Shell({
  children,
  dir,
}: {
  children: React.ReactNode
  dir: 'ltr' | 'rtl'
}) {
  return (
    <div dir={dir} className="flex min-h-screen flex-col items-center bg-[#F4FAF8] px-4 py-8 sm:px-6">
      {/* Top bar */}
      <div className="mb-8 flex w-full max-w-md items-center justify-between">
        <img src={logo} alt="Bariq AI" className="h-auto w-[90px] object-contain" />
        <LocaleToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        {children}
      </div>
    </div>
  )
}

// ── Receipt row ───────────────────────────────────────────────────────────────

function ReceiptRow({
  icon,
  label,
  value,
  mono = false,
  isRTL,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
  isRTL: boolean
}) {
  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-2 text-[13px] text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {icon}
        <span>{label}</span>
      </div>
      <span className={`text-[13px] font-semibold text-slate-800 ${mono ? 'font-mono text-[11px] text-slate-500 break-all text-right max-w-[55%]' : ''}`}>
        {value}
      </span>
    </div>
  )
}

// Strip internal error details before showing to user
function sanitiseError(msg: string): string {
  if (msg.includes('403')) return 'You do not have access to verify this payment.'
  if (msg.includes('404')) return 'Payment record not found.'
  if (msg.includes('401')) return 'Your session has expired. Please log in again.'
  return 'Your payment could not be verified. Please contact support if your card was charged.'
}
