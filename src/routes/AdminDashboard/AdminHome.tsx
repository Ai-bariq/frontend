import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Building2, CheckCircle2, Pencil, RefreshCw, Search, Star } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import StatusBadge from '../../components/Admin/StatusBadge'
import ConfirmModal from '../../components/Admin/ConfirmModal'
import {
  getDashboardRows,
  syncDashboardReviews,
  getDisplayStatus,
  updateReviewReplyDraft,
  approveReviewReply,
  retryReviewReplyPublish,
  createEditExistingReply,
  regenerateReviewReply,
  deletePublishedReply,
  type DashboardRow,
  type DisplayStatus,
  type ReplyStatus,
} from '../../services/reviewReplyServices'

export const Route = createFileRoute('/AdminDashboard/AdminHome')({
  component: AdminHome,
})

// ─── Types ────────────────────────────────────────────────────────────────────

type SortOption = 'latest' | 'oldest' | 'highestStars' | 'lowestStars'

/** '' = all, or a display status to filter client-side */
type StatusFilter = '' | DisplayStatus

type ModalState =
  | { kind: 'approve'; row: DashboardRow }
  | { kind: 'delete'; row: DashboardRow }
  | { kind: 'retry'; row: DashboardRow }
  | { kind: 'editExisting'; row: DashboardRow }
  | null

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shortId(id: string) {
  return id.slice(-8).toUpperCase()
}

