import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/AdminDashboard/')({
  beforeLoad: () => {
    throw redirect({ to: '/AdminDashboard/AdminHome' })
  },
})
