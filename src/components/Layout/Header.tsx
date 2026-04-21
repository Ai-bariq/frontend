import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import messageIcon from '../../assets/message.svg'

const navLinks = [
  { label: 'كيف يعمل', to: '/', hash: 'how-it-works' },
  { label: 'المميزات', to: '/', hash: 'features' },
  { label: 'الأسعار', to: '/', hash: 'pricing' },
] as const

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  return (
    <header className="z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-[80px] w-[92%] items-center justify-between sm:w-[88%] lg:w-[74%]">
        <div className="flex shrink-0 items-center">
          <Link to="/" className="inline-flex items-center" aria-label="Rempa Home">
            <img
              src={logo}
              alt="repma"
              className="h-32 w-36 object-contain sm:h-36 sm:w-40 lg:h-40 lg:w-48"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash}
              className="text-[14px] font-medium text-gray-700 transition-colors hover:text-primary xl:text-[15px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          <button
            type="button"
            className="inline-flex h-8 items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 text-sm font-semibold text-primary shadow-md transition hover:bg-teal-200 hover:text-white"
          >
            <img src={messageIcon} alt="message" className="h-4 w-4" />
            دعم
          </button>

          <Link to="/login" className="btn-gradient font-black inline-flex items-center justify-center">
            ابدأ الآن
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-foreground transition hover:bg-muted lg:hidden"
          aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-border bg-white transition-all duration-300 lg:hidden ${
          isOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto flex w-[92%] flex-col gap-2 py-4 sm:w-[88%]">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                hash={link.hash}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-3 text-right text-[15px] font-medium text-foreground transition hover:bg-muted hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-2 flex flex-col gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 text-sm font-semibold text-primary shadow-sm transition hover:bg-teal-200 hover:text-white"
            >
              <img src={messageIcon} alt="message" className="h-4 w-4" />
              دعم
            </button>

            <Link to="/login" className="btn-gradient inline-flex items-center justify-center">
              ابدأ الآن
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}