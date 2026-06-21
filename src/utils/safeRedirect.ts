export function getSafeRedirect(
  value: string | null | undefined,
  fallback = '/ClientDashboard',
): string {
  if (!value) return fallback
  if (value.startsWith('/') && !value.startsWith('//')) return value
  if (typeof window === 'undefined') return fallback

  try {
    const url = new URL(value, window.location.origin)
    if (url.origin !== window.location.origin) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

