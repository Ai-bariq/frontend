import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Building2,
  CalendarDays,
  Link2,
  LoaderCircle,
  MapPin,
  Plus,
  PlugZap,
  RefreshCw,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/ClientDashboard/Accounts')({
  component: AccountsPage,
})

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

type Branch = {
  _id: string
  businessName: string
  branchName?: string
  branchNumber: number
  address?: string
  city?: string
  country?: string
  isGoogleConnected?: boolean
  googleLocationId?: string | null
}

type Listing = {
  _id: string
  branchId?: string
  status:
    | 'pending_connection'
    | 'connected'
    | 'reconnect_required'
    | 'disconnected'
    | 'disabled'
  businessName?: string
  locationName?: string
  address?: string
  googleLocationId?: string
  accountName?: string
  connectedAt?: string
  lastSyncAt?: string
}

type GoogleLocation = {
  locationId: string
  locationName?: string | null
  businessName?: string | null
  accountName?: string | null
  address?: string | null
  category?: string | null
  storeCode?: string | null
}

type BillingData = {
  hasSubscription: boolean
  subscription: {
    branchesCount: number
    status: string
    isEntitled: boolean
  } | null
}

const LOCATION_INTENT_KEY = 'bariq:resume-location-connection'

function AccountsPage() {
  const navigate = useNavigate()
  const [branches, setBranches] = useState<Branch[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [billing, setBilling] = useState<BillingData | null>(null)
  const [locations, setLocations] = useState<GoogleLocation[]>([])
  const [connectionToken, setConnectionToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationsLoading, setLocationsLoading] = useState(false)
  const [connectingBranchId, setConnectingBranchId] = useState<string | null>(
    null,
  )
  const [selectingLocationId, setSelectingLocationId] = useState<string | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)
  const connectedSuccessfully =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('connected') === '1'

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [branchResponse, listingResponse, billingResponse] =
        await Promise.all([
          apiRequest<ApiEnvelope<Branch[]>>('/branches'),
          apiRequest<ApiEnvelope<{ listings: Listing[] }>>('/listings'),
          apiRequest<ApiEnvelope<BillingData>>('/billing/me'),
        ])

      setBranches(branchResponse.data ?? [])
      setListings(listingResponse.data?.listings ?? [])
      setBilling(billingResponse.data)
      return billingResponse.data
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'تعذر تحميل بيانات المواقع.',
      )
    } finally {
      setLoading(false)
    }
    return null
  }, [])

  const loadLocations = useCallback(async (token: string) => {
    setLocationsLoading(true)
    setError(null)
    try {
      const response = await apiRequest<
        ApiEnvelope<{ locations: GoogleLocation[] }>
      >(
        `/zernio/google-business/locations?connectionToken=${encodeURIComponent(token)}`,
      )
      setLocations(response.data?.locations ?? [])
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'تعذر تحميل مواقع Google.',
      )
    } finally {
      setLocationsLoading(false)
    }
  }, [])

  useEffect(() => {
    const initialise = async () => {
      const billingData = await loadDashboardData()
      const params = new URLSearchParams(window.location.search)
      const token = params.get('connectionToken')
      if (token) {
        setConnectionToken(token)
        void loadLocations(token)
        return
      }

      if (
        params.get('resumeLocation') === '1' &&
        billingData?.subscription?.isEntitled
      ) {
        const stored = localStorage.getItem(LOCATION_INTENT_KEY)
        if (stored) {
          localStorage.removeItem(LOCATION_INTENT_KEY)
          const intent = JSON.parse(stored) as { branchId?: string }
          void startConnection(intent.branchId)
        }
      }
    }

    void initialise()
  }, [loadDashboardData, loadLocations])

  const listingsByBranch = useMemo(
    () =>
      new Map(
        listings
          .filter((listing) => listing.branchId)
          .map((listing) => [listing.branchId as string, listing]),
      ),
    [listings],
  )

  const requestConnection = (branchId?: string) => {
    if (!billing?.subscription?.isEntitled) {
      localStorage.setItem(
        LOCATION_INTENT_KEY,
        JSON.stringify({ branchId, createdAt: new Date().toISOString() }),
      )
      void navigate({
        to: '/subscribe',
        search: { resume: 'add-location' } as never,
      })
      return
    }
    void startConnection(branchId)
  }

  const startConnection = async (branchId?: string) => {
    setConnectingBranchId(branchId || 'new')
    setError(null)
    try {
      const response = await apiRequest<
        ApiEnvelope<{ authUrl: string }>
      >('/zernio/connect/google-business', {
        method: 'POST',
        body: {
          ...(branchId ? { branchId } : {}),
          headless: true,
        },
      })
      window.location.assign(response.data.authUrl)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'تعذر بدء ربط Google Business.',
      )
      setConnectingBranchId(null)
    }
  }

  const selectLocation = async (locationId: string) => {
    if (!connectionToken) return

    setSelectingLocationId(locationId)
    setError(null)
    try {
      await apiRequest('/zernio/google-business/select-location', {
        method: 'POST',
        body: { connectionToken, locationId },
      })
      setConnectionToken(null)
      setLocations([])
      window.history.replaceState(
        {},
        '',
        window.location.pathname,
      )
      await loadDashboardData()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'تعذر حفظ الموقع المحدد.',
      )
    } finally {
      setSelectingLocationId(null)
    }
  }

  const connectedCount = listings.filter(
    (listing) => listing.status === 'connected',
  ).length
  const allowedCount = billing?.subscription?.branchesCount ?? 0

  return (
    <section dir="rtl" className="min-h-[calc(100vh-80px)] bg-white">
      <div className="px-6 py-8">
        <header className="mb-7 flex flex-col gap-4 text-right md:flex-row-reverse md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              المواقع وحسابات Google
            </h1>
            <p className="mt-2 text-base text-slate-500">
              اربط كل فرع بموقع Google Business واحفظ بياناته داخل بريق.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
              المواقع المتصلة: {connectedCount} من {allowedCount}
            </div>
            <button
              type="button"
              disabled={
                (Boolean(billing?.subscription?.isEntitled) &&
                  connectedCount >= allowedCount) ||
                connectingBranchId === 'new'
              }
              onClick={() => requestConnection()}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {connectingBranchId === 'new' ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              إضافة وربط موقع
            </button>
          </div>
        </header>

        {error ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        {connectedSuccessfully ? (
          <div className="mb-5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
            تم ربط الموقع وحفظ بياناته بنجاح. تتم مزامنة تقييمات Google تلقائياً.
          </div>
        ) : null}

        {connectionToken ? (
          <LocationPicker
            locations={locations}
            loading={locationsLoading}
            selectingLocationId={selectingLocationId}
            onSelect={selectLocation}
            onCancel={() => {
              setConnectionToken(null)
              setLocations([])
              window.history.replaceState({}, '', window.location.pathname)
            }}
          />
        ) : null}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center text-teal-600">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        ) : branches.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {branches.map((branch) => (
              <BranchConnectionCard
                key={branch._id}
                branch={branch}
                listing={listingsByBranch.get(branch._id)}
                connecting={connectingBranchId === branch._id}
                canConnect={
                  !billing?.subscription?.isEntitled ||
                  connectedCount < allowedCount ||
                  listingsByBranch.get(branch._id)?.status ===
                    'reconnect_required'
                }
                onConnect={() => requestConnection(branch._id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BranchConnectionCard({
  branch,
  listing,
  connecting,
  canConnect,
  onConnect,
}: {
  branch: Branch
  listing?: Listing
  connecting: boolean
  canConnect: boolean
  onConnect: () => void
}) {
  const connected = listing?.status === 'connected'
  const reconnect = listing?.status === 'reconnect_required'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row-reverse lg:items-center lg:justify-between">
        <div className="flex items-start gap-4 text-right">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-extrabold text-slate-900">
                {branch.branchName || `الفرع ${branch.branchNumber}`}
              </h2>
              <StatusBadge connected={connected} reconnect={reconnect} />
            </div>
            <p className="mt-1 font-bold text-slate-700">
              {listing?.businessName || branch.businessName}
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-500">
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label={
                  listing?.address ||
                  branch.address ||
                  branch.city ||
                  'لم يتم حفظ عنوان بعد'
                }
              />
              {listing?.googleLocationId ? (
                <InfoRow
                  icon={<Link2 className="h-4 w-4" />}
                  label={`Location ID: ${listing.googleLocationId}`}
                />
              ) : null}
              {listing?.connectedAt ? (
                <InfoRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label={`تم الربط: ${formatDate(listing.connectedAt)}`}
                />
              ) : null}
            </div>
          </div>
        </div>

        {!connected ? (
          <button
            type="button"
            disabled={!canConnect || connecting}
            onClick={onConnect}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {connecting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : reconnect ? (
              <RefreshCw className="h-4 w-4" />
            ) : (
              <PlugZap className="h-4 w-4" />
            )}
            {reconnect ? 'إعادة الربط' : 'ربط موقع Google'}
          </button>
        ) : null}
      </div>
    </article>
  )
}

function LocationPicker({
  locations,
  loading,
  selectingLocationId,
  onSelect,
  onCancel,
}: {
  locations: GoogleLocation[]
  loading: boolean
  selectingLocationId: string | null
  onSelect: (locationId: string) => Promise<void>
  onCancel: () => void
}) {
  return (
    <section className="mb-6 rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-slate-900">
            اختر موقع Google Business
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            سيُحفظ الموقع وحسابه وعنوانه ومعرّفاته في قاعدة بيانات بريق.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-bold text-slate-500 hover:text-slate-800"
        >
          إلغاء
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-32 items-center justify-center text-teal-600">
          <LoaderCircle className="h-7 w-7 animate-spin" />
        </div>
      ) : locations.length === 0 ? (
        <p className="mt-5 rounded-xl bg-white p-4 text-center text-sm font-bold text-slate-600">
          لم يعثر Google على مواقع متاحة لهذا الحساب.
        </p>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {locations.map((location) => (
            <button
              key={location.locationId}
              type="button"
              disabled={Boolean(selectingLocationId)}
              onClick={() => void onSelect(location.locationId)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-right transition hover:border-teal-500 hover:shadow-sm disabled:cursor-wait disabled:opacity-60"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-extrabold text-slate-900">
                  {location.locationName ||
                    location.businessName ||
                    'موقع بدون اسم'}
                </span>
                {selectingLocationId === location.locationId ? (
                  <LoaderCircle className="h-5 w-5 animate-spin text-teal-600" />
                ) : (
                  <MapPin className="h-5 w-5 text-teal-600" />
                )}
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {location.address || location.accountName || location.locationId}
              </p>
              {location.storeCode ? (
                <p className="mt-1 text-xs text-slate-400">
                  Store code: {location.storeCode}
                </p>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function StatusBadge({
  connected,
  reconnect,
}: {
  connected: boolean
  reconnect: boolean
}) {
  const label = connected ? 'متصل' : reconnect ? 'يتطلب إعادة ربط' : 'غير متصل'
  const colors = connected
    ? 'bg-teal-100 text-teal-700'
    : reconnect
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-100 text-slate-600'

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors}`}>
      {label}
    </span>
  )
}

function InfoRow({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center">
      <Building2 className="mx-auto h-10 w-10 text-slate-400" />
      <h2 className="mt-4 text-lg font-extrabold text-slate-800">
        لا توجد مواقع مرتبطة بعد
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        استخدم زر «إضافة وربط موقع» لاختيار موقع Google Business وإنشاء الفرع تلقائياً.
      </p>
    </div>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}
