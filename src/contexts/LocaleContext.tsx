import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { ar, en } from '../locales'
import type { Locale, LocaleStrings } from '../locales'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: LocaleStrings
  dir: 'rtl' | 'ltr'
  isRTL: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const LOCALE_STORAGE_KEY = 'bariq_locale'

const localeMap: Record<Locale, LocaleStrings> = { ar, en }

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Always start with 'ar' so SSR and the client's initial hydration pass agree.
  // A useEffect then reads localStorage and corrects to the stored preference —
  // this avoids a React hydration mismatch which would render a blocking error overlay.
  const [locale, setLocaleState] = useState<Locale>('ar')

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'en') setLocaleState('en')
  }, [])

  const setLocale = (next: Locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
    setLocaleState(next)
  }

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: localeMap[locale],
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    isRTL: locale === 'ar',
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
