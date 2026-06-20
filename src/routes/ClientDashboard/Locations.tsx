import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { Globe, MapPin, Pencil, Plus, Trash2, UsersRound, X } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/ClientDashboard/Locations')({
  component: LocationsPage,
})

// ─── Types ────────────────────────────────────────────────────────────────────

type ListingStatus =
  | 'pending_connection'
  | 'connected'
  | 'reconnect_required'
  | 'disconnected'
  | 'disabled'

type Listing = {
  _id: string
  branchId?: string
  status: ListingStatus
  businessName?: string
  locationName?: string
  connectedAt?: string
}

type Branch = {
  _id: string
  businessName: string
  branchName: string
  branchNumber: number
  isMainBranch: boolean
  industry?: string
  address?: string
  city?: string
  country?: string
  isActive: boolean
  isGoogleConnected: boolean
  createdAt: string
  listing?: Listing | null
}

type BranchFormData = {
  businessName: string
  branchName: string
  industry: string
  address: string
  city: string
  country: string
}

const EMPTY_FORM: BranchFormData = {
  businessName: '',
  branchName: '',
  industry: '',
  address: '',
  city: '',
  country: 'Saudi Arabia',
}

// ─── Branch form modal (add + edit) ──────────────────────────────────────────

function BranchFormModal({
  mode,
  initial,
  onClose,
  onSaved,
  isRTL,
  dir,
  p,
}: {
  mode: 'add' | 'edit'
  initial?: Branch
  onClose: () => void
  onSaved: (branch: Branch) => void
  isRTL: boolean
  dir: string
  p: ReturnType<typeof useLocale>['t']['clientPages']['locations']
}) {
  const [form, setForm] = useState<BranchFormData>(
    initial
      ? {
          businessName: initial.businessName,
          branchName: initial.branchName ?? '',
          industry: initial.industry ?? '',
          address: initial.address ?? '',
          city: initial.city ?? '',
          country: initial.country ?? 'Saudi Arabia',
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textAlign = isRTL ? 'text-right' : 'text-left'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.businessName.trim()) return
    setSaving(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const body = {
        businessName: form.businessName.trim(),
        branchName: form.branchName.trim() || undefined,
        industry: form.industry.trim() || undefined,
        address: form.address.trim() || undefined,
        city: form.city.trim() || undefined,
        country: form.country.trim() || undefined,
      }
      let res: any
      if (mode === 'add') {
        res = await apiRequest<{ data: Branch }>('/branches/', {
          method: 'POST',
          token,
          body,
        })
      } else {
        res = await apiRequest<{ data: Branch }>(`/branches/${initial!._id}`, {
          method: 'PATCH',
          token,
          body,
        })
      }
      onSaved(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : p.error)
    } finally {
      setSaving(false)
    }
  }

  const field = (
    key: keyof BranchFormData,
    label: string,
    placeholder: string,
    required = false
  ) => (
    <div>
      <label className={`mb-1 block text-sm font-bold text-slate-900 ${textAlign}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        dir={dir}
        required={required}
        className={`h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-400 ${textAlign}`}
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" dir={dir}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className={`mb-5 flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={textAlign}>
            <h2 className="text-lg font-extrabold text-slate-900">
              {mode === 'add' ? p.addTitle : p.editTitle}
            </h2>
            {mode === 'add' && (
              <p className="mt-1 text-sm text-slate-500">{p.addSubtitle}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <p className={`mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ${textAlign}`}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {field('businessName', p.fieldBusinessName, p.placeholderBusinessName, true)}
          {field('branchName', p.fieldBranchName, p.placeholderBranchName)}
          {field('industry', p.fieldIndustry, p.placeholderIndustry)}
          {field('address', p.fieldAddress, p.placeholderAddress)}
          <div className="grid grid-cols-2 gap-3">
            {field('city', p.fieldCity, p.placeholderCity)}
            {field('country', p.fieldCountry, p.placeholderCountry)}
          </div>

          <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              type="submit"
              disabled={saving || !form.businessName.trim()}
              className="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? p.saving : p.save}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              {p.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Branch card ──────────────────────────────────────────────────────────────

function BranchCard({
  branch,
  onEdit,
  onDelete,
  onConnectGoogle,
  connectingBranchId,
  isRTL,
  p,
}: {
  branch: Branch
  onEdit: (branch: Branch) => void
  onDelete: (branch: Branch) => void
  onConnectGoogle: (branchId: string) => void
  connectingBranchId: string | null
  isRTL: boolean
  p: ReturnType<typeof useLocale>['t']['clientPages']['locations']
}) {
  const textAlign = isRTL ? 'text-right' : 'text-left'
  const isConnecting = connectingBranchId === branch._id
  const isConnected = branch.listing?.status === 'connected'
  const needsReconnect = branch.listing?.status === 'reconnect_required'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        {/* Info */}
        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50">
            <MapPin className="h-5 w-5 text-teal-600" />
          </div>
          <div className={textAlign}>
            <p className="font-extrabold text-slate-900">
              {branch.businessName}
              {branch.branchName && (
                <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm font-medium text-slate-500`}>
                  — {branch.branchName}
                </span>
              )}
            </p>
            {branch.industry && (
              <p className="mt-0.5 text-xs text-slate-400">{branch.industry}</p>
            )}
            {(branch.city || branch.country) && (
              <p className="mt-0.5 text-xs text-slate-400">
                {[branch.city, branch.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <Globe className="h-3.5 w-3.5" />
              {p.connectedGoogle}
            </span>
          ) : needsReconnect ? (
            <button
              type="button"
              disabled={isConnecting}
              onClick={() => onConnectGoogle(branch._id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
            >
              <Globe className="h-3.5 w-3.5" />
              {isConnecting ? p.connecting : p.reconnect}
            </button>
          ) : (
            <button
              type="button"
              disabled={isConnecting}
              onClick={() => onConnectGoogle(branch._id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-600 transition hover:bg-teal-100 disabled:opacity-50"
            >
              <Globe className="h-3.5 w-3.5" />
              {isConnecting ? p.connecting : p.connectGoogle}
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(branch)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            title={p.editTitle}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(branch)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            title={p.deleteConfirm}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ModalState =
  | { kind: 'add' }
  | { kind: 'edit'; branch: Branch }
  | { kind: 'delete'; branch: Branch }
  | null

function LocationsPage() {
  const { t, dir, isRTL } = useLocale()
  const p = t.clientPages.locations
  const textAlign = isRTL ? 'text-right' : 'text-left'
  const headerRow = isRTL ? 'flex-row' : 'flex-row-reverse'

  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)
  const [connectingBranchId, setConnectingBranchId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchBranches = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const [branchRes, listingRes] = await Promise.all([
        apiRequest<any>('/branches/', { token }),
        apiRequest<any>('/listings/', { token }),
      ])

      const listings: Listing[] = listingRes?.data ?? []
      const listingByBranch = new Map<string, Listing>()
      for (const l of listings) {
        if (l.branchId) listingByBranch.set(l.branchId, l)
      }

      const enriched: Branch[] = (branchRes?.data ?? []).map((b: Branch) => ({
        ...b,
        listing: listingByBranch.get(b._id) ?? null,
      }))

      setBranches(enriched)
    } catch (err) {
      setError(err instanceof Error ? err.message : p.error)
    } finally {
      setIsLoading(false)
    }
  }, [p.error])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  const handleSaved = (saved: Branch) => {
    setBranches((prev) => {
      const exists = prev.find((b) => b._id === saved._id)
      if (exists) return prev.map((b) => (b._id === saved._id ? { ...saved, listing: b.listing } : b))
      return [{ ...saved, listing: null }, ...prev]
    })
    setModal(null)
  }

  const handleDelete = async () => {
    if (modal?.kind !== 'delete') return
    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      await apiRequest(`/branches/${modal.branch._id}`, { method: 'DELETE', token })
      setBranches((prev) => prev.filter((b) => b._id !== modal.branch._id))
      setModal(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : p.error)
    } finally {
      setDeleting(false)
    }
  }

  const handleConnectGoogle = async (branchId: string) => {
    setConnectingBranchId(branchId)
    try {
      const token = localStorage.getItem('token')
      const res = await apiRequest<any>('/zernio/connect/google-business', {
        method: 'POST',
        token,
        body: { branchId },
      })
      window.location.href = res?.data?.authUrl
    } catch (err) {
      setConnectingBranchId(null)
      alert(err instanceof Error ? err.message : p.error)
    }
  }

  return (
    <section dir={dir} className="min-h-[calc(100vh-80px)] bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className={`flex items-center justify-between gap-4 ${headerRow}`}>
          <button
            type="button"
            onClick={() => setModal({ kind: 'add' })}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-600 transition hover:bg-teal-100"
          >
            <Plus className="h-4 w-4" />
            <span>{p.addLocation}</span>
            <MapPin className="h-4 w-4" />
          </button>

          <div className={`min-w-0 ${textAlign}`}>
            <h2 className="text-lg font-extrabold text-slate-900">{p.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-400">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>{p.loading}</span>
          </div>
        ) : error ? (
          <p className={`py-10 text-center text-sm text-red-500 ${textAlign}`}>{error}</p>
        ) : branches.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-teal-200 bg-[#F5FBFA] px-6 py-16 sm:px-10">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100">
                <UsersRound className="h-11 w-11 text-teal-600" strokeWidth={2.2} />
              </div>
              <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {p.emptyTitle}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                {p.emptySubtitle}
              </p>
              <button
                type="button"
                onClick={() => setModal({ kind: 'add' })}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-50 px-5 py-3 text-sm font-bold text-teal-600 transition hover:bg-teal-100"
              >
                <Plus className="h-4 w-4" />
                <span>{p.addLocation}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {branches.map((branch) => (
              <BranchCard
                key={branch._id}
                branch={branch}
                onEdit={(b) => setModal({ kind: 'edit', branch: b })}
                onDelete={(b) => setModal({ kind: 'delete', branch: b })}
                onConnectGoogle={handleConnectGoogle}
                connectingBranchId={connectingBranchId}
                isRTL={isRTL}
                p={p}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {(modal?.kind === 'add' || modal?.kind === 'edit') && (
        <BranchFormModal
          mode={modal.kind}
          initial={modal.kind === 'edit' ? modal.branch : undefined}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
          isRTL={isRTL}
          dir={dir}
          p={p}
        />
      )}

      {/* Delete confirm modal */}
      {modal?.kind === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" dir={dir}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className={`text-base font-extrabold text-slate-900 ${textAlign}`}>
              {p.deleteConfirm}
            </h2>
            <p className={`mt-2 text-sm text-slate-500 ${textAlign}`}>
              {modal.branch.businessName}
              {modal.branch.branchName ? ` — ${modal.branch.branchName}` : ''}
            </p>
            <div className={`mt-6 flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? p.deleting : p.deleteConfirm}
              </button>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                {p.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
