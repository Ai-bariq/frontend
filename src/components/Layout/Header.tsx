import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'
import whatsappIcon from '../../assets/whatsapp.svg'
import { whatsappUrl } from '../../config'
import { useLocale } from '../../contexts/LocaleContext'
import LocaleToggle from '../UI/LocaleToggle'

export default function Header() {
  const { t, isRTL } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: t.nav.howItWorks, to: '/', hash: 'how-it-works' },
    { label: t.nav.features, to: '/', hash: 'features' },
    { label: t.nav.pricing, to: '/', hash: 'pricing' },
    { label: t.nav.privacy, to: '/privacy-policy' as const },
  ] as const

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false)
    }
    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  const mobileTextAlign = isRTL ? 'text-right' : 'text-left'

  return (
    <header className="z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-[80px] w-[92%] items-center justify-between sm:w-[88%] lg:w-[74%]">
        <div className="flex shrink-0 items-center">
          <Link to="/" className="inline-flex items-center" aria-label="Bariq Home">
            <img
              src={logo}
              alt="Bariq"
              className="h-32 w-36 object-contain sm:h-36 sm:w-40 lg:h-40 lg:w-48"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={'hash' in link ? link.hash : undefined}
              className="text-[14px] font-medium text-gray-700 transition-colors hover:text-primary xl:text-[15px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          <LocaleToggle />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient font-black inline-flex items-center justify-center gap-2 bg-transparent text-primary border border-primary transition-transform hover:scale-105"
            style={{ background: 'transparent', color: 'var(--color-primary, #0d9488)' }}
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-4 w-4 [filter:invert(44%)_sepia(72%)_saturate(400%)_hue-rotate(120deg)_brightness(95%)]" />
            {t.nav.support}
          </a>

          <Link to="/Login" className="btn-gradient font-black inline-flex items-center justify-center">
            {t.nav.startNow}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-foreground transition hover:bg-muted lg:hidden"
          aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-border bg-white transition-all duration-300 lg:hidden ${
          isOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto flex w-[92%] flex-col gap-2 py-4 sm:w-[88%]">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                hash={'hash' in link ? link.hash : undefined}
                onClick={() => setIsOpen(false)}
                className={`rounded-xl px-3 py-3 ${mobileTextAlign} text-[15px] font-medium text-foreground transition hover:bg-muted hover:text-primary`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-2 flex flex-col gap-3">
            <LocaleToggle />

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient font-black inline-flex items-center justify-center gap-2 bg-transparent text-primary border border-primary transition-transform hover:scale-105"
              style={{ background: 'transparent', color: 'var(--color-primary, #0d9488)' }}
            >
              <img src={whatsappIcon} alt="WhatsApp" className="h-4 w-4 [filter:invert(44%)_sepia(72%)_saturate(400%)_hue-rotate(120deg)_brightness(95%)]" />
              {t.nav.support}
            </a>

            <Link to="/Login" className="btn-gradient inline-flex items-center justify-center">
              {t.nav.startNow}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
