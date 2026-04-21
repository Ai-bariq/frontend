import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { LogOut, LifeBuoy, MapPin, Plus, ChevronDown } from 'lucide-react'
import avatar from '../../assets/avatar.png'

export default function ClientDashboardHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed left-0 right-[260px] top-0 z-30 h-[88px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-8">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-slate-50"
          >
            <div className="text-right">
              <div className="text-[15px] font-bold text-slate-900">
                rehab mahmoud
              </div>
              <div className="text-[12px] text-slate-500">
                roby.mahmoud.rm@gmail.com
              </div>
            </div>

            <img
              src={avatar}
              alt="profile"
              className="h-10 w-10 rounded-full object-cover"
            />

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-[calc(100%+10px)] w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <a
                href="#"
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span>دعم العملاء</span>
                <LifeBuoy className="h-4 w-4" />
              </a>

              <Link
                to="/login"
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[14px] font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <span>تسجيل الخروج</span>
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#EAF7F4] px-4 py-3 text-[14px] font-bold text-[#0F9D94] transition hover:bg-[#dff3ee]"
        >
          <img src={avatar} alt="" className="hidden" />
          <MapPin className="h-4 w-4" />
          <span>إضافة موقع</span>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}