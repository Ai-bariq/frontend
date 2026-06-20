import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import AdminLayout from '../../components/Admin/AdminLayout'
import { hasAdminAccess, isAuthenticated } from '../../utils/auth'

export const Route = createFileRoute('/AdminDashboard')({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/Login',
        search: { redirect: location.href },
      })
    }

    if (!hasAdminAccess()) {
      throw redirect({ to: '/ClientDashboard' })
    }

    if (location.pathname === '/AdminDashboard' || location.pathname === '/AdminDashboard/') {
      throw redirect({ to: '/AdminDashboard/AdminHome' })
    }
  },
  head: () => ({
    meta: [
      {
        title: 'Bariq Ai | Admin Dashboard',
      },
    ],
  }),
  component: AdminDashboardRouteLayout,
})

function AdminDashboardRouteLayout() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
