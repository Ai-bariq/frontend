import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutGrid,
  MessageSquareText,
  MapPin,
  CreditCard,
  Receipt,
  Settings,
} from 'lucide-react'
import logo from '../../assets/logo.png'
import { useLocale } from '../../contexts/LocaleContext'

export default function Sidebar() {
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
    <aside className={`fixed ${sideAnchor} z-40 flex w-[260px] flex-col ${border} border-slate-200 bg-white`}>
      <div className="flex h-[88px] items-center justify-center border-b border-slate-200 px-6">
        <img src={logo} alt="Bariq" className="h-11 w-auto object-contain" />
      </div>

      <nav className="flex-1 px-4 py-6">
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
  )
}
