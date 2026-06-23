import { useEffect, useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import Sidebar from './Sidebar'
import ClientDashboardHeader from './ClientDashboardHeader'
import { useLocale } from '../../contexts/LocaleContext'

export default function ClientDashboardLayout() {
  const { dir, isRTL } = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [mobileMenuOpen])

  return (
    <div dir={dir} className="min-h-screen overflow-x-hidden bg-[#F7F9F8]">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <ClientDashboardHeader
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <main
        className={`pt-[72px] md:pt-[88px] ${
          isRTL ? 'md:mr-[260px]' : 'md:ml-[260px]'
        }`}
      >
        <div className="min-h-[calc(100vh-72px)] min-w-0 p-3 sm:p-5 md:min-h-[calc(100vh-88px)] md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
