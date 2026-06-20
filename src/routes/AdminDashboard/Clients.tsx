import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../../services/api'
import { useLocale } from '../../contexts/LocaleContext'

export const Route = createFileRoute('/AdminDashboard/Clients')({
  component: ClientsPage,
})

type BillingPlan = 'monthly' | 'quarterly' | 'yearly' | null

type SubStatus =
  | 'not_subscribed'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'pending'

type SubscriptionSummary = {
  status: SubStatus
  billingCycle: BillingPlan
  amount: number | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  isEntitled: boolean
}

type Client = {
  id: string
  name: string
  email: string
  phone: string | null
  isActive: boolean
  createdAt: string
  subscription: SubscriptionSummary
  branchesCount: number
  connectedListingsCount: number
  reviewsCount: number
  repliesCount: number
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

type ClientsResponse = {
  success: boolean
  clients: Client[]
  pagination: Pagination
}

const SUB_STATUS_STYLE: Record<SubStatus, string> = {
  not_subscribed: 'bg-slate-100 text-slate-500',
  active: 'bg-emerald-50 text-emerald-700',
  past_due: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-rose-50 text-rose-600',
  expired: 'bg-red-50 text-red-700',
  pending: 'bg-slate-100 text-slate-500',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ClientsPage() {
  const { t, dir, isRTL } = useLocale()
  const p = t.adminPages.clients

  const [clients, setClients] = useState<Client[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchClients = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        search: debouncedSearch,
      })
      const res = await apiRequest<ClientsResponse>(
        `/admin/clients?${params.toString()}`,
        { token },
      )
      setClients(res.clients)
      setPagination(res.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : p.errorPrefix)
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch, p.errorPrefix])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const textAlign = isRTL ? 'text-right' : 'text-left'

  function getPlanLabel(plan: BillingPlan) {
    if (!plan) return '—'
    return p.plans[plan]
  }

  function getSubLabel(status: SubStatus) {
    return p.subStatuses[status] ?? status
  }

  return (
    <section dir={dir} className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-[90%] max-w-none space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${isRTL ? '' : 'flex-row-reverse'}`}>
            <div className={textAlign}>
              <h1 className="text-2xl font-extrabold text-slate-900">{p.title}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {p.subtitle}
                {pagination && (
                  <span className="mx-2 text-slate-400">
                    ({p.totalClients(pagination.total)})
                  </span>
                )}
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={p.searchPlaceholder}
              className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 ${textAlign} text-sm outline-none focus:border-slate-400 lg:w-[320px]`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className={`w-full min-w-[1200px] table-fixed ${textAlign} text-base`}>
            <thead className="bg-slate-100">
              <tr className="text-sm font-semibold text-slate-700">
                <th className="w-[16%] px-3 py-3">{p.table.username}</th>
                <th className="w-[18%] px-3 py-3">{p.table.email}</th>
                <th className="w-[13%] px-3 py-3">{p.table.phone}</th>
                <th className="w-[12%] px-3 py-3">{p.table.subscriptionStatus}</th>
                <th className="w-[9%] px-3 py-3">{p.table.plan}</th>
                <th className="w-[8%] px-3 py-3">{p.table.branches}</th>
                <th className="w-[9%] px-3 py-3">{p.table.listings}</th>
                <th className="w-[8%] px-3 py-3">{p.table.joined}</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>{p.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                    {p.table.noResults}
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-t border-slate-100 text-sm text-slate-700">
                    <td className="truncate px-3 py-3 font-medium text-slate-900">{client.name}</td>
                    <td className="truncate px-3 py-3 text-slate-600">{client.email}</td>
                    <td className="truncate px-3 py-3 text-slate-600">{client.phone || '—'}</td>

                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${SUB_STATUS_STYLE[client.subscription.status]}`}>
                        {getSubLabel(client.subscription.status)}
                      </span>
                    </td>

                    <td className="truncate px-3 py-3 text-slate-600">
                      {getPlanLabel(client.subscription.billingCycle)}
                    </td>

                    <td className="px-3 py-3 text-center">{client.branchesCount}</td>
                    <td className="px-3 py-3 text-center">{client.connectedListingsCount}</td>

                    <td className="truncate px-3 py-3 text-slate-500 text-xs">
                      {formatDate(client.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3">
            <span className="text-sm text-slate-500">
              {p.pageOf(pagination.page, pagination.totalPages)}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={!pagination.hasPrev || isLoading}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {p.prev}
              </button>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!pagination.hasNext || isLoading}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {p.next}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
