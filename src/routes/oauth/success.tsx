import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/oauth/success')({
  component: OAuthSuccessPage,
})

function OAuthSuccessPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const role = params.get('role')

    if (!token) {
      navigate({ to: '/Login', replace: true })
      return
    }

    localStorage.setItem('token', token)

    // Fetch the full user profile so localStorage['user'] has the same shape
    // as a regular email/password login (hasAdminAccess reads role from there).
    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data) {
          localStorage.setItem('user', JSON.stringify(data.data))
        }
      })
      .catch(() => {})
      .finally(() => {
        const adminRoles = ['admin', 'superAdmin']
        // Client-side navigation — beforeLoad runs on the client where
        // localStorage is available, so the auth guard sees the token.
        if (adminRoles.includes(role ?? '')) {
          navigate({ to: '/AdminDashboard', replace: true })
        } else {
          navigate({ to: '/ClientDashboard', replace: true })
        }
      })
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500 text-sm">جاري تسجيل الدخول...</p>
    </div>
  )
}
