const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const API_URL = (
  configuredApiUrl ||
  (import.meta.env.DEV ? 'http://localhost:8000/api/v1' : '/api/v1')
).replace(/\/+$/, '')