function StarsDisplay({ value, isRTL }: { value: number; isRTL: boolean }) {
  return (
    <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-start'} gap-0.5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminHome() {
  const { t, dir, isRTL } = useLocale()
  const tr = t.reviewReplies

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const [rows, setRows] = useState<DashboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')

  // Inline edit state (only for rows that have a latestReply)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedText, setEditedText] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // Confirm modal
  const [modal, setModal] = useState<ModalState>(null)
  const [modalText, setModalText] = useState('')
  const [modalLoading, setModalLoading] = useState(false)

  // Per-row action loading (keyed by row._id)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  // Expanded rows (click review/response text to toggle)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const toggleExpanded = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  // Toast
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fetchRequestId = useRef(0)
  const syncInFlight = useRef(false)

  const showToast = (msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  // ── Fetch ───────────────────────────────────────────────────────────────────

  const fetchRows = useCallback(async (showLoading = true) => {
    const requestId = ++fetchRequestId.current

    if (showLoading) {
      setLoading(true)
      setError(null)
    }
    try {
      const res = await getDashboardRows({ limit: 100 }, token)
      if (requestId === fetchRequestId.current) {
        setRows(res.data.rows)
      }
    } catch (err: unknown) {
      if (showLoading) {
        setError(err instanceof Error ? err.message : tr.errorTitle)
      }
    } finally {
      if (showLoading && requestId === fetchRequestId.current) setLoading(false)
    }
  }, [token, tr.errorTitle])

  const synchronizeReviews = useCallback(async (showLoading = false) => {
    if (syncInFlight.current) return
    syncInFlight.current = true

    try {
      await syncDashboardReviews(token)
    } catch {
      // The dashboard remains usable with its latest persisted data.
    } finally {
      syncInFlight.current = false
      await fetchRows(showLoading)
    }
  }, [fetchRows, token])

  useEffect(() => {
    void synchronizeReviews(true)
  }, [synchronizeReviews])

  useEffect(() => {
    const reconcile = () => {
      if (document.visibilityState === 'visible') void synchronizeReviews(false)
    }
    const interval = window.setInterval(reconcile, 15 * 60_000)
    window.addEventListener('admin:refresh', reconcile)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('admin:refresh', reconcile)
    }
  }, [synchronizeReviews])

  // ── Stats ───────────────────────────────────────────────────────────────────

  const totalRows = rows.length
  // Count unique client companies whose reviews appear in this dashboard view
  const businessCount = new Set(rows.map((r) => r.clientId?.toString()).filter(Boolean)).size

  // ── Search + sort (client-side) ─────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    let base = statusFilter
      ? rows.filter((row) => getDisplayStatus(row) === statusFilter)
      : rows

    const matched = q
      ? base.filter((row) =>
          shortId(row._id).toLowerCase().includes(q) ||
          (row.latestReply && shortId(row.latestReply._id).toLowerCase().includes(q)) ||
          row.reviewerName?.toLowerCase().includes(q) ||
          row.comment?.toLowerCase().includes(q) ||
          row.latestReply?.finalText?.toLowerCase().includes(q) ||
          row.latestReply?.aiText?.toLowerCase().includes(q) ||
          row.listing?.businessName?.toLowerCase().includes(q),
        )
      : base

    return [...matched].sort((a, b) => {
      if (sortBy === 'latest') {
        const ta = a.latestReply?.createdAt ?? a.reviewCreatedAt ?? ''
        const tb = b.latestReply?.createdAt ?? b.reviewCreatedAt ?? ''
        return new Date(tb).getTime() - new Date(ta).getTime()
      }
      if (sortBy === 'oldest') {
        const ta = a.latestReply?.createdAt ?? a.reviewCreatedAt ?? ''
        const tb = b.latestReply?.createdAt ?? b.reviewCreatedAt ?? ''
        return new Date(ta).getTime() - new Date(tb).getTime()
      }
      if (sortBy === 'highestStars') return (b.rating ?? 0) - (a.rating ?? 0)
      return (a.rating ?? 0) - (b.rating ?? 0)
    })
  }, [rows, search, sortBy, statusFilter])

  // ── Format ──────────────────────────────────────────────────────────────────

  const formatDateTime = (value: string | undefined) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  // ── Inline edit ─────────────────────────────────────────────────────────────

  const startEdit = (row: DashboardRow) => {
    if (!row.latestReply) return
    setEditingId(row._id)
    setEditedText(row.latestReply.finalText ?? row.latestReply.aiText ?? '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditedText('')
  }

  const saveEdit = async (row: DashboardRow) => {
    if (!editedText.trim() || !row.latestReply) return
    setEditSaving(true)
    try {
      await updateReviewReplyDraft(row.latestReply._id, { editedText: editedText.trim() }, token)
      showToast(tr.successDraftSaved)
      setEditingId(null)
      setEditedText('')
      await fetchRows()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : tr.errorTitle)
    } finally {
      setEditSaving(false)
    }
  }

  // ── Modal helpers ───────────────────────────────────────────────────────────

  const openApprove = (row: DashboardRow) => {
    setModalText(row.latestReply?.finalText ?? row.latestReply?.aiText ?? '')
    setModal({ kind: 'approve', row })
  }

  const openDelete = (row: DashboardRow) => {
    setModal({ kind: 'delete', row })
  }

  const openRetry = (row: DashboardRow) => {
    setModal({ kind: 'retry', row })
  }

  const openEditExisting = (row: DashboardRow) => {
    // Pre-fill with the most relevant existing text
    const prefill = row.latestReply?.finalText ?? row.currentOwnerReply ?? ''
    setModalText(prefill)
    setModal({ kind: 'editExisting', row })
  }

  const closeModal = () => {
    setModal(null)
    setModalText('')
  }

  const handleModalConfirm = async () => {
    if (!modal) return
    setModalLoading(true)
    try {
      if (modal.kind === 'approve') {
        if (!modal.row.latestReply) return
        await approveReviewReply(modal.row.latestReply._id, { finalText: modalText }, token)
        showToast(tr.successApproved)
      } else if (modal.kind === 'delete') {
        const replyId = getDeletableReplyId(modal.row)
        if (!replyId) return
        await deletePublishedReply(replyId, token)
        showToast(tr.successDeleted)
      } else if (modal.kind === 'retry') {
        if (!modal.row.latestReply) return
        await retryReviewReplyPublish(modal.row.latestReply._id, token)
        showToast(tr.successRetryQueued)
      } else if (modal.kind === 'editExisting') {
        if (!modalText.trim()) {
          showToast(tr.noDraftText)
          setModalLoading(false)
          return
        }
        await createEditExistingReply(modal.row._id, { editedText: modalText.trim() }, token)
        showToast(tr.successEditExistingCreated)
      }
      closeModal()
      await fetchRows()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : tr.errorTitle)
    } finally {
      setModalLoading(false)
    }
  }

  // ── Quick actions ───────────────────────────────────────────────────────────

  const handleRegenerate = async (row: DashboardRow) => {
    const key = `regen_${row._id}`
    setActionLoading((prev) => ({ ...prev, [key]: true }))
    try {
      const response = await regenerateReviewReply(row._id, token)
      const generatedReply = response.data
      setRows((current) =>
        current.map((item) =>
          item._id === row._id
            ? {
                ...item,
                status: 'pending_approval',
                latestReply: {
                  _id: generatedReply._id,
                  type: generatedReply.type,
                  status: generatedReply.status,
                  aiText: generatedReply.aiText,
                  editedText: generatedReply.editedText,
                  finalText: generatedReply.finalText,
                  errorMessage: generatedReply.errorMessage,
                  publishAttempts: generatedReply.publishAttempts,
                  createdAt: generatedReply.createdAt,
                  updatedAt: generatedReply.updatedAt,
                },
              }
            : item,
        ),
      )
      showToast(tr.successRegenerated)
      await fetchRows(false)
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : tr.errorTitle)
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  // ── Action availability ──────────────────────────────────────────────────────

  // Column 1 — Edit (unified) + Delete (published only)
  const canEdit = (row: DashboardRow): boolean => {
    const s = row.latestReply?.status
    if (s && ['draft', 'pending_approval', 'approved', 'failed', 'published'].includes(s)) return true
    if (!s && row.hasOwnerReply) return true
    return false
  }
  const getDeletableReplyId = (row: DashboardRow): string | null => {
    if (!row.hasOwnerReply) return null
    return row.publishedReply?._id ??
      (row.latestReply?.status === 'published' ? row.latestReply._id : null)
  }
  const canDelete = (row: DashboardRow): boolean => Boolean(getDeletableReplyId(row))

  // Column 2 — Workflow: approve & publish, retry, regenerate
  const canApprove = (s: ReplyStatus) => s === 'pending_approval' || s === 'draft'
  const canRetry = (s: ReplyStatus) => s === 'failed'
  const canRegenerate = (row: DashboardRow): boolean => {
    const s = row.latestReply?.status
    if (!s) return true
    return ['draft', 'pending_approval', 'approved', 'published', 'failed', 'rejected', 'superseded'].includes(s)
  }

  /** Route Edit click: inline textarea for drafts, modal for published/existing replies */
  const handleEdit = (row: DashboardRow) => {
    const s = row.latestReply?.status
    if (s === 'published' || (!s && row.hasOwnerReply)) {
      openEditExisting(row)
    } else {
      startEdit(row)
    }
  }

  // ── Layout helpers ───────────────────────────────────────────────────────────

  const textAlign = isRTL ? 'text-right' : 'text-left'
  const searchIconSide = isRTL ? 'right-3' : 'left-3'
  const searchPadding = isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
  const editSaveAlign = isRTL ? 'justify-end' : 'justify-start'

  // Shared pill-outline button base — no fill, visible border, consistent size
  const pill = 'inline-flex items-center justify-center gap-1 rounded-full border bg-transparent px-3 py-1.5 text-xs font-medium min-w-[76px] transition disabled:opacity-40'

  // ── Status filter options ────────────────────────────────────────────────────

  const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
    { value: '', label: t.adminHome.activeStatuses },
    { value: 'pending', label: tr.statuses.pending },
    { value: 'published', label: tr.statuses.published },
    { value: 'failed', label: tr.statuses.failed },
    { value: 'deleted', label: tr.statuses.deleted },
  ]

  // ── Modal config ─────────────────────────────────────────────────────────────

  const modalConfig = modal
    ? {
        approve: {
          title: tr.confirmApproveTitle,
          desc: tr.confirmApproveText,
          confirm: tr.actions.approve,
          variant: 'default' as const,
          showTextarea: true,
          placeholder: tr.noDraftText,
        },
        delete: {
          title: tr.confirmDeleteTitle,
          desc: tr.confirmDeleteText,
          confirm: tr.actions.reject,
          variant: 'danger' as const,
          showTextarea: false,
          placeholder: '',
        },
        retry: {
          title: tr.confirmRetryTitle,
          desc: tr.confirmRetryText,
          confirm: tr.actions.retry,
          variant: 'default' as const,
          showTextarea: false,
          placeholder: '',
        },
        editExisting: {
          title: tr.actions.editExisting,
          desc: tr.confirmApproveText,
          confirm: tr.actions.saveDraft,
          variant: 'default' as const,
          showTextarea: true,
          placeholder: tr.noDraftText,
        },
      }[modal.kind]
    : null

  return (
    <section dir={dir} className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl ${isRTL ? 'left-6' : 'right-6'}`}
        >
          {toast}
        </div>
      )}

      {/* Confirm modal */}
      {modal && modalConfig && (
        <ConfirmModal
          title={modalConfig.title}
          description={modalConfig.desc}
          confirmLabel={modalConfig.confirm}
          cancelLabel={t.adminHome.table.cancel}
          variant={modalConfig.variant}
          onConfirm={handleModalConfirm}
          onCancel={closeModal}
          loading={modalLoading}
          textareaValue={modalConfig.showTextarea ? modalText : undefined}
          textareaPlaceholder={modalConfig.showTextarea ? modalConfig.placeholder : undefined}
          onTextareaChange={modalConfig.showTextarea ? setModalText : undefined}
        />
      )}

      <div className="mx-auto w-[90%] max-w-none space-y-6">
        {/* Header bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className={textAlign}>
              <h1 className="text-2xl font-extrabold text-slate-900">{t.adminHome.title}</h1>
              <p className="mt-1 text-sm text-slate-500">{t.adminHome.subtitle}</p>
            </div>

            <div className="flex w-full flex-col gap-3 xl:w-auto xl:flex-row">
              <div className="relative w-full xl:w-[320px]">
                <Search
                  className={`pointer-events-none absolute ${searchIconSide} top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400`}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.adminHome.searchPlaceholder}
                  className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 ${searchPadding} ${textAlign} text-sm text-slate-700 outline-none transition focus:border-slate-400`}
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
                aria-label={t.adminHome.statusFilter}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
              >
                <option value="latest">{t.adminHome.sort.latest}</option>
                <option value="oldest">{t.adminHome.sort.oldest}</option>
                <option value="highestStars">{t.adminHome.sort.highestStars}</option>
                <option value="lowestStars">{t.adminHome.sort.lowestStars}</option>
              </select>

              <button
                type="button"
                onClick={fetchRows}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              icon: Bot,
              title: t.adminHome.stats.responses,
              value: totalRows,
              desc: t.adminHome.stats.responsesTotal,
            },
            {
              icon: Building2,
              title: t.adminHome.stats.businesses,
              value: businessCount,
              desc: t.adminHome.stats.businessesDesc,
            },
          ].map(({ icon: Icon, title, value, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div
                className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-start justify-between gap-4`}
              >
                <div className="rounded-2xl bg-slate-100 p-3">
                  <Icon className="h-6 w-6 text-slate-700" />
                </div>
                <div className={textAlign}>
                  <p className="text-sm font-medium text-slate-500">{title}</p>
                  <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{value}</h2>
                  <p className="mt-2 text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-sm text-slate-500">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            {tr.loading}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
            <p className="font-semibold text-rose-700">{tr.errorTitle}</p>
            <p className="mt-1 text-sm text-rose-500">{error}</p>
            <button
              type="button"
              onClick={() => fetchRows()}
              className="mt-4 rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white hover:bg-rose-700"
            >
              {t.adminHome.sort.latest}
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className={`w-full min-w-[1400px] table-fixed ${textAlign} text-base`}>
              <thead className="bg-slate-100">
                <tr className="text-sm font-bold text-slate-700">
                  <th className="w-[7%] px-2 py-3">{t.adminHome.table.reviewId}</th>
                  <th className="w-[8%] px-2 py-3">{t.adminHome.table.clientName}</th>
                  <th className="w-[9%] px-2 py-3">{t.adminHome.table.businessName}</th>
                  <th className="w-[6%] px-2 py-3">{t.adminHome.table.stars}</th>
                  <th className="w-[11%] px-2 py-3">{t.adminHome.table.review}</th>
                  <th className="w-[14%] px-2 py-3">{t.adminHome.table.response}</th>
                  <th className="w-[7%] px-2 py-3">{t.adminHome.table.reviewTime}</th>
                  <th className="w-[7%] px-2 py-3">{t.adminHome.table.status}</th>
                  <th className="w-[15%] px-2 py-3">{t.adminHome.table.actionsEdit}</th>
                  <th className="w-[16%] px-2 py-3">{t.adminHome.table.actionsWorkflow}</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((row) => {
                    const displayStatus: DisplayStatus = getDisplayStatus(row)
                    const replyStatus = row.latestReply?.status
                    const isEditing = editingId === row._id
                    const regenLoading = actionLoading[`regen_${row._id}`]
                    const isExpanded = expandedRows.has(row._id)

                    // Draft text to display: prefer finalText, then aiText, then currentOwnerReply
                    const draftText =
                      row.latestReply?.finalText ??
                      row.latestReply?.aiText ??
                      (row.hasOwnerReply && !row.latestReply ? row.currentOwnerReply : undefined)

                    return (
                      <tr
                        key={row._id}
                        className="border-t border-slate-100 align-top text-sm text-slate-700"
                      >
                        {/* Review ID */}
                        <td className="truncate whitespace-nowrap px-2 py-3 font-semibold text-slate-900">
                          {shortId(row._id)}
                        </td>

                        {/* Reviewer name */}
                        <td className="truncate px-2 py-3 font-semibold text-slate-900">
                          {row.reviewerName ?? '—'}
                        </td>

                        {/* Business name */}
                        <td className="truncate px-2 py-3 text-slate-600">
                          {row.listing?.businessName ?? row.listing?.locationName ?? '—'}
                        </td>

                        {/* Stars */}
                        <td className="px-2 py-3">
                          <div className="space-y-1">
                            <div className={`${textAlign} font-semibold text-slate-800`}>
                              {row.rating}/5
                            </div>
                            <StarsDisplay value={row.rating} isRTL={isRTL} />
                          </div>
                        </td>

                        {/* Review text */}
                        <td
                          className="px-2 py-3 leading-6 text-slate-700 cursor-pointer select-none"
                          onClick={() => toggleExpanded(row._id)}
                        >
                          {row.comment ? (
                            <p className={`break-words ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                              {row.comment}
                            </p>
                          ) : (
                            <span className="text-slate-400">{t.adminHome.table.starsOnly}</span>
                          )}
                        </td>

                        {/* Draft / Google reply — inline editable */}
                        <td
                          className="px-2 py-3 leading-6 cursor-pointer select-none"
                          onClick={() => !isEditing && toggleExpanded(row._id)}
                        >
                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
                              />
                              <div className={`flex items-center ${editSaveAlign} gap-2`}>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  disabled={editSaving}
                                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                  {t.adminHome.table.cancel}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveEdit(row)}
                                  disabled={editSaving}
                                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                  {editSaving ? '…' : t.adminHome.table.save}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className={`break-words text-slate-700 ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                              {draftText ?? (
                                <em className="text-slate-400">{tr.noDraftText}</em>
                              )}
                            </p>
                          )}
                        </td>

                        {/* Review created at */}
                        <td className="px-2 py-3 text-xs leading-5 text-slate-600">
                          {formatDateTime(row.reviewCreatedAt)}
                        </td>

                        {/* Status */}
                        <td className="px-2 py-3">
                          <StatusBadge
                            status={displayStatus}
                            label={tr.statuses[displayStatus]}
                          />
                          {replyStatus === 'failed' && row.latestReply?.errorMessage && (
                            <p
                              className="mt-1 line-clamp-2 text-xs text-rose-400"
                              title={row.latestReply.errorMessage}
                            >
                              {row.latestReply.errorMessage}
                            </p>
                          )}
                        </td>

                        {/* Column 1 — Edit (unified) + Delete (published only) */}
                        <td className="px-2 py-3 align-middle">
                          {!isEditing && (
                            <div className="flex h-full flex-col items-center justify-center gap-2">
                              {canEdit(row) && (
                                <button
                                  type="button"
                                  onClick={() => handleEdit(row)}
                                  className={`${pill} border-amber-400 text-amber-700 hover:bg-amber-50`}
                                >
                                  <Pencil className="h-3 w-3" />
                                  {t.adminHome.table.edit}
                                </button>
                              )}
                              {canDelete(row) && (
                                <button
                                  type="button"
                                  onClick={() => openDelete(row)}
                                  className={`${pill} border-rose-400 text-rose-600 hover:bg-rose-50`}
                                >
                                  {tr.actions.reject}
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Column 2 — Approve / Retry / Regenerate */}
                        <td className="px-2 py-3 align-middle">
                          {!isEditing && (
                            <div className="flex h-full flex-col items-center justify-center gap-2">
                              {replyStatus && canApprove(replyStatus) && (
                                <button
                                  type="button"
                                  onClick={() => openApprove(row)}
                                  className={`${pill} border-emerald-500 text-emerald-700 hover:bg-emerald-50`}
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  {tr.actions.approve}
                                </button>
                              )}
                              {replyStatus && canRetry(replyStatus) && (
                                <button
                                  type="button"
                                  onClick={() => openRetry(row)}
                                  className={`${pill} border-amber-400 text-amber-700 hover:bg-amber-50`}
                                >
                                  {tr.actions.retry}
                                </button>
                              )}
                              {canRegenerate(row) && (
                                <button
                                  type="button"
                                  onClick={() => handleRegenerate(row)}
                                  disabled={!!regenLoading}
                                  className={`${pill} border-slate-400 text-slate-500 hover:bg-slate-50`}
                                >
                                  {regenLoading ? '…' : tr.actions.regenerate}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-sm text-slate-500">
                      {t.adminHome.table.noResults}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
