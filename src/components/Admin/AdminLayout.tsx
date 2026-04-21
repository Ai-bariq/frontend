import { useState, type ReactNode } from 'react'
import logo from '../../assets/logo.png'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

type AdminLayoutProps = {
  children?: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        adminName="Rehab Elkadim"
        adminEmail="admin@bariq.ai"
        logo={logo}
      />

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        collapsed={isSidebarCollapsed}
        onToggleCollapsed={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <main
        className={`pt-20 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pr-[88px]' : 'lg:pr-[280px]'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}