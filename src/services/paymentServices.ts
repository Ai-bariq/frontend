import { apiRequest } from './api'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubscriptionStatus = 'pending' | 'active' | 'past_due' | 'cancelled' | 'expired'
export type PaymentStatus = 'initiated' | 'paid' | 'failed'
export type AttemptType = 'initial' | 'renewal' | 'retry'
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly'

export type PricingSnapshot = {
  pricePerBranch: number
  branchesCount: number
  billingCycle: BillingCycle
  subtotal: number
  discountPercent: number
  discountAmount: number
  finalAmount: number
  currency: string
}

export type Subscription = {
  _id: string
  status: SubscriptionStatus
  billingCycle: BillingCycle
  branchesCount: number
  amount: number
  currency: string
  currentPeriodStart: string
  currentPeriodEnd: string
  nextBillingDate: string
  cancelAtPeriodEnd: boolean
  cancelledAt?: string
  retryCount: number
  pricingSnapshot?: PricingSnapshot
}

export type PaymentMethod = {
  saved?: boolean
  type: string
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export type PaymentRecord = {
  _id: string
  amount: number
  currency: string
  status: PaymentStatus
  attemptType: AttemptType
  createdAt: string
  failureReason?: string
}

export type BillingData = {
  hasSubscription: boolean
  subscription?: Subscription
  paymentMethod?: PaymentMethod
  lastPayment?: PaymentRecord
  paymentHistory: PaymentRecord[]
}

export type CheckoutResponse = {
  success: boolean
  data: {
    subscriptionId: string
    paymentId: string
    amount: number
    currency: string
    billingCycle: BillingCycle
    branchesCount: number
    paymentUrl: string
    pricingSnapshot: PricingSnapshot
  }
}

export type VerifyResult = 'success' | 'pending_verification' | 'not_paid' | 'not_found'

export type VerifyResponse = {
  success: boolean
  data: {
    chargeId?: string
    tapStatus?: string
    result: VerifyResult
    subscriptionId?: string
    subscriptionStatus?: SubscriptionStatus
    providerCode?: string
    message: string
  }
}

export type CancelResponse = {
  success: boolean
  data: {
    subscriptionId: string
    cancelAtPeriodEnd: boolean
    currentPeriodEnd: string
    message: string
  }
}

export type RetryResponse = {
  success: boolean
  data: {
    subscriptionId: string
    paymentId: string
    tapChargeId: string
    tapStatus: string
    retryCount: number
    message: string
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getBillingMe(): Promise<BillingData> {
  const res = await apiRequest<{ success: boolean; data: BillingData }>('/billing/me')
  return res.data
}

export async function createCheckout(params: {
  branchesCount: number
  billingCycle: BillingCycle
}): Promise<CheckoutResponse['data']> {
  const res = await apiRequest<CheckoutResponse>('/payments/create-checkout', {
    method: 'POST',
    body: params,
  })
  return res.data
}

export async function verifyCharge(chargeId: string): Promise<VerifyResponse['data']> {
  const res = await apiRequest<VerifyResponse>(`/payments/verify/${chargeId}`)
  return res.data
}

export async function verifyPayment(paymentId: string): Promise<VerifyResponse['data']> {
  const res = await apiRequest<VerifyResponse>(
    `/payments/verify-payment/${encodeURIComponent(paymentId)}`,
  )
  return res.data
}

export async function cancelSubscription(): Promise<CancelResponse['data']> {
  const res = await apiRequest<CancelResponse>('/subscriptions/cancel', {
    method: 'POST',
  })
  return res.data
}

export async function retryPayment(): Promise<RetryResponse['data']> {
  const res = await apiRequest<RetryResponse>('/subscriptions/retry-payment', {
    method: 'POST',
  })
  return res.data
}
