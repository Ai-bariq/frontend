import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Loader2, XCircle } from 'lucide-react'
import { useLocale } from '../contexts/LocaleContext'
import { createCheckout, type BillingCycle } from '../services/paymentServices'
import { isAuthenticated } from '../utils/auth'

export const Route = createFileRoute('/checkout')({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/Login',
        search: { redirect: location.href },
      })
    }
  },
  component: CheckoutPage,
})

function CheckoutPage() {
  const { t, dir } = useLocale()
  const [error, setError] = useState<string | null>(null)
  // Prevent re-firing on Back navigation or React Strict Mode double-invoke
  const hasFired = useRef(false)

  useEffect(() => {
    // Post-payment history cleanup: result.tsx called history.go(-2) to land back
    // here so replace() strips Tap + /result from the forward stack in one shot.
    const ppr = sessionStorage.getItem('bariq_ppr')
    if (ppr) {
      sessionStorage.removeItem('bariq_ppr')
      window.location.replace(ppr)
      return
    }

    if (hasFired.current) return
    hasFired.current = true

    const params = new URLSearchParams(window.location.search)

    // Parse and validate params before sending to backend
    const billingCycle = (params.get('billingCycle') ?? 'monthly') as BillingCycle
    const rawBranches = params.get('branchesCount')
    const branchesCount = rawBranches ? parseInt(rawBranches, 10) : 1

    if (!branchesCount || branchesCount < 1 || branchesCount > 30) {
      setError(`Invalid branch count: ${rawBranches ?? '(missing)'}. Please go back and try again.`)
      return
    }

    const body = { branchesCount, billingCycle }

    // Log in development so the request body is visible in the console
    if (import.meta.env.DEV) {
      console.log('[Checkout] POST /payments/create-checkout body:', JSON.stringify(body))
    }

    createCheckout(body)
      .then((data) => {
        if (data.paymentUrl) {
          sessionStorage.setItem('bariq_flow', 'checkout')
          // Record history depth so result.tsx can compute exact steps back,
          // regardless of how many entries Tap adds internally.
          sessionStorage.setItem('bariq_ppr_origin_length', String(window.history.length))
          window.location.href = data.paymentUrl
        } else {
          setError('No payment URL received. Please try again.')
        }
      })
      .catch((err) => {
        // Expired or invalid token — clear it and redirect to Login with intent
        if (err instanceof Error && err.message.includes('401')) {
          localStorage.removeItem('user')
          const checkoutPath = `/checkout?${params.toString()}`
          window.location.href = `/Login?redirect=${encodeURIComponent(checkoutPath)}`
          return
        }
        setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.')
      })
  }, [])

  return (
    <div dir={dir} className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        {error ? (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4 text-sm text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
            >
              {t.payment.result.backToBilling}
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-slate-400" />
            <p className="mt-4 text-sm text-slate-500">{t.payment.result.verifying}</p>
          </>
        )}
      </div>
    </div>
  )
}
