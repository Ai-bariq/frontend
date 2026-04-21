import { Bell, ChevronDown, Menu } from 'lucide-react'

type AdminHeaderProps = {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  adminName?: string
  adminEmail?: string
  adminAvatar?: string
  logo?: string
}

export default function AdminHeader({
  isSidebarOpen,
  onToggleSidebar,
  adminName = 'اسم المسؤول',
  adminEmail = 'admin@bariq.ai',
  adminAvatar,
  logo,
}: AdminHeaderProps) {
  return (
    <header
      dir="rtl"
      className="fixed inset-x-0 top-0 z-50 h-20 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* right side: logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            

            {logo ? (
              <img src={logo} alt="Bariq AI" className="h-9 w-auto object-contain" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-sm font-extrabold text-white shadow-sm">
                B
              </div>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-base font-extrabold tracking-tight text-slate-900">
                Bariq AI
              </p>
              <p className="text-xs text-slate-500">لوحة التحكم</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label={isSidebarOpen ? 'إغلاق الشريط الجانبي' : 'فتح الشريط الجانبي'}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* left side: profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="الإشعارات"
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 text-right transition hover:bg-slate-50 sm:px-3"
          >
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />

            <div className="hidden min-w-0 sm:block text-right">
              <p className="truncate text-sm font-extrabold text-slate-900">
                {adminName}
              </p>
              <p className="truncate text-xs text-slate-500">{adminEmail}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {adminAvatar ? (
                <img
                  src={adminAvatar}
                  alt={adminName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-slate-700">
                  {adminName.slice(0, 1)}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}