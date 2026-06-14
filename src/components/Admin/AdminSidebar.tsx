import { Link, useRouterState } from '@tanstack/react-router'
import {
  Building2,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  ShieldCheck,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'

type AdminSidebarProps = {
  isOpen: boolean
  onClose: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export default function AdminSidebar({
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapsed,
}: AdminSidebarProps) {
  const { t, isRTL } = useLocale()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const navItems = [
    { label: t.adminSidebar.nav.home, to: '/AdminDashboard/AdminHome', icon: LayoutDashboard },
    { label: t.adminSidebar.nav.clients, to: '/AdminDashboard/clients', icon: Building2 },
    { label: t.adminSidebar.nav.editedResponses, to: '/AdminDashboard/EditiedResponse', icon: SquarePen },
    { label: t.adminSidebar.nav.deletedResponses, to: '/AdminDashboard/DeletedResponse', icon: Trash2 },
    { label: t.adminSidebar.nav.settings, to: '/AdminDashboard/AdminSettings', icon: Settings },
  ] as const

  // LTR: sidebar anchors to the left; RTL: anchors to the right
  const sideAnchor = isRTL ? 'right-0' : 'left-0'
  const border = isRTL ? 'border-l' : 'border-r'
  const translateOut = isRTL ? 'translate-x-full' : '-translate-x-full'
  const textAlign = isRTL ? 'text-right' : 'text-left'

  // Toggle icons: swap open/close sides for LTR
  const CollapseIcon = isRTL
    ? (collapsed ? PanelRightOpen : PanelRightClose)
    : (collapsed ? PanelLeftOpen : PanelLeftClose)

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed bottom-0 ${sideAnchor} top-20 z-50 ${border} border-slate-200 bg-white transition-all duration-300 ${
          collapsed ? 'w-[88px]' : 'w-[280px]'
        } ${
          isOpen ? 'translate-x-0' : translateOut
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:inline-flex"
              aria-label={t.adminSidebar.toggleLabel}
            >
              <CollapseIcon className="h-4 w-4" />
            </button>

            {!collapsed && (
              <div className={textAlign}>
                <p className="text-sm font-extrabold text-slate-900">{t.adminSidebar.title}</p>
                <p className="mt-1 text-xs text-slate-500">{t.adminSidebar.subtitle}</p>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`)

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
                <div className={textAlign}>
                  <p className="text-xs font-extrabold text-slate-900">{t.adminSidebar.permissions}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    {isRTL
                      ? 'عرض وتعديل وحذف ردود الذكاء الاصطناعي، مع الوصول إلى التقييمات وبيانات المراجعين ونصوص المراجعات وبيانات نشاط العميل.'
                      : 'View, edit, and delete AI responses with access to reviews, reviewer data, review text, and client activity data.'}
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
