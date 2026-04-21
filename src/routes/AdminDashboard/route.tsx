import { createFileRoute, Outlet } from '@tanstack/react-router'
import AdminLayout from '../../components/Admin/AdminLayout'

export const Route = createFileRoute('/AdminDashboard')({
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