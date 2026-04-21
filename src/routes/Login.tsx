import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '#/components/LandingSections/Login'
export const Route = createFileRoute('/Login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage />
}
