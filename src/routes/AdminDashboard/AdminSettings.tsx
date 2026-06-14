import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'

export const Route = createFileRoute('/AdminDashboard/AdminSettings')({
  component: AdminSettingsPage,
})

type AdminProfile = {
  name: string
  email: string
}

const fakeAdmin: AdminProfile = {
  name: 'Admin User',
  email: 'admin@bareeq.ai',
}

function validateStrongPassword(password: string, p: { req8chars: string; reqUppercase: string; reqLowercase: string; reqNumber: string; reqSpecial: string }) {
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

  const [name, setName] = useState(fakeAdmin.name)
  const [email] = useState(fakeAdmin.email)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameMessage, setNameMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [deleteMessage, setDeleteMessage] = useState('')
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [showDeleteBox, setShowDeleteBox] = useState(false)

  const handleSaveName = () => {
    if (!name.trim()) { setNameMessage(p.nameEmpty); return }
    setNameMessage(p.nameSaved)
  }

  const resetPasswordFields = () => {
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    setPasswordMessage(''); setPasswordErrors([])
  }

  const handleChangePassword = () => {
    setPasswordMessage(''); setPasswordErrors([])
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordMessage(p.fillAllFields); return }
    const errors = validateStrongPassword(newPassword, p)
    if (errors.length > 0) { setPasswordErrors(errors); return }
    if (newPassword !== confirmPassword) { setPasswordMessage(p.passwordMismatch); return }
    if (currentPassword === newPassword) { setPasswordMessage(p.passwordSameAsCurrent); return }
    setPasswordMessage(p.passwordUpdated)
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordErrors([])
    setShowPasswordFields(false)
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') { setDeleteMessage(p.deleteWrongText); return }
    setDeleteMessage(p.deleteSuccess)
  }

  return (
    <section dir={dir} className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={textAlign}>
            <h1 className="text-2xl font-extrabold text-slate-900">{p.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{p.subtitle}</p>
          </div>
        </div>

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
                value={email}
                disabled
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 ${textAlign} text-sm text-slate-500 outline-none`}
              />
            </div>

            <div className={`flex ${justifyEnd}`}>
              <button onClick={handleSaveName} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                {p.saveChanges}
              </button>
            </div>

            {nameMessage && (
              <p className={`${textAlign} text-sm ${nameMessage === p.nameSaved ? 'text-green-600' : 'text-red-600'}`}>
                {nameMessage}
              </p>
            )}
          </div>
        </div>

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
                    {passwordErrors.map((error) => <li key={error}>• {error}</li>)}
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
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {p.updatePassword}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-red-200 bg-white p-5">
          <div className={`mb-5 ${textAlign}`}>
            <h2 className="text-lg font-bold text-red-700">{p.deleteSection}</h2>
            <p className="mt-1 text-sm text-slate-500">{p.deleteSubtitle}</p>
          </div>

          {!showDeleteBox ? (
            <div className={`flex ${justifyEnd}`}>
              <button
                onClick={() => { setShowDeleteBox(true); setDeleteMessage('') }}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                {p.deleteAccount}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={textAlign}>
                <p className="mb-2 text-sm text-slate-600">
                  {p.deleteConfirmPrompt}
                  <span className="mx-1 font-bold text-slate-900">DELETE</span>
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteMessage('') }}
                  className={`w-full rounded-xl border border-red-200 px-4 py-3 ${textAlign} text-sm outline-none focus:border-red-400`}
                />
              </div>

              <div className={`flex ${justifyEnd} gap-2`}>
                <button
                  onClick={() => { setShowDeleteBox(false); setDeleteConfirmText(''); setDeleteMessage('') }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  {p.cancel}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  {p.confirmDelete}
                </button>
              </div>

              {deleteMessage && (
                <p className={`${textAlign} text-sm ${deleteMessage === p.deleteSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {deleteMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
