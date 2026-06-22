import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'
import { apiRequest } from '../services/api'
import { API_URL } from '../services/apiConfig'
import { clearAuthStorage, hasAdminAccess, isAuthenticated } from '../utils/auth'
import { getBillingMe, verifyCharge } from '../services/paymentServices'
import { server } from './setup'
import { getSafeRedirect } from '../utils/safeRedirect'

describe('secure browser session flow', () => {
  test('preserves same-origin absolute checkout return URLs', () => {
    expect(
      getSafeRedirect(
        `${window.location.origin}/subscribe?billingCycle=yearly&branchesCount=3`,
      ),
    ).toBe('/subscribe?billingCycle=yearly&branchesCount=3')
    expect(getSafeRedirect('https://attacker.example/checkout')).toBe(
      '/ClientDashboard',
    )
  })

  test('reports an API configuration error instead of parsing an HTML page as JSON', async () => {
    server.use(
      http.post(`${API_URL}/auth/signup/request-otp`, () =>
        new HttpResponse('<meta name="description" content="frontend page">', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        }),
      ),
    )

    await expect(
      apiRequest('/auth/signup/request-otp', {
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+966551234567',
          password: 'Password123',
        },
      }),
    ).rejects.toThrow(
      'The API URL is misconfigured and returned a web page instead of data.',
    )
  })

  test('uses the non-sensitive user cache as the route hint', () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }))
    expect(isAuthenticated()).toBe(true)
    expect(hasAdminAccess()).toBe(true)
    clearAuthStorage()
    expect(isAuthenticated()).toBe(false)
  })

  test('rotates the cookie session and retries one unauthorized API call', async () => {
    let calls = 0
    server.use(
      http.get(`${API_URL}/users/me`, () => {
        calls += 1
        return calls === 1
          ? HttpResponse.json({ message: 'expired' }, { status: 401 })
          : HttpResponse.json({ data: { id: 'u1' } })
      }),
      http.post(`${API_URL}/auth/refresh`, () =>
        HttpResponse.json({ success: true }),
      ),
    )
    const result = await apiRequest<{ data: { id: string } }>('/users/me')
    expect(result.data.id).toBe('u1')
    expect(calls).toBe(2)
  })
})

describe('billing API contracts', () => {
  test('billing page reads the real subscription response', async () => {
    server.use(
      http.get(`${API_URL}/billing/me`, () =>
        HttpResponse.json({
          success: true,
          data: {
            hasSubscription: true,
            subscription: { status: 'past_due', branchesCount: 2 },
            paymentHistory: [],
          },
        }),
      ),
    )
    const billing = await getBillingMe()
    expect(billing.subscription?.status).toBe('past_due')
    expect(billing.subscription?.branchesCount).toBe(2)
  })

  test('payment result uses the authenticated server verification endpoint', async () => {
    let requestedMethod = ''
    server.use(
      http.get(`${API_URL}/payments/verify/chg_1`, ({ request }) => {
        requestedMethod = request.method
        return HttpResponse.json({
          success: true,
          data: {
            chargeId: 'chg_1',
            tapStatus: 'CAPTURED',
            result: 'pending_verification',
            message: 'Awaiting webhook',
          },
        })
      }),
    )
    const result = await verifyCharge('chg_1')
    expect(requestedMethod).toBe('GET')
    expect(result.result).toBe('pending_verification')
  })
})
