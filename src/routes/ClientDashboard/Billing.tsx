import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  CalendarDays,
  CreditCard,
  Receipt,
  AlertTriangle,
  RefreshCw,
  X,
  Loader2,
} from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import {
  getBillingMe,
  cancelSubscription,
  retryPayment,
  type BillingData,
  type SubscriptionStatus,
  type PaymentStatus,
  type AttemptType,
} from '../../services/paymentServices'

export const Route = createFileRoute('/ClientDashboard/Billing')({
  component: BillingPage,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatAmount(amount: number, currency: string) {
  return `${amount.toLocaleString()} ${currency}`
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<SubscriptionStatus, string> = {
  active: 'bg-teal-600 text-white',
  past_due: 'bg-amber-500 text-white',
  cancelled: 'bg-slate-500 text-white',
  expired: 'bg-red-500 text-white',
  pending: 'bg-slate-400 text-white',
}

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
  paid: 'bg-teal-100 text-teal-700',
  failed: 'bg-red-100 text-red-700',
  initiated: 'bg-slate-100 text-slate-600',
}

// ─── Cancel modal ─────────────────────────────────────────────────────────────

function CancelModal({
  periodEnd,
  onConfirm,
  onClose,
  loading,
}: {
  periodEnd: string
  onConfirm: () => void
  onClose: () => void
  loading: boolean
}) {
  const { t, dir, isRTL } = useLocale()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" dir={dir}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-lg font-extrabold text-slate-900">{t.clientPages.billing.cancelConfirmTitle}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className={`mt-3 text-sm text-slate-500 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t.clientPages.billing.cancelConfirmMessage(formatDate(periodEnd))}
        </p>
        <div className={`mt-6 flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
          >
            {t.clientPages.billing.cancelKeepButton}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : t.clientPages.billing.cancelConfirmButton}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function Banner({ message, variant }: { message: string; variant: 'warning' | 'error' | 'info' | 'success' }) {
  const styles = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-teal-50 border-teal-200 text-teal-800',
  }
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium mb-4 ${styles[variant]}`}>
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function BillingPage() {
  const { t, dir, isRTL } = useLocale()
  const textAlign = isRTL ? 'text-right' : 'text-left'

  const [billing, setBilling] = useState<BillingData | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [retryLoading, setRetryLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const fetchBilling = async () => {
    setLoadError(null)
    try {
      const data = await getBillingMe()
      setBilling(data)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t.clientPages.billing.loadingError)
    }
  }

  useEffect(() => { fetchBilling() }, [])

  const handleCancel = async () => {
    setCancelLoading(true)
    try {
      await cancelSubscription()
      setActionMessage(t.clientPages.billing.cancelSuccess)
      setShowCancelModal(false)
      await fetchBilling()
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setCancelLoading(false)
    }
  }

  const handleRetry = async () => {
    setRetryLoading(true)
    setActionMessage(null)
    try {
      await retryPayment()
      setActionMessage(t.clientPages.billing.cancelSuccess)
      await fetchBilling()
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setRetryLoading(false)
    }
  }

  const sub = billing?.subscription
  const status = sub?.status as SubscriptionStatus | undefined

  const billingCycleLabel = (cycle: string) => {
    const map: Record<string, string> = {
      monthly: t.clientPages.billing.billingCycles.monthly,
      quarterly: t.clientPages.billing.billingCycles.quarterly,
      yearly: t.clientPages.billing.billingCycles.yearly,
    }
    return map[cycle] ?? cycle
  }

  const subStatusLabel = (s: string) => {
    const map = t.clientPages.billing.subscriptionStatus as Record<string, string>
    return map[s] ?? s
  }

  const paymentStatusLabel = (s: string) => {
    const map = t.clientPages.billing.paymentStatusLabel as Record<string, string>
    return map[s] ?? s
  }

  const attemptLabel = (s: string) => {
    const map = t.clientPages.billing.attemptTypeLabel as Record<string, string>
    return map[s] ?? s
  }

  return (
    <section dir={dir} className="min-h-[calc(100vh-80px)] bg-white">
      {showCancelModal && sub && (
        <CancelModal
          periodEnd={sub.currentPeriodEnd}
          onConfirm={handleCancel}
          onClose={() => setShowCancelModal(false)}
          loading={cancelLoading}
        />
      )}

      <div className="px-6 py-8">
        <header className={`mb-6 ${textAlign}`}>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{t.clientPages.billing.title}</h1>
          <p className="mt-2 text-base text-slate-500">{t.clientPages.billing.subtitle}</p>
        </header>

        {/* Action message */}
        {actionMessage && (
          <Banner message={actionMessage} variant="success" />
        )}

        {/* Load error */}
        {loadError && (
          <Banner message={loadError} variant="error" />
        )}

        {/* Skeleton while loading */}
        {!billing && !loadError && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        )}

        {billing && (
          <>
            {/* Status banners */}
            {status === 'past_due' && (
              <Banner message={t.clientPages.billing.pastDueBanner} variant="warning" />
            )}
            {status === 'expired' && (
              <Banner message={t.clientPages.billing.expiredBanner} variant="error" />
            )}
            {status === 'pending' && (
              <Banner message={t.clientPages.billing.pendingBanner} variant="info" />
            )}
            {status === 'cancelled' && (
              <Banner message={t.clientPages.billing.cancelledBanner} variant="info" />
            )}
            {status === 'active' && sub?.cancelAtPeriodEnd && (
              <Banner
                message={t.clientPages.billing.cancelAtPeriodEndBanner(formatDate(sub.currentPeriodEnd))}
                variant="info"
              />
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Current plan card */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={textAlign}>
                    <h2 className="text-xl font-extrabold text-slate-900">{t.clientPages.billing.currentPlan}</h2>
                  </div>
                  {status && (
                    <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-extrabold ${STATUS_STYLE[status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {subStatusLabel(status)}
                    </span>
                  )}
                </div>

                {sub ? (
                  <div className={`mt-4 space-y-2 ${textAlign}`}>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {formatAmount(sub.amount, sub.currency)}
                      <span className="ml-1 text-sm font-medium text-slate-400">/ {billingCycleLabel(sub.billingCycle)}</span>
                    </p>
                    <p className="text-sm text-slate-500">{t.clientPages.billing.planBranches(sub.branchesCount)}</p>
                    {sub.currentPeriodEnd && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="h-4 w-4" />
                        <span>{t.clientPages.billing.periodEnds}: {formatDate(sub.currentPeriodEnd)}</span>
                      </div>
                    )}

                    <div className={`mt-4 flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                      {status === 'active' && !sub.cancelAtPeriodEnd && (
                        <button
                          type="button"
                          onClick={() => setShowCancelModal(true)}
                          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-extrabold text-red-600 transition hover:bg-red-50"
                        >
                          {t.clientPages.billing.cancelSubscription}
                        </button>
                      )}
                      {status === 'past_due' && (
                        <button
                          type="button"
                          onClick={handleRetry}
                          disabled={retryLoading}
                          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-slate-700 disabled:opacity-60"
                        >
                          {retryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                          {retryLoading ? t.clientPages.billing.retrying : t.clientPages.billing.retryPayment}
                        </button>
                      )}
                      {(status === 'cancelled' || status === 'expired' || !billing.hasSubscription) && (
                        <a
                          href="/#pricing"
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-slate-700"
                        >
                          {t.clientPages.billing.subscribeNow}
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`mt-6 ${textAlign}`}>
                    <p className="text-lg font-extrabold text-slate-700">{t.clientPages.billing.noSubscription}</p>
                    <p className="mt-1 text-sm text-slate-500">{t.clientPages.billing.noSubscriptionSubtitle}</p>
                    <a
                      href="/#pricing"
                      className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-slate-700"
                    >
                      {t.clientPages.billing.subscribeNow}
                    </a>
                  </div>
                )}
              </section>

              {/* Payment method card */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CreditCard className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
                  <div className={textAlign}>
                    <h2 className="text-xl font-extrabold text-slate-900">{t.clientPages.billing.paymentMethodCard}</h2>
                  </div>
                </div>

                {billing.paymentMethod ? (
                  <div className={`mt-4 space-y-1 ${textAlign}`}>
                    <p className="text-base font-bold text-slate-900">
                      {billing.paymentMethod.brand ? `${billing.paymentMethod.brand} ` : ''}
                      {billing.paymentMethod.last4
                        ? t.clientPages.billing.cardEnding(billing.paymentMethod.last4)
                        : billing.paymentMethod.type}
                    </p>
                    {billing.paymentMethod.expiryMonth && billing.paymentMethod.expiryYear && (
                      <p className="text-sm text-slate-500">
                        {billing.paymentMethod.expiryMonth.toString().padStart(2, '0')} / {billing.paymentMethod.expiryYear}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={`mt-4 text-sm text-slate-400 ${textAlign}`}>—</p>
                )}

                {billing.lastPayment && (
                  <div className={`mt-6 border-t border-slate-100 pt-4 space-y-1 ${textAlign}`}>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Last payment</p>
                    <p className="text-base font-extrabold text-slate-900">
                      {formatAmount(billing.lastPayment.amount, billing.lastPayment.currency)}
                    </p>
                    <p className="text-sm text-slate-500">{formatDate(billing.lastPayment.createdAt)}</p>
                    <span className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-bold ${PAYMENT_STATUS_STYLE[billing.lastPayment.status as PaymentStatus] ?? 'bg-slate-100 text-slate-600'}`}>
                      {paymentStatusLabel(billing.lastPayment.status)}
                    </span>
                  </div>
                )}
              </section>
            </div>

            {/* Payment history */}
            <div className="mt-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${textAlign}`}>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{t.clientPages.billing.paymentHistory}</h2>
                    <p className="mt-1 text-sm text-slate-500">{t.clientPages.billing.paymentHistorySubtitle}</p>
                  </div>
                </div>

                {billing.paymentHistory.length > 0 ? (
                  <div className="mt-6 space-y-3">
                    {billing.paymentHistory.map((p) => (
                      <div
                        key={p._id}
                        className={`flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`flex flex-col ${textAlign}`}>
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatAmount(p.amount, p.currency)}
                          </span>
                          <span className="text-xs text-slate-500">{formatDate(p.createdAt)}</span>
                        </div>
                        <div className={`flex flex-col items-end gap-1 ${isRTL ? 'items-start' : ''}`}>
                          <span className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-bold ${PAYMENT_STATUS_STYLE[p.status as PaymentStatus] ?? 'bg-slate-100 text-slate-600'}`}>
                            {paymentStatusLabel(p.status)}
                          </span>
                          <span className="text-xs text-slate-400">{attemptLabel(p.attemptType as AttemptType)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                      <Receipt className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold text-slate-700">{t.clientPages.billing.noInvoices}</h3>
                    <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">{t.clientPages.billing.noInvoicesSubtitle}</p>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
