import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import { getAuditReplies, type AuditReply } from '../../services/reviewReplyServices'

export const Route = createFileRoute('/AdminDashboard/DeletedResponse')({
  component: DeletedResponsesPage,
})

type SortOption = 'latest' | 'oldest'
const PAGE_SIZE = 100

function getDateValue(iso: string) {
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? 0 : t
}

function DeletedResponsesPage() {
  const { t, dir, isRTL } = useLocale()
  const p = t.adminPages.deletedResponses
  const textAlign = isRTL ? 'text-right' : 'text-left'

  const [replies, setReplies] = useState<AuditReply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const toggleExpanded = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        const res = await getAuditReplies({
          status: 'deleted',
          page,
          limit: PAGE_SIZE,
        }, token)
        if (cancelled) return
        setReplies(res.data.replies)
        setTotal(res.data.total)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [page])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const matched = q
      ? replies.filter((r) => {
          const review = typeof r.reviewId === 'object' ? r.reviewId : null
          return (
            r._id.toLowerCase().includes(q) ||
            (r.client?.name ?? '').toLowerCase().includes(q) ||
            (r.client?.email ?? '').toLowerCase().includes(q) ||
            (review?.comment ?? '').toLowerCase().includes(q) ||
            (r.finalText ?? '').toLowerCase().includes(q)
          )
        })
      : replies

    return [...matched].sort((a, b) =>
      sortBy === 'latest'
        ? getDateValue(b.updatedAt) - getDateValue(a.updatedAt)
        : getDateValue(a.updatedAt) - getDateValue(b.updatedAt)
    )
  }, [replies, search, sortBy])

  return (
    <section dir={dir} className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto w-[90%] max-w-none space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${isRTL ? '' : 'flex-row-reverse'}`}>
            <div className={textAlign}>
              <h1 className="text-2xl font-extrabold text-slate-900">{p.title}</h1>
              <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
            </div>
            <div className={`flex w-full flex-col gap-3 lg:w-auto ${isRTL ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={p.searchPlaceholder}
                className={`w-full rounded-xl border border-slate-200 px-4 py-2.5 ${textAlign} text-sm outline-none focus:border-slate-400 lg:w-[380px]`}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="latest">{p.sort.latest}</option>
                <option value="oldest">{p.sort.oldest}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className={`w-full min-w-[1000px] table-fixed ${textAlign} text-base`}>
            <thead className="bg-slate-100">
              <tr className="text-sm font-semibold text-slate-700">
                <th className="w-[12%] px-2 py-3">{p.table.reviewId}</th>
                <th className="w-[14%] px-2 py-3">{p.table.clientName}</th>
                <th className="w-[18%] px-2 py-3">{p.table.email}</th>
                <th className="w-[28%] px-2 py-3">{p.table.review}</th>
                <th className="w-[28%] px-2 py-3">{p.table.deletedResponse}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-red-500">{error}</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">{p.table.noResults}</td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const review = typeof item.reviewId === 'object' ? item.reviewId : null
                  const isExpanded = expandedRows.has(item._id)

                  return (
                    <tr key={item._id} className="border-t border-slate-100 align-top text-sm text-slate-700">
                      <td className="truncate whitespace-nowrap px-2 py-3 font-medium text-slate-900">
                        {item._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="truncate whitespace-nowrap px-2 py-3 font-medium text-slate-900">
                        {item.client?.name ?? '—'}
                      </td>
                      <td className="truncate px-2 py-3 text-slate-600">
                        {item.client?.email ?? '—'}
                      </td>
                      <td
                        className="px-2 py-3 leading-6 text-slate-700 cursor-pointer select-none"
                        onClick={() => toggleExpanded(item._id)}
                      >
                        <p className={`break-words ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                          {review?.comment ?? '—'}
                        </p>
                      </td>
                      <td
                        className="px-2 py-3 leading-6 text-slate-900 cursor-pointer select-none"
                        onClick={() => toggleExpanded(item._id)}
                      >
                        <p className={`break-words ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                          {item.finalText ?? '—'}
                        </p>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3">
            <span className="text-sm text-slate-500">
              {t.adminPages.clients.pageOf(page, totalPages)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || isLoading}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.adminPages.clients.prev}
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages || isLoading}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.adminPages.clients.next}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
