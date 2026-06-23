import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutGrid,
  MessageSquareText,
  MapPin,
  CreditCard,
  Receipt,
  Settings,
  X,
} from 'lucide-react'
import logo from '../../assets/logo.png'
import { useLocale } from '../../contexts/LocaleContext'

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean
  onClose: () => void
}) {
  const { t, isRTL } = useLocale()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const navItems = [
    { label: t.clientSidebar.nav.dashboard,  to: '/ClientDashboard',           icon: LayoutGrid },
    { label: t.clientSidebar.nav.reviews,    to: '/ClientDashboard/Reviews',   icon: MessageSquareText },
    { label: t.clientSidebar.nav.locations, to: '/ClientDashboard/Accounts', icon: MapPin },
    { label: t.clientSidebar.nav.accounts, to: '/ClientDashboard/Accounts', icon: CreditCard },
    { label: t.clientSidebar.nav.billing, to: '/ClientDashboard/Billing', icon: Receipt },
    { label: t.clientSidebar.nav.settings, to: '/ClientDashboard/Settings', icon: Settings },
  ] as const

  const sideAnchor = isRTL ? 'inset-y-0 right-0' : 'inset-y-0 left-0'
  const border = isRTL ? 'border-l' : 'border-r'

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] md:hidden"
        />
      )}

      <aside
        className={`fixed ${sideAnchor} z-50 flex w-[280px] max-w-[86vw] flex-col ${border} border-slate-200 bg-white shadow-xl transition-transform duration-200 md:z-40 md:w-[260px] md:max-w-none md:translate-x-0 md:shadow-none ${
          mobileOpen
            ? 'translate-x-0'
            : isRTL
              ? 'translate-x-full'
              : '-translate-x-full'
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5 md:h-[88px] md:justify-center md:px-6">
          <img src={logo} alt="Bariq" className="h-10 w-auto object-contain md:h-11" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dashboard menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 md:py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.to ||
              (item.to !== '/ClientDashboard' && pathname.startsWith(item.to))

            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${
                  isActive
                    ? 'bg-[#EAF7F4] text-[#0F9D94]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isRTL ? (
                  <>
                    <span>{item.label}</span>
                    <Icon className="h-5 w-5 shrink-0" />
                  </>
                ) : (
                  <>
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </>
                )}
              </Link>
            )
          })}
        </div>
        </nav>
      </aside>
    </>
  )
}
