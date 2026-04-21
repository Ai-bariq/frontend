import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export interface RouterAppContext {
  auth: {
    isAuthenticated: boolean
  }
}

export function getRouter() {
  return createRouter({
    routeTree,
    context: {
      auth: {
        isAuthenticated: true,
      },
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => (
      <div className="p-6 text-sm">Page not found.</div>
    ),
  })
}

export const router = getRouter()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}