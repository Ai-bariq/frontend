/// <reference types="vite/client" />

import appCss from '../styles.css?url'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import type { RouterAppContext } from '../router'
import '../styles.css'
import { LocaleProvider, useLocale } from '../contexts/LocaleContext'
import { AUTH_UNAUTHORIZED_EVENT } from '../services/api'
import { clearAuthStorage } from '../utils/auth'

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', href: '/og-image.png' },
    ],
    meta: [
      { title: 'Bariq AI' },
      // Prevent dark-mode browser flash on page load/navigation.
      // The app uses explicit light backgrounds on all pages; telling the
      // browser this avoids it painting a dark UA background before CSS loads.
      { name: 'color-scheme', content: 'light' },
      {
        name: 'description',
        content:
          'Bariq AI helps businesses manage customer reviews, automate professional replies, and improve their online reputation from one smart dashboard.',
      },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://bariqai.io' },
      { property: 'og:title', content: 'Bariq AI – Smart Google Maps Review Management' },
      {
        property: 'og:description',
        content:
          'Bariq AI helps businesses manage customer reviews, automate professional replies, and improve their online reputation from one smart dashboard.',
      },
      { property: 'og:image', content: 'https://bariqai.io/og-image.png' },
      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Bariq AI – Smart Google Maps Review Management' },
      {
        name: 'twitter:description',
        content:
          'Bariq AI helps businesses manage customer reviews, automate professional replies, and improve their online reputation from one smart dashboard.',
      },
      { name: 'twitter:image', content: 'https://bariqai.io/og-image.png' },
    ],
  }),
  component: RootLayout,
})

function AppShell() {
  const { dir } = useLocale()
  const router = useRouter()

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      clearAuthStorage()
      const redirect = (event as CustomEvent<{ redirect?: string }>).detail
        ?.redirect
      router.navigate({
        to: '/Login',
        search: redirect ? { redirect } : undefined,
      })
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [router])

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col bg-background text-foreground font-sans"
    >
      <Outlet />
    </div>
  )
}

function RootLayout() {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <LocaleProvider>
          <AppShell />
        </LocaleProvider>
        <Scripts />
      </body>
    </html>
  )
}
