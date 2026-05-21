// /routes/oauth/success.tsx

import { useEffect } from 'react'

export default function OAuthSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (!token) {
      window.location.href = '/login'
      return
    }

    localStorage.setItem('token', token)
    window.location.href = '/ClientDashboard'
  }, [])

  return <p>جاري تسجيل الدخول...</p>
}