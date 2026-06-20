import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CalendarDays, Globe, Link2, PlugZap } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/ClientDashboard/Accounts')({
  component: AccountsPage,
})

type ListingStatus = 'pending_connection' | 'connected' | 'reconnect_required' | 'disconnected' | 'disabled'

type Listing = {
  _id: string
  provider: string
  platform: string
  businessName?: string
  locationName?: string
  status: ListingStatus
  connectedAt?: string
  lastSyncAt?: string
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const STATUS_STYLE: Record<ListingStatus, string> = {
  connected: 'bg-teal-600 text-white',
  pending_connection: 'bg-slate-100 text-slate-600',
  reconnect_required: 'bg-amber-50 text-amber-700',
  disconnected: 'bg-rose-50 text-rose-600',
  disabled: 'bg-slate-100 text-slate-500',
}

function AccountsPage() {
  const { t, dir, isRTL } = useLocale()
  const p = t.clientPages.accounts
  const textAlign = isRTL ? 'text-right' : 'text-left'

  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        const res = await apiRequest<{ data: Listing[] }>('/listings/', { token })
        setListings((res as any).data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  function getStatusLabel(status: ListingStatus) {
    if (status === 'connected') return p.statusConnected
    if (status === 'reconnect_required') return p.statusReconnectRequired
    if (status === 'disconnected') return p.statusDisconnected
    return status
  }

  return (
    <section dir={dir} className="min-h-[calc(100vh-80px)] bg-white">
      <div className="px-6 py-8">
        <header className={`mb-8 ${textAlign}`}>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{p.title}</h1>
          <p className="mt-2 text-base text-slate-500">{p.subtitle}</p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-5 w-5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="ml-3 text-sm text-slate-400">{p.loading}</span>
          </div>
        ) : error ? (
          <p className={`py-10 text-center text-sm text-red-500 ${textAlign}`}>{error}</p>
        ) : listings.length === 0 ? (
          <div className={`rounded-2xl border border-dashed border-slate-200 px-6 py-16 ${textAlign}`}>
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              <Globe className="h-10 w-10 text-slate-300" />
              <p className="mt-4 font-bold text-slate-700">{p.noListings}</p>
              <p className="mt-1 text-sm text-slate-400">{p.noListingsSubtitle}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <article
                key={listing._id}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
              >
                <div className={`flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between ${isRTL ? '' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex flex-1 items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''} ${textAlign}`}>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                      <Globe className="h-6 w-6 text-slate-700" />
                    </div>

                    <div className={`flex min-w-0 flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                      <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[listing.status]}`}>
                          <PlugZap className="h-3.5 w-3.5" />
                          {getStatusLabel(listing.status)}
                        </span>
                        <h2 className="text-lg font-extrabold text-slate-900">
                          {listing.businessName || listing.locationName || listing.platform}
                        </h2>
                      </div>

                      {listing.locationName && listing.businessName && (
                        <p className={`mt-1 text-sm text-slate-500 ${textAlign}`}>{listing.locationName}</p>
                      )}

                      <p className={`mt-3 text-base font-extrabold text-slate-900 ${textAlign}`}>
                        {p.googleProfile}
                      </p>

                      <div className={`mt-3 space-y-1.5 text-sm text-slate-500 ${textAlign}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                          <Link2 className="h-4 w-4 text-slate-400" />
                          <span>{p.locationsImported(1)}</span>
                        </div>
                        {listing.connectedAt && (
                          <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            <span>{p.connected}: {formatDate(listing.connectedAt)}</span>
                          </div>
                        )}
                        {listing.lastSyncAt && (
                          <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            <span>{p.lastSync}: {formatDate(listing.lastSyncAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
