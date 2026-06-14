import { MapPin, ShieldCheck } from 'lucide-react'
import logo from '../../assets/logo.png'
import whatsappIcon from '../../assets/whatsapp.svg'
import type { ReactNode } from 'react'
import { useLocale } from '../../contexts/LocaleContext'

type FooterBadgeItem = {
  label: string
  icon: ReactNode
}

function BadgeItem({ label, icon }: FooterBadgeItem) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#081A45] px-4 py-2 text-[14px] font-medium">
      <span>{label}</span>
      <span className="text-[#18C3B3] text-[15px]">{icon}</span>
    </div>
  )
}

export default function Footer() {
  const { t, dir } = useLocale()

  const badgeIcons: ReactNode[] = [
    <ShieldCheck className="h-4 w-4" />,
    <span className="text-[14px] leading-none">🇸🇦</span>,
    <MapPin className="h-4 w-4" />,
  ]

  const textAlign = dir === 'rtl' ? 'text-right' : 'text-left'
  const itemsAlign = dir === 'rtl' ? 'items-end' : 'items-start'
  const justifyStart = dir === 'rtl' ? 'justify-end' : 'justify-start'

  return (
    <footer dir={dir} className="bg-[#04122F] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse gap-9 py-12 sm:py-14 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
          {/* Brand column */}
          <div className={`flex max-w-[420px] flex-col ${itemsAlign} ${textAlign}`}>
            <div className={`flex w-full ${justifyStart}`}>
              <img
                src={logo}
                alt="Bariq Ai"
                className="h-14 w-auto object-contain"
              />
            </div>

            <p className="mt-4 max-w-[420px] text-[14px] leading-[1.9] text-[#A5B4CF] sm:text-[15px]">
              {t.footer.description}
            </p>

            <a
              href="tel:+966539300197"
              className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-[#D7E2F2] transition-colors duration-200 hover:text-[#18C3B3]"
            >
              <span>+966 539300197</span>
              <img src={whatsappIcon} alt="WhatsApp" className="h-[18px] w-[18px] shrink-0 object-contain" />
            </a>
          </div>

          {/* Nav column */}
          <div className={`flex min-w-[140px] flex-col ${itemsAlign} ${textAlign}`}>
            <h3 className="text-[18px] font-extrabold text-white">{t.footer.productTitle}</h3>

            <nav className="mt-4 flex flex-col gap-3" aria-label={t.footer.productTitle}>
              {t.footer.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[14px] text-[#D7E2F2] transition-colors duration-200 hover:text-[#18C3B3]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-white/5" />

        <div className="py-6 sm:py-7">
          <div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-wrap items-start justify-start gap-2.5">
              {t.footer.badges.map((badge, i) => (
                <BadgeItem key={badge.label} label={badge.label} icon={badgeIcons[i]} />
              ))}
            </div>

            <p className="text-[13px] text-[#96A6C3]">{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
