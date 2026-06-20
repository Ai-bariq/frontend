import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL

export const Route = createFileRoute('/oauth/success')({
  component: OAuthSuccessPage,
})

function OAuthSuccessPage() {
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/users/me`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('OAuth session was not established')
        return res.json()
      })
      .then((body) => {
        const user = body?.data
        if (!user) throw new Error('User profile is missing')
        localStorage.setItem('user', JSON.stringify(user))
        const isAdmin = user.role === 'admin' || user.role === 'superAdmin'
        navigate({
          to: isAdmin ? '/AdminDashboard' : '/ClientDashboard',
          replace: true,
        })
      })
      .catch(() => navigate({ to: '/Login', replace: true }))
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-slate-500">جاري تسجيل الدخول...</p>
    </div>
  )
}
