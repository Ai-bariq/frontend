import { Link, useRouterState } from '@tanstack/react-router'
import {
  Building2,
  LayoutDashboard,
  MessageSquareText,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  ShieldCheck,
  SquarePen,
  Star,
  Trash2,
  Users,
} from 'lucide-react'

type AdminSidebarProps = {
  isOpen: boolean
  onClose: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

const navItems = [
  {
    label: 'الرئيسية',
    to: '/AdminDashboard/AdminHome',
    icon: LayoutDashboard,
  },
  {
    label: 'العملاء',
    to: '/AdminDashboard/clients',
    icon: Building2,
  },
  {
    label: 'الردود المعدلة',
    to: '/AdminDashboard/EditiedResponse',
    icon: SquarePen,
  },
  {
    label: 'الردود المحذوفة',
    to: '/AdminDashboard/DeletedResponse',
    icon: Trash2,
  },
  {
    label: 'الإعدادات',
    to: '/AdminDashboard/AdminSettings',
    icon: Settings,
  },
] as const

export default function AdminSidebar({
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapsed,
}: AdminSidebarProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        dir="rtl"
        className={`fixed bottom-0 right-0 top-20 z-50 border-l border-slate-200 bg-white transition-all duration-300 ${
          collapsed ? 'w-[88px]' : 'w-[280px]'
        } ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:inline-flex"
              aria-label="تغيير عرض الشريط الجانبي"
            >
              {collapsed ? (
                <PanelRightOpen className="h-4 w-4" />
              ) : (
                <PanelRightClose className="h-4 w-4" />
              )}
            </button>

            {!collapsed && (
              <div className="text-right">
                <p className="text-sm font-extrabold text-slate-900">لوحة الإدارة</p>
                <p className="mt-1 text-xs text-slate-500">
                  إدارة التقييمات والردود وبيانات العملاء
                </p>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon

              const isActive =
                pathname === item.to || pathname.startsWith(`${item.to}/`)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-[0_12px_24px_rgba(13,148,136,0.18)]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${collapsed ? 'justify-center' : 'justify-start'}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 p-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              {!collapsed ? (
                <div className="text-right">
                  <p className="text-xs font-extrabold text-slate-900">صلاحيات الإدارة</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    عرض وتعديل وحذف ردود الذكاء الاصطناعي، مع الوصول إلى
                    التقييمات وبيانات المراجعين ونصوص المراجعات وبيانات نشاط
                    العميل.
                  </p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}