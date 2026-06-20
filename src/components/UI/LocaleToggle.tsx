import type { Locale } from '../../locales'
import { useLocale } from '../../contexts/LocaleContext'

interface LocaleToggleProps {
  className?: string
}

export default function LocaleToggle({ className = '' }: LocaleToggleProps) {
  const { locale, setLocale } = useLocale()
  return (
    <button
      type="button"
      onClick={() => setLocale((locale === 'ar' ? 'en' : 'ar') as Locale)}
      aria-label="Toggle language"
      className={`text-base font-bold text-primary transition-opacity hover:opacity-70 ${className}`}
    >
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  )
}
