import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '#/components/LandingSections/Login'

export const Route = createFileRoute('/Login')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect } = Route.useSearch()
  return <LoginPage initialMode="login" redirectTo={redirect} />
}
