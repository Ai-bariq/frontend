import { createFileRoute, Outlet } from '@tanstack/react-router'
import ClientDashboardLayout from '../../components/Client/ClientDashboardLayout'

export const Route = createFileRoute('/ClientDashboard')({
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
  return (
    <ClientDashboardLayout>
      <Outlet />
    </ClientDashboardLayout>
  )
}