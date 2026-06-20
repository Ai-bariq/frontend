import { createFileRoute, redirect } from '@tanstack/react-router'
import ClientDashboardLayout from '../../components/Client/ClientDashboardLayout'
import { isAuthenticated } from '../../utils/auth'

export const Route = createFileRoute('/ClientDashboard')({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/Login',
        search: { redirect: location.href },
      })
    }
  },
  head: () => ({
    meta: [
      {
        title: 'Bariq Ai | Dashboard',
      },
    ],
  }),
  component: ClientDashboardRouteLayout,
})

function ClientDashboardRouteLayout() {
  return <ClientDashboardLayout />
}