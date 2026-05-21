import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

type CurrentUser = {
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
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(`${API_URL}/users/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })

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