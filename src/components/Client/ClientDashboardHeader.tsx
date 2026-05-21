import { useState } from 'react'
import { LogOut, LifeBuoy, MapPin, Plus, ChevronDown, User } from 'lucide-react'
import { useCurrentUser } from '../../utils/useCurrentUser'
import { getAvatar } from '../../utils/getAvatar'

const API_URL = import.meta.env.VITE_API_URL

export default function ClientDashboardHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useCurrentUser()
  const avatarUrl = getAvatar(user?.avatar ?? null)

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')

      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return (
    <header className="fixed left-0 right-[260px] top-0 z-30 h-[88px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-8">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-slate-50"
          >
            <div className="text-right">
              <div className="text-[15px] font-bold text-slate-900">
                {user?.name ?? '—'}
              </div>
              <div className="text-[12px] text-slate-500">
                {user?.email ?? ''}
              </div>
            </div>

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <User className="h-5 w-5 text-slate-500" />
              </div>
            )}

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-[calc(100%+10px)] w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <a
                href="#"
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span>دعم العملاء</span>
                <LifeBuoy className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-[14px] font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <span>تسجيل الخروج</span>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#EAF7F4] px-4 py-3 text-[14px] font-bold text-[#0F9D94] transition hover:bg-[#dff3ee]"
        >
          <MapPin className="h-4 w-4" />
          <span>إضافة موقع</span>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}