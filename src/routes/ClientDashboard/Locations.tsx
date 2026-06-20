import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * Locations are created only through the provider-driven Google Business flow.
 * Keep the legacy URL working, but never expose the old manual branch form.
 */
export const Route = createFileRoute('/ClientDashboard/Locations')({
  beforeLoad: () => {
    throw redirect({ to: '/ClientDashboard/Accounts' })
  },
  component: () => null,
})
