import { useEffect, useState } from 'react'
import { AUTH_UNAUTHORIZED_EVENT } from '../services/api'
import { API_URL } from '../services/apiConfig'
import { clearAuthStorage } from './auth'

export type CurrentUser = {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string | null
  role: string
  isEmailVerified?: boolean
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const cachedUser = localStorage.getItem('user')
      if (!cachedUser) {
        setUser(null)
        return
      }

      try {
        const res = await fetch(`${API_URL}/users/me`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })

        if (res.status === 401) {
          clearAuthStorage()
          window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
          setUser(null)
          return
        }

        const data = await res.json()

        if (!res.ok || !data?.success) {
          setUser(null)
          return
        }

        setUser(data.data)
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        setUser(null)
      }
    }

    fetchCurrentUser()
  }, [])

  return user
}
