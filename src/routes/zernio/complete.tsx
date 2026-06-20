import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, Loader2, MapPin, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.png'
import LocaleToggle from '../../components/UI/LocaleToggle'
import { useLocale } from '../../contexts/LocaleContext'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/zernio/complete')({
  component: ZernioCompletePage,
})

type Envelope<T> = { data: T }
type ProviderLocation = { locationId: string }

function ZernioCompletePage() {
  const { dir, isRTL } = useLocale()
  const navigate = useNavigate()
  const started = useRef(false)
  const [status, setStatus] = useState<'working' | 'success' | 'error'>('working')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (started.current) return
    started.current = true

    const connectionToken = new URLSearchParams(window.location.search).get(
      'connectionToken',
    )

    if (!connectionToken) {
      setMessage(
        isRTL
          ? 'رمز إكمال الربط غير موجود. ابدأ ربط الموقع مرة أخرى.'
          : 'The connection token is missing. Please start connecting the location again.',
      )
      setStatus('error')
      return
    }

    const complete = async () => {
      try {
        const response = await apiRequest<
          Envelope<{ locations: ProviderLocation[] }>
        >(
          `/zernio/google-business/locations?connectionToken=${encodeURIComponent(connectionToken)}`,
        )
        const locations = response.data?.locations ?? []

        if (locations.length === 1) {
          await apiRequest('/zernio/google-business/select-location', {
            method: 'POST',
            body: {
              connectionToken,
              locationId: locations[0].locationId,
            },
          })
          setStatus('success')
          setTimeout(() => {
            void navigate({
              to: '/ClientDashboard/Accounts',
              search: { connected: '1' } as never,
            })
          }, 900)
          return
        }

        if (locations.length > 1) {
          void navigate({
            to: '/ClientDashboard/Accounts',
            search: { connectionToken } as never,
          })
          return
        }

        throw new Error('No Google Business locations were returned.')
      } catch (error) {
        const rawMessage =
          error instanceof Error ? error.message : ''
        const safeMessage =
          rawMessage.includes('E11000') ||
          rawMessage.toLowerCase().includes('duplicate key')
            ? isRTL
              ? 'تعذر حفظ الموقع بسبب تعارض مؤقت في البيانات. حدّث الصفحة للمحاولة مرة أخرى.'
              : 'The location could not be saved because of a temporary data conflict. Refresh the page to retry.'
            : rawMessage
        setMessage(
          safeMessage
            ? safeMessage
            : isRTL
              ? 'تعذر إكمال ربط الموقع.'
              : 'Could not complete the location connection.',
        )
        setStatus('error')
      }
    }

    void complete()
  }, [isRTL, navigate])

  return (
    <main
      dir={dir}
      className="flex min-h-screen flex-col items-center bg-[#F4FAF8] px-4 py-8"
    >
      <div className="mb-8 flex w-full max-w-md items-center justify-between">
        <img src={logo} alt="Bariq AI" className="h-auto w-[90px]" />
        <LocaleToggle />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-9 text-center shadow-lg">
        {status === 'working' ? (
          <>
            <Loader2 className="mx-auto h-14 w-14 animate-spin text-teal-600" />
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">
              {isRTL ? 'جاري حفظ موقعك' : 'Saving your location'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isRTL
                ? 'نستورد بيانات النشاط والموقع والتقييمات الحقيقية من Google.'
                : 'We are importing the real business, location, and review data from Google.'}
            </p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 className="mx-auto h-16 w-16 text-teal-600" />
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">
              {isRTL ? 'تم ربط الموقع بنجاح' : 'Location connected successfully'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isRTL
                ? 'سيتم نقلك الآن إلى صفحة المواقع.'
                : 'Taking you to your Locations page now.'}
            </p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">
              {isRTL ? 'تعذر إكمال الربط' : 'Could not complete connection'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            <button
              type="button"
              onClick={() =>
                void navigate({ to: '/ClientDashboard/Accounts' })
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white"
            >
              <MapPin className="h-4 w-4" />
              {isRTL ? 'العودة إلى المواقع' : 'Back to Locations'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}
