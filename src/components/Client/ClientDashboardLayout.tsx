import { Outlet } from '@tanstack/react-router'
import Sidebar from './Sidebar'
import ClientDashboardHeader from './ClientDashboardHeader'
import { useLocale } from '../../contexts/LocaleContext'

export default function ClientDashboardLayout() {
  const { dir, isRTL } = useLocale()

  // Sidebar is on the right for RTL, left for LTR
  const mainMargin = isRTL ? 'mr-[260px]' : 'ml-[260px]'

  return (
    <div dir={dir} className="min-h-screen bg-[#F7F9F8]">
      <Sidebar />
      <ClientDashboardHeader />

      <main className={`${mainMargin} pt-[88px]`}>
        <div className="min-h-[calc(100vh-88px)] p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
