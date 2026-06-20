const API_URL = import.meta.env.VITE_API_URL

type ApiOptions = {
  method?: string
  body?: unknown
  token?: string | null
}

/**
 * Dispatched when any API call receives a 401.
 * The root layout listens for this event and redirects to /Login.
 */
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const execute = () => fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  let res = await execute()
  if (res.status === 401 && endpoint !== '/auth/refresh') {
    const refreshed = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (refreshed.ok) res = await execute()
  }

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
    throw new Error('Unauthorized')
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}
