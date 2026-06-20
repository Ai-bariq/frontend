import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { MailCheck } from 'lucide-react'
import logo from '../assets/logo.png'
import LocaleToggle from '../components/UI/LocaleToggle'
import { resendSignupOtp, verifySignupOtp } from '../services/authServices'
import { isAuthenticated } from '../utils/auth'

export const Route = createFileRoute('/VerifyEmail')({
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: '/ClientDashboard' })
  },
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === 'string' ? search.email : '',
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const router = useRouter()
  const { email, redirect: redirectTo } = Route.useSearch()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  if (!email) {
    window.location.replace('/Register')
    return null
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      setError('أدخل رمز التحقق المكوّن من 6 أرقام.')
      return
    }
    try {
      setSubmitting(true)
      setError('')
      const response: any = await verifySignupOtp({ email, otp })
      localStorage.setItem('user', JSON.stringify(response.data.user))
      const target =
        redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
          ? redirectTo
          : '/ClientDashboard'
      await router.navigate({ href: target, replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'تعذر التحقق من الرمز.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#F4FAF8] px-4">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-right shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <img src={logo} alt="Bariq AI" className="h-12 w-auto" />
          <LocaleToggle />
        </div>
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <MailCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">تحقق من بريدك الإلكتروني</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          أرسلنا رمزاً مكوّناً من 6 أرقام إلى <span dir="ltr" className="font-bold">{email}</span>.
          لن يتم إنشاء الحساب قبل إدخال الرمز الصحيح.
        </p>
        <form onSubmit={submit} className="mt-6">
          <label className="mb-2 block text-sm font-bold text-slate-800">رمز التحقق</label>
          <input
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            dir="ltr"
            className="h-14 w-full rounded-xl border border-slate-200 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 h-12 w-full rounded-xl bg-teal-600 font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {submitting ? 'جاري التحقق...' : 'تحقق وأنشئ الحساب'}
          </button>
        </form>
        <button
          type="button"
          disabled={resending}
          onClick={async () => {
            try {
              setResending(true)
              setError('')
              await resendSignupOtp(email)
            } catch (requestError) {
              setError(requestError instanceof Error ? requestError.message : 'تعذر إعادة إرسال الرمز.')
            } finally {
              setResending(false)
            }
          }}
          className="mt-4 w-full text-sm font-bold text-teal-700 disabled:opacity-60"
        >
          {resending ? 'جاري إعادة الإرسال...' : 'إعادة إرسال الرمز'}
        </button>
        <p className="mt-5 text-xs leading-6 text-slate-500">
          تنتهي صلاحية الرمز بعد 10 دقائق. للدعم:
          {' '}<a className="text-teal-700" href="mailto:rah@bariqai.io">rah@bariqai.io</a>
        </p>
      </section>
    </main>
  )
}
