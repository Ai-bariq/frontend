import { useState, type ReactNode } from 'react'
import logo from '../../assets/logo.png'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import { useLocale } from '../../contexts/LocaleContext'

type AdminLayoutProps = {
  children?: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { dir, isRTL } = useLocale()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Sidebar is on the right for RTL (Arabic), left for LTR (English)
  const sidebarPadding = isRTL
    ? isSidebarCollapsed ? 'lg:pr-[88px]' : 'lg:pr-[280px]'
    : isSidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[280px]'

  return (
    <div className="min-h-screen bg-slate-50" dir={dir}>
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        logo={logo}
      />

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        collapsed={isSidebarCollapsed}
        onToggleCollapsed={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <main className={`pt-20 transition-all duration-300 ${sidebarPadding}`}>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
