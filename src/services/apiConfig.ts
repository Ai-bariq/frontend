const PRODUCTION_API_ORIGIN = 'https://bariq-backend.onrender.com'

export const API_URL = `${
  import.meta.env.DEV
    ? 'http://localhost:8000'
    : PRODUCTION_API_ORIGIN
}/api/v1`
