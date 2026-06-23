import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { LogOut, LifeBuoy, MapPin, Plus, ChevronDown, User, Menu } from 'lucide-react'
import { useCurrentUser } from '../../utils/useCurrentUser'
import { getAvatar } from '../../utils/getAvatar'
import { useLocale } from '../../contexts/LocaleContext'
import LocaleToggle from '../UI/LocaleToggle'
import { API_URL } from '../../services/apiConfig'

export default function ClientDashboardHeader({
  onMenuClick,
}: {
  onMenuClick: () => void
}) {
  const { t, isRTL } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const user = useCurrentUser()
  const avatarUrl = getAvatar(user?.avatar ?? null)

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('user')
      window.location.href = '/'
    }
  }

  // Header spans from sidebar edge to viewport edge
  const headerEdge = isRTL
    ? 'left-0 right-0 md:right-[260px]'
    : 'left-0 right-0 md:left-[260px]'

  const dropdownPosition = isRTL ? 'left-0' : 'right-0'
  const textAlign = isRTL ? 'text-right' : 'text-left'
  const rowReverse = isRTL ? 'flex-row' : 'flex-row-reverse'
  const justifyBetween = 'justify-between'

  return (
    <header className={`fixed ${headerEdge} top-0 z-30 h-[72px] border-b border-slate-200 bg-white md:h-[88px]`}>
      <div className={`flex h-full items-center ${justifyBetween} gap-2 px-3 sm:px-5 md:px-8`}>
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open dashboard menu"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden ${
            isRTL ? 'order-3' : 'order-0'
          }`}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Profile section — left for LTR, right for RTL handled by flex order */}
        <div className={`min-w-0 flex-1 items-center md:flex md:flex-none ${isRTL ? 'order-2' : 'order-1'}`}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`flex max-w-full items-center gap-2 rounded-2xl px-1 py-2 transition hover:bg-slate-50 sm:px-3 md:gap-3 ${rowReverse}`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="profile" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
              )}

              <div className={`min-w-0 ${textAlign}`}>
                <div className="truncate text-[14px] font-bold text-slate-900 sm:text-[15px]">{user?.name ?? '—'}</div>
                <div className="hidden max-w-[180px] truncate text-[12px] text-slate-500 sm:block">{user?.email ?? ''}</div>
              </div>

              <ChevronDown className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
            </button>

            {isOpen && (
              <div className={`absolute ${dropdownPosition} top-[calc(100%+10px)] w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]`}>
                <a
                  href="#"
                  className={`flex items-center ${isRTL ? 'justify-between' : 'justify-start gap-3'} rounded-xl px-3 py-3 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50`}
                >
                  {isRTL ? (
                    <>
                      <span>{t.clientHeader.support}</span>
                      <LifeBuoy className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <LifeBuoy className="h-4 w-4" />
                      <span>{t.clientHeader.support}</span>
                    </>
                  )}
                </a>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`flex w-full items-center ${isRTL ? 'justify-between' : 'justify-start gap-3'} rounded-xl px-3 py-3 text-[14px] font-medium text-rose-600 transition hover:bg-rose-50`}
                >
                  {isRTL ? (
                    <>
                      <span>{t.clientHeader.logout}</span>
                      <LogOut className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>{t.clientHeader.logout}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Location + locale toggle */}
        <div className={`flex shrink-0 items-center gap-1.5 sm:gap-3 ${isRTL ? 'order-1' : 'order-2'}`}>
          <LocaleToggle />

          <Link
            to="/ClientDashboard/Accounts"
            className="hidden items-center gap-2 rounded-xl bg-[#EAF7F4] px-4 py-3 text-[14px] font-bold text-[#0F9D94] transition hover:bg-[#dff3ee] sm:inline-flex"
          >
            <MapPin className="h-4 w-4" />
            <span>{t.clientHeader.addLocation}</span>
            <Plus className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}
