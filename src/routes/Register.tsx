import { createFileRoute, redirect } from '@tanstack/react-router'
import LoginPage from '#/components/LandingSections/Login'
import { isAuthenticated } from '../utils/auth'

export const Route = createFileRoute('/Register')({
  beforeLoad: () => {
    // Redirect already-authenticated users away from the register page
    if (isAuthenticated()) {
      throw redirect({ to: '/ClientDashboard' })
    }
  },
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage initialMode="signup" />
}
