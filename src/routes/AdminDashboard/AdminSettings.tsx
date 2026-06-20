import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/AdminDashboard/AdminSettings')({
  component: AdminSettingsPage,
})

type AdminProfile = {
  id: string
  name: string
  email: string
  role: string
}

function validateStrongPassword(
  password: string,
  p: {
    req8chars: string
    reqUppercase: string
    reqLowercase: string
    reqNumber: string
    reqSpecial: string
  },
) {
  const errors: string[] = []
  if (password.length < 8) errors.push(p.req8chars)
  if (!/[A-Z]/.test(password)) errors.push(p.reqUppercase)
  if (!/[a-z]/.test(password)) errors.push(p.reqLowercase)
  if (!/\d/.test(password)) errors.push(p.reqNumber)
  if (!/[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(password)) errors.push(p.reqSpecial)
  return errors
}

export default function AdminSettingsPage() {
  const { t, dir, isRTL } = useLocale()
  const p = t.adminPages.settings
  const textAlign = isRTL ? 'text-right' : 'text-left'
  const justifyEnd = isRTL ? 'justify-end' : 'justify-start'

  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState('')
  const [name, setName] = useState('')
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameMessage, setNameMessage] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Load profile on mount
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await apiRequest<{ data: AdminProfile }>('/users/me', { token })
        setProfile(res.data)
        setName(res.data.name)
      } catch (err) {
        setProfileError(err instanceof Error ? err.message : 'Error')
      } finally {
        setLoadingProfile(false)
      }
    }
    load()
  }, [])

  const handleSaveName = async () => {
    if (!name.trim()) { setNameMessage(p.nameEmpty); return }
    setNameSaving(true)
    setNameMessage('')
    try {
      const token = localStorage.getItem('token')
      await apiRequest('/users/me', { method: 'PATCH', token, body: { name: name.trim() } })
      setNameMessage(p.nameSaved)
    } catch (err) {
      setNameMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setNameSaving(false)
    }
  }

  const resetPasswordFields = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage('')
    setPasswordErrors([])
  }

  const handleChangePassword = async () => {
    setPasswordMessage('')
    setPasswordErrors([])
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage(p.fillAllFields)
      return
    }
    const errors = validateStrongPassword(newPassword, p)
    if (errors.length > 0) { setPasswordErrors(errors); return }
    if (newPassword !== confirmPassword) { setPasswordMessage(p.passwordMismatch); return }
    if (currentPassword === newPassword) { setPasswordMessage(p.passwordSameAsCurrent); return }

    setPasswordSaving(true)
    try {
      const token = localStorage.getItem('token')
      await apiRequest('/users/me/password', {
        method: 'PATCH',
        token,
        body: { currentPassword, newPassword },
      })
      setPasswordMessage(p.passwordUpdated)
      resetPasswordFields()
      setShowPasswordFields(false)
    } catch (err) {
      setPasswordMessage(err instanceof Error ? err.message : 'Error')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loadingProfile) {
    return (
      <section dir={dir} className="flex min-h-screen items-center justify-center bg-slate-50">
        <svg className="h-5 w-5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </section>
    )
  }

  if (profileError || !profile) {
    return (
      <section dir={dir} className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="rounded-2xl border border-red-200 bg-white px-6 py-5 text-center text-sm text-red-600">
          {profileError || 'Unable to load profile'}
        </div>
      </section>
    )
  }

  return (
    <section dir={dir} className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Title */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={textAlign}>
            <h1 className="text-2xl font-extrabold text-slate-900">{p.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
          </div>
        </div>

        {/* Account section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={`mb-5 ${textAlign}`}>
            <h2 className="text-lg font-bold text-slate-900">{p.accountSection}</h2>
            <p className="mt-1 text-sm text-slate-500">{p.accountSubtitle}</p>
          </div>

          <div className="space-y-4">
            <div className={textAlign}>
              <label className="mb-2 block text-sm font-medium text-slate-700">{p.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameMessage('') }}
                className={`w-full rounded-xl border border-slate-200 px-4 py-3 ${textAlign} text-sm outline-none focus:border-slate-400`}
              />
            </div>

            <div className={textAlign}>
              <label className="mb-2 block text-sm font-medium text-slate-700">{p.emailLabel}</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 ${textAlign} text-sm text-slate-500 outline-none`}
              />
            </div>

            <div className={`flex ${justifyEnd}`}>
              <button
                onClick={handleSaveName}
                disabled={nameSaving}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {nameSaving ? '...' : p.saveChanges}
              </button>
            </div>

            {nameMessage && (
              <p className={`${textAlign} text-sm ${nameMessage === p.nameSaved ? 'text-green-600' : 'text-red-600'}`}>
                {nameMessage}
              </p>
            )}
          </div>
        </div>

        {/* Password section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={`mb-5 ${textAlign}`}>
            <h2 className="text-lg font-bold text-slate-900">{p.passwordSection}</h2>
            <p className="mt-1 text-sm text-slate-500">{p.passwordSubtitle}</p>
          </div>

          {!showPasswordFields ? (
            <div className={`flex ${justifyEnd}`}>
              <button
                onClick={() => { setShowPasswordFields(true); setPasswordMessage(''); setPasswordErrors([]) }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {p.changePassword}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={textAlign}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{p.currentPassword}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setPasswordMessage('') }}
                  className={`w-full rounded-xl border border-slate-200 px-4 py-3 ${textAlign} text-sm outline-none focus:border-slate-400`}
                />
              </div>

              <div className={textAlign}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{p.newPassword}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordMessage(''); setPasswordErrors([]) }}
                  className={`w-full rounded-xl border border-slate-200 px-4 py-3 ${textAlign} text-sm outline-none focus:border-slate-400`}
                />
              </div>

              <div className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${textAlign}`}>
                <p className="mb-2 text-sm font-medium text-slate-700">{p.passwordRequirements}</p>
                <ul className="space-y-1 text-sm text-slate-500">
                  <li>• {p.req8chars}</li>
                  <li>• {p.reqUppercase}</li>
                  <li>• {p.reqLowercase}</li>
                  <li>• {p.reqNumber}</li>
                  <li>• {p.reqSpecial}</li>
                </ul>
              </div>

              <div className={textAlign}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{p.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordMessage('') }}
                  className={`w-full rounded-xl border border-slate-200 px-4 py-3 ${textAlign} text-sm outline-none focus:border-slate-400`}
                />
              </div>

              {passwordErrors.length > 0 && (
                <div className={`rounded-xl border border-red-200 bg-red-50 p-4 ${textAlign}`}>
                  <p className="mb-2 text-sm font-medium text-red-700">{p.weakPassword}</p>
                  <ul className="space-y-1 text-sm text-red-600">
                    {passwordErrors.map((e) => <li key={e}>• {e}</li>)}
                  </ul>
                </div>
              )}

              {passwordMessage && (
                <p className={`${textAlign} text-sm ${passwordMessage === p.passwordUpdated ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMessage}
                </p>
              )}

              <div className={`flex ${justifyEnd} gap-2`}>
                <button
                  onClick={() => { setShowPasswordFields(false); resetPasswordFields() }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  {p.cancel}
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={passwordSaving}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {passwordSaving ? '...' : p.updatePassword}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete account section intentionally hidden for admin accounts.
            Account deactivation is a superAdmin action only. */}
      </div>
    </section>
  )
}
