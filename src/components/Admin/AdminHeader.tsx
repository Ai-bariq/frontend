import { useState, useEffect, useRef } from 'react'
import { ChevronDown, LogOut, Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useLocale } from '../../contexts/LocaleContext'
import { useCurrentUser } from '../../utils/useCurrentUser'
import { getAvatar } from '../../utils/getAvatar'
import LocaleToggle from '../UI/LocaleToggle'
import { API_URL } from '../../services/apiConfig'

type AdminHeaderProps = {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  logo?: string
}

export default function AdminHeader({
  isSidebarOpen,
  onToggleSidebar,
  logo,
}: AdminHeaderProps) {
  const { t, dir, isRTL } = useLocale()
  const user = useCurrentUser()
  const avatarUrl = getAvatar(user?.avatar ?? null)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const textAlign = isRTL ? 'text-right' : 'text-left'
  const dropdownPosition = isRTL ? 'left-0' : 'right-0'
  const rowReverse = isRTL ? 'flex-row' : 'flex-row-reverse'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const adminName = user?.name ?? 'Admin'
  const adminEmail = user?.email ?? ''

  return (
    <header
      dir={dir}
      className="fixed inset-x-0 top-0 z-50 h-20 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt="Bariq AI" className="h-9 w-auto object-contain" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-sm font-extrabold text-white shadow-sm">
                B
              </div>
            )}
            <div className={`hidden sm:block ${textAlign}`}>
              <p className="text-base font-extrabold tracking-tight text-slate-900">Bariq AI</p>
              <p className="text-xs text-slate-500">{t.adminHeader.dashboard}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label={isSidebarOpen ? t.adminHeader.closeSidebar : t.adminHeader.openSidebar}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleToggle />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 ${textAlign} transition hover:bg-slate-50 sm:px-3 ${rowReverse}`}
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={adminName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-slate-700">{adminName.slice(0, 1)}</span>
                )}
              </div>

              <div className={`hidden min-w-0 sm:block ${textAlign}`}>
                <p className="truncate text-sm font-extrabold text-slate-900">{adminName}</p>
                <p className="truncate text-xs text-slate-500">{adminEmail}</p>
              </div>

              <ChevronDown className={`hidden h-4 w-4 text-slate-400 sm:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className={`absolute ${dropdownPosition} top-[calc(100%+10px)] w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]`}>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`flex w-full items-center ${isRTL ? 'justify-between' : 'justify-start gap-3'} rounded-xl px-3 py-3 text-[14px] font-medium text-rose-600 transition hover:bg-rose-50`}
                >
                  {isRTL ? (
                    <>
                      <span>{t.adminHeader.logout}</span>
                      <LogOut className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>{t.adminHeader.logout}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
