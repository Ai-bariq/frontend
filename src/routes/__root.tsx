/// <reference types="vite/client" />

import appCss from '../styles.css?url'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import type { RouterAppContext } from '../router'
import '../styles.css'

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    links: [{ rel: 'stylesheet', href: appCss }],
    meta: [
      { title: 'Bariq Ai' },
      { name: 'description', content: 'Application built with TanStack Router' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <HeadContent />
      <div
        dir="rtl"
        className="min-h-screen flex flex-col bg-background text-foreground font-sans"
      >
        <Outlet />
      </div>
      <Scripts />
    </>
  )
}