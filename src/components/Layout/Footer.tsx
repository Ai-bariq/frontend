import { MapPin, ShieldCheck } from 'lucide-react'
import logo from '../../assets/logo.png'
import whatsappIcon from '../../assets/whatsapp.svg'
import type { ReactNode } from 'react'

type FooterLink = {
  label: string
  href: string
}

type FooterBadge = {
  label: string
  icon: ReactNode
}

const FOOTER_CONTENT = {
  brandName: 'Repma',
  description:
    'موظفك الرقمي للردود التلقائية على تقييمات خرائط جوجل باللهجة السعودية البيضاء الأصيلة. صفر صيانة، جودة عالية.',
  phone: '+966 123456789',
  productTitle: 'المنتج',
  copyright: '© 2026 Repma. جميع الحقوق محفوظة.',
  links: [
    { label: 'ابدأ الآن', href: '/login' },
    { label: 'الأسعار', href: '#pricing' },
    { label: 'المميزات', href: '#features' },
    { label: 'التجربة', href: '/login' },
  ] satisfies FooterLink[],
  badges: [
    { label: 'آمن 100%', icon: <ShieldCheck className="h-4 w-4" /> },
    {
      label: 'صُنع في السعودية',
      icon: <span className="text-[14px] leading-none">🇸🇦</span>,
    },
    { label: 'خرائط جوجل', icon: <MapPin className="h-4 w-4" /> },
  ] satisfies FooterBadge[],
} as const

const STYLES = {
  section: 'bg-[#04122F] text-white',
  container: 'mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8',

  main:
    'flex flex-col-reverse gap-9 py-12 sm:py-14 lg:flex-row lg:items-start lg:justify-between lg:gap-14',

  brandColumn: 'flex max-w-[420px] flex-col items-start text-right',
  brandLogoWrap: 'flex w-full justify-start',
  brandLogo: 'h-14 w-auto object-contain',

  description:
    'mt-4 max-w-[420px] text-[14px] leading-[1.9] text-[#A5B4CF] sm:text-[15px]',

  phoneLink:
    'mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-[#D7E2F2] transition-colors duration-200 hover:text-[#18C3B3]',
  phoneIcon: 'h-[18px] w-[18px] shrink-0 object-contain',

  navColumn: 'flex min-w-[140px] flex-col items-start text-right',
  navTitle: 'text-[18px] font-extrabold text-white',
  navList: 'mt-4 flex flex-col gap-3',
  navLink:
    'text-[14px] text-[#D7E2F2] transition-colors duration-200 hover:text-[#18C3B3]',

  divider: 'my-4 h-px w-full bg-white/5',

  bottom: 'py-6 sm:py-7',
  bottomInner:
    'flex w-full flex-col items-start gap-4 lg:flex-row lg:items-start lg:justify-between',

  badgesWrap: 'flex flex-wrap items-start justify-start gap-2.5',
  badge:
    'inline-flex items-center gap-2 rounded-full bg-[#081A45] px-4 py-2 text-[14px] font-medium',
  badgeIcon: 'text-[#18C3B3] text-[15px]',

  copyright: 'text-[13px] text-[#96A6C3]',
} as const

function FooterBadgeItem({ label, icon }: FooterBadge) {
  return (
    <div className={STYLES.badge}>
      <span>{label}</span>
      <span className={STYLES.badgeIcon}>{icon}</span>
    </div>
  )
}

function FooterLinks() {
  return (
    <div className={STYLES.navColumn}>
      <h3 className={STYLES.navTitle}>{FOOTER_CONTENT.productTitle}</h3>

      <nav className={STYLES.navList} aria-label={FOOTER_CONTENT.productTitle}>
        {FOOTER_CONTENT.links.map((link) => (
          <a key={link.label} href={link.href} className={STYLES.navLink}>
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}

function FooterBrand() {
  return (
    <div className={STYLES.brandColumn}>
      <div className={STYLES.brandLogoWrap}>
        <img
          src={logo}
          alt={FOOTER_CONTENT.brandName}
          className={STYLES.brandLogo}
        />
      </div>

      <p className={STYLES.description}>{FOOTER_CONTENT.description}</p>

      <a href={`tel:${FOOTER_CONTENT.phone}`} className={STYLES.phoneLink}>
        <span>{FOOTER_CONTENT.phone}</span>
        <img
          src={whatsappIcon}
          alt="WhatsApp"
          className={STYLES.phoneIcon}
        />
      </a>
    </div>
  )
}

export default function Footer() {
  return (
    <footer dir="rtl" className={STYLES.section}>
      <div className={STYLES.container}>
        <div className={STYLES.main}>
          <FooterBrand />
          <FooterLinks />
        </div>

        <div className={STYLES.divider} />

        <div className={STYLES.bottom}>
          <div className={STYLES.bottomInner}>
            <div className={STYLES.badgesWrap}>
              {FOOTER_CONTENT.badges.map((badge) => (
                <FooterBadgeItem
                  key={badge.label}
                  label={badge.label}
                  icon={badge.icon}
                />
              ))}
            </div>

            <p className={STYLES.copyright}>
              {FOOTER_CONTENT.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}