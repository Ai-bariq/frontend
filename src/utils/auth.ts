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
