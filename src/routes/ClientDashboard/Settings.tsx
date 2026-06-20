import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AlertTriangle, Eye, ExternalLink, Mail, Phone, Save, ShieldCheck, User, KeyRound } from 'lucide-react'
import { useCurrentUser } from '../../utils/useCurrentUser'
import { getAvatar } from '../../utils/getAvatar'
import { useLocale } from '../../contexts/LocaleContext'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/ClientDashboard/Settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { t, dir, isRTL } = useLocale()
  const user = useCurrentUser()
  const textAlign = isRTL ? 'text-right' : 'text-left'
  const avatarUrl = getAvatar(user?.avatar ?? null)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteAccount = async () => {
    const confirmation = window.prompt(
      'هذا الإجراء نهائي وسيحذف الحساب وكل بياناته. اكتب DELETE للتأكيد:',
    )
    if (confirmation !== 'DELETE') return
    try {
      setIsDeleting(true)
      await apiRequest('/users/me', {
        method: 'DELETE',
        body: { confirmation },
      })
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.replace('/Login')
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'تعذر حذف الحساب.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section dir={dir} className="min-h-[calc(100vh-80px)] bg-white">
      <div className="px-6 py-8">
        <header className={`mb-6 ${textAlign}`}>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{t.clientPages.settings.title}</h1>
          <p className="mt-2 text-base text-slate-500">{t.clientPages.settings.subtitle}</p>
        </header>

        {/* Profile card */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#EAF5F4] px-6 py-10">
            <div className="flex flex-col items-center justify-center text-center">
              {avatarUrl ? (
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
                  <img src={avatarUrl} alt={user?.name || 'profile'} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-100 shadow-md">
                  <User className="h-12 w-12 text-slate-500" />
                </div>
              )}
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">{user?.name || '—'}</h2>
              <p className="mt-1 text-lg text-slate-500">{user?.email || '—'}</p>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-5">
              <div className={textAlign}>
                <div className={`mb-2 flex items-center gap-2 text-slate-900 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-slate-400"><User className="h-4 w-4" /></span>
                  <span className="font-extrabold">{t.clientPages.settings.nameLabel}</span>
                </div>
                <input type="text" defaultValue={user?.name || ''} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none" />
              </div>

              <div className={textAlign}>
                <div className={`mb-2 flex items-center gap-2 text-slate-900 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-slate-400"><Mail className="h-4 w-4" /></span>
                  <span className="font-extrabold">{t.clientPages.settings.emailLabel}</span>
                </div>
                <input type="email" value={user?.email || ''} readOnly onChange={() => {}} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none" />
                {user?.isEmailVerified && (
                  <div className={`mt-3 flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>
                )}
              </div>

              <div className={textAlign}>
                <div className={`mb-2 flex items-center justify-between ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                    <ExternalLink className="h-4 w-4" />
                    <span>{t.clientPages.settings.manage}</span>
                  </button>
                  <div className="flex items-center gap-2 text-slate-900">
                    <span className="font-extrabold">{t.clientPages.settings.googleAccount}</span>
                    <span className="text-base font-extrabold text-[#4285F4]">G</span>
                  </div>
                </div>
                <input type="text" value={user?.email || ''} readOnly onChange={() => {}} className={`h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 ${isRTL ? 'text-right' : 'text-left'} text-sm text-slate-500 outline-none`} />
                <p className={`mt-3 text-sm leading-7 text-slate-500 ${textAlign}`}>{t.clientPages.settings.googleAccountNote}</p>
              </div>

              <div className={textAlign}>
                <div className={`mb-2 flex items-center gap-2 text-slate-900 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-slate-400"><Phone className="h-4 w-4" /></span>
                  <span className="font-extrabold">{t.clientPages.settings.phoneLabel}</span>
                </div>
                <input type="text" defaultValue={user?.phone || ''} className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none" />
              </div>

              <div className={`flex pt-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-700">
                  <Save className="h-4 w-4" />
                  <span>{t.clientPages.settings.saveChanges}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Password card */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-6">
            <div className={textAlign}>
              <h2 className="text-2xl font-extrabold text-slate-900">{t.clientPages.settings.passwordSection}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.clientPages.settings.passwordSubtitle}</p>
            </div>
            <div className="mt-6 space-y-5">
              <div className={textAlign}>
                <div className="mb-2"><span className="font-extrabold">{t.clientPages.settings.newPassword}</span></div>
                <div className="relative">
                  <input type="password" className={`h-12 w-full rounded-xl border border-slate-200 px-12 text-sm text-slate-900 outline-none ${isRTL ? 'text-right' : 'text-left'}`} />
                  <button type="button" className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600`}>
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                <p className={`mt-2 text-xs text-slate-400 ${textAlign}`}>{t.clientPages.settings.newPasswordHint}</p>
              </div>

              <div className={textAlign}>
                <div className="mb-2"><span className="font-extrabold">{t.clientPages.settings.confirmPassword}</span></div>
                <div className="relative">
                  <input type="password" className={`h-12 w-full rounded-xl border border-slate-200 px-12 text-sm text-slate-900 outline-none ${isRTL ? 'text-right' : 'text-left'}`} />
                  <button type="button" className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600`}>
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={`flex pt-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-700">
                  <KeyRound className="h-4 w-4" />
                  <span>{t.clientPages.settings.changePassword}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-red-300 bg-white shadow-sm">
          <div className="px-6 py-6">
            <div className={textAlign}>
              <h2 className="text-2xl font-extrabold text-red-600">{t.clientPages.settings.dangerZone}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.clientPages.settings.dangerZoneSubtitle}</p>
            </div>
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
              <div className={`flex items-start justify-between gap-4 ${isRTL ? '' : 'flex-row-reverse'}`}>
                <button
                  type="button"
                  onClick={() => void deleteAccount()}
                  disabled={isDeleting}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  <span>{t.clientPages.settings.deleteAccount}</span>
                </button>
                <div className={textAlign}>
                  <div className={`flex items-center gap-2 text-red-600 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <AlertTriangle className="h-5 w-5" />
                    <p className="text-xl font-extrabold">{t.clientPages.settings.deleteWarning}</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{t.clientPages.settings.deleteNote}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
