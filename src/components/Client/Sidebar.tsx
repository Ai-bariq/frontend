import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutGrid,
  MessageSquareText,
  Users,
  BriefcaseBusiness,
  CreditCard,
  Receipt,
  Settings,
} from 'lucide-react'
import logo from '../../assets/logo.png'

const navItems = [
  {
    label: 'لوحة التحكم',
    to: '/ClientDashboard',
    icon: LayoutGrid,
  },
  {
    label: 'التقييمات',
    to: '/ClientDashboard/Reviews',
    icon: MessageSquareText,
  },
  {
    label: 'الموظفين',
    to: '/ClientDashboard/Agents',
    icon: Users,
  },
  {
    label: 'الحسابات',
    to: '/ClientDashboard/Accounts',
    icon: CreditCard,
  },
  {
    label: 'الفواتير',
    to: '/ClientDashboard/Billing',
    icon: Receipt,
  },
  {
    label: 'الإعدادات',
    to: '/ClientDashboard/Settings',
    icon: Settings,
  },
] as const

export default function Sidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-[260px] flex-col border-l border-slate-200 bg-white">
      <div className="flex h-[88px] items-center justify-center border-b border-slate-200 px-6">
        <img src={logo} alt="Repma" className="h-11 w-auto object-contain" />
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
                <span>{item.label}</span>
                <Icon className="h-5 w-5 shrink-0" />
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}