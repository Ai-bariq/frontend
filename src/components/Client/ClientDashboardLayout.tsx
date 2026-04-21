import { Outlet } from '@tanstack/react-router'
import Sidebar from './Sidebar'
import ClientDashboardHeader from './ClientDashboardHeader'

export default function ClientDashboardLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F9F8]">
      <Sidebar />
      <ClientDashboardHeader />

      <main className="mr-[260px] pt-[88px]">
        <div className="min-h-[calc(100vh-88px)] p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}