/**
 * Synchronous auth check — safe to call in beforeLoad (client-side only).
 * Returns true if a token exists in localStorage.
 * This is the route-guard signal; server-side rendering will see false and
 * must not render protected content without a cookie-based check.
 */
export function isAuthenticated(): boolean {
  // SSR cannot read the API host's HTTP-only cookie. Defer enforcement to the
  // browser/API instead of incorrectly redirecting valid sessions on reload.
  if (typeof window === 'undefined') return true
  return !!localStorage.getItem('user')
}

/**
 * Confirm authentication with the backend before entering sensitive flows.
 * localStorage is only a UI hint and may outlive the secure session cookie.
 */
export async function hasValidSession(): Promise<boolean> {
  if (typeof window === 'undefined') return true

  try {
    const response = await fetch(`${API_URL}/users/me`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      clearAuthStorage()
      return false
    }

    const payload = await response.json()
    if (!payload?.success || !payload?.data) {
      clearAuthStorage()
      return false
    }

    localStorage.setItem('user', JSON.stringify(payload.data))
    return true
  } catch {
    // Do not permit checkout when session validity cannot be confirmed.
    return false
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message === 'Unauthorized' || error.message.includes('401'))
  )
}

export function hasAdminAccess(): boolean {
  if (typeof window === 'undefined') return true
  if (!isAuthenticated()) return false

  try {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return false

    const role = JSON.parse(storedUser)?.role
    return role === 'admin' || role === 'superAdmin'
  } catch {
    return false
  }
}

/** Remove all auth artifacts from local storage. */
export function clearAuthStorage(): void {
  localStorage.removeItem('user')
}
import { API_URL } from '../services/apiConfig'
