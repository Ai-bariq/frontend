import { API_URL } from './apiConfig'

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
    const redirect =
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    window.dispatchEvent(
      new CustomEvent(AUTH_UNAUTHORIZED_EVENT, { detail: { redirect } }),
    )
    throw new Error('Unauthorized')
  }

  const contentType = res.headers.get('content-type') || ''
  const responseText = await res.text()
  let data: any = null

  if (responseText) {
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(responseText)
      } catch {
        throw new Error('The API returned invalid JSON. Please try again.')
      }
    } else {
      throw new Error(
        res.ok
          ? 'The API URL is misconfigured and returned a web page instead of data.'
          : `The server returned an unexpected response (${res.status}). Please try again.`,
      )
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Something went wrong')
  }

  return data as T
}
