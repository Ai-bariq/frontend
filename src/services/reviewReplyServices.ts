import { apiRequest } from './api'

export type ReplyStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'rejected'
  | 'superseded'

/** Virtual status for reviews that have a Google owner reply but no ReviewReply draft yet */
export type DashboardStatus = ReplyStatus | 'external_reply_detected'

/** Simplified status shown in the admin UI */
export type DisplayStatus = 'pending' | 'published' | 'failed' | 'deleted'

export type ReplyType = 'new_reply' | 'edit_existing_reply' | 'regenerate_reply'

/**
 * Shape of `reply.reviewId` after the aggregation $lookup on ZernioReview.
 * Fields match the REVIEW_SELECT projection in getRepliesService.
 */
export type PopulatedReview = {
  _id: string
  reviewerName?: string
  rating: number
  comment?: string
  hasOwnerReply: boolean
  currentOwnerReply?: string
  reviewCreatedAt?: string
  zernioReviewId?: string
  replySource?: string
}

/** Shape of `reply.listing` after the aggregation $lookup on Listing */
export type PopulatedListing = {
  _id: string
  businessName?: string
  locationName?: string
}

export type ReviewReply = {
  _id: string
  /** Populated ZernioReview (aggregation $lookup result) */
  reviewId: PopulatedReview | string
  listingId: string
  clientId: string
  type: ReplyType
  status: ReplyStatus
  aiText?: string
  editedText?: string
  finalText?: string
  originalText?: string
  previousPublishedText?: string
  publishAttempts: number
  lastPublishAttemptAt?: string
  /** Backend field name is errorMessage */
  errorMessage?: string
  /** Populated Listing (aggregation $lookup result) — may be absent if not found */
  listing?: PopulatedListing
  createdAt: string
  updatedAt: string
}

/**
 * One row from GET /zernio-reviews/dashboard.
 * Root fields are the ZernioReview document.
 * `latestReply` is the most recent ReviewReply for this review (may be absent).
 * `listing` is the Listing document (may be absent).
 */
export type DashboardRow = {
  _id: string
  reviewerName?: string
  rating: number
  comment?: string
  hasOwnerReply: boolean
  currentOwnerReply?: string
  reviewCreatedAt?: string
  zernioReviewId?: string
  replySource?: string
  status: string
  listingId: string
  clientId: string
  latestReply?: {
    _id: string
    type: ReplyType
    status: ReplyStatus
    aiText?: string
    editedText?: string
    finalText?: string
    errorMessage?: string
    publishAttempts: number
    createdAt: string
    updatedAt: string
  }
  publishedReply?: {
    _id: string
    type: ReplyType
    status: 'published'
    aiText?: string
    editedText?: string
    finalText?: string
    createdAt: string
    updatedAt: string
  }
  listing?: PopulatedListing
}

/** Derived display status for a DashboardRow */
export function getDashboardStatus(row: DashboardRow): DashboardStatus {
  if (row.latestReply) return row.latestReply.status
  return 'external_reply_detected'
}

/** Maps the full internal status to the UI display status */
export function getDisplayStatus(row: DashboardRow): DisplayStatus {
  const s = getDashboardStatus(row)
  if (s === 'published') return 'published'
  if (s === 'rejected') return 'deleted'
  if (s === 'failed') return 'failed'
  return 'pending' // pending_approval, approved, publishing, external_reply_detected, draft, superseded
}

/** GET /review-replies → ApiResponse wraps { replies, total, page } */
export type GetReviewRepliesResponse = {
  success: boolean
  data: {
    replies: ReviewReply[]
    total: number
    page: number
  }
}

export type ReviewReplyResponse = {
  success: boolean
  data: {
    reply: ReviewReply
  }
}

/** GET /zernio-reviews/dashboard — review-centric dashboard rows */
export function getDashboardRows(
  filters?: { replyStatus?: string; page?: number; limit?: number },
  token?: string | null,
): Promise<{ success: boolean; data: { rows: DashboardRow[]; total: number; page: number } }> {
  const params = new URLSearchParams()
  if (filters?.replyStatus) params.set('replyStatus', filters.replyStatus)
  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.limit) params.set('limit', String(filters.limit))
  const qs = params.toString()
  return apiRequest(`/zernio-reviews/dashboard${qs ? `?${qs}` : ''}`, { token })
}

export function syncDashboardReviews(
  token?: string | null,
): Promise<{
  success: boolean
  data: { skipped: boolean; listings: number; failed: number }
}> {
  return apiRequest('/zernio/admin/sync-reviews', {
    method: 'POST',
    token,
  })
}

export function getReviewReplies(
  filters?: {
    status?: string
    listingId?: string
    page?: number
    limit?: number
  },
  token?: string | null,
): Promise<GetReviewRepliesResponse> {
  const params = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters?.listingId) params.set('listingId', filters.listingId)
  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.limit) params.set('limit', String(filters.limit))
  const qs = params.toString()
  return apiRequest(`/review-replies${qs ? `?${qs}` : ''}`, { token })
}

/** Shared type for the Edited/Deleted audit pages — includes populated client */
export type AuditReply = {
  _id: string
  status: ReplyStatus
  aiText?: string
  editedText?: string
  finalText?: string
  originalText?: string
  previousPublishedText?: string
  publishedAt?: string
  reviewId?: PopulatedReview
  listing?: PopulatedListing
  client?: { name?: string; email?: string }
  updatedAt: string
  createdAt: string
}

export type GetAuditRepliesResponse = {
  success: boolean
  data: { replies: AuditReply[]; total: number; page: number }
}

/**
 * Fetch replies for the Edited or Deleted audit pages.
 * status="published" + edited=true → Edited Responses
 * status="rejected"                → Deleted Responses
 */
export function getAuditReplies(
  filters: { status?: string; edited?: boolean; page?: number; limit?: number },
  token?: string | null,
): Promise<GetAuditRepliesResponse> {
  const params = new URLSearchParams({ limit: String(filters.limit ?? 100) })
  if (filters.status) params.set('status', filters.status)
  if (filters.edited) params.set('edited', 'true')
  if (filters.page) params.set('page', String(filters.page))
  return apiRequest(`/review-replies?${params.toString()}`, { token })
}

/** PATCH /:replyId — backend reads req.body.editedText */
export function updateReviewReplyDraft(
  replyId: string,
  body: { editedText: string },
  token?: string | null,
): Promise<ReviewReplyResponse> {
  return apiRequest(`/review-replies/${replyId}`, {
    method: 'PATCH',
    body,
    token,
  })
}

/** POST /:replyId/approve — backend reads req.body.finalText */
export function approveReviewReply(
  replyId: string,
  body: { finalText: string },
  token?: string | null,
): Promise<ReviewReplyResponse> {
  return apiRequest(`/review-replies/${replyId}/approve`, {
    method: 'POST',
    body,
    token,
  })
}

/** POST /:replyId/reject — backend reads req.body.reason (optional) */
export function rejectReviewReply(
  replyId: string,
  body?: { reason?: string },
  token?: string | null,
): Promise<ReviewReplyResponse> {
  return apiRequest(`/review-replies/${replyId}/reject`, {
    method: 'POST',
    body: body ?? {},
    token,
  })
}

export function retryReviewReplyPublish(
  replyId: string,
  token?: string | null,
): Promise<ReviewReplyResponse> {
  return apiRequest(`/review-replies/${replyId}/retry-publish`, {
    method: 'POST',
    token,
  })
}

/**
 * POST /:reviewId/edit-existing
 * Backend requires editedText in body — throws 400 if empty.
 */
export function createEditExistingReply(
  reviewId: string,
  body: { editedText: string },
  token?: string | null,
): Promise<ReviewReplyResponse> {
  return apiRequest(`/review-replies/${reviewId}/edit-existing`, {
    method: 'POST',
    body,
    token,
  })
}

export function regenerateReviewReply(
  reviewId: string,
  token?: string | null,
): Promise<{ success: boolean; data: ReviewReply }> {
  return apiRequest(`/review-replies/${reviewId}/regenerate`, {
    method: 'POST',
    token,
  })
}

/** DELETE /:replyId — removes the published reply from Google via Zernio */
export function deletePublishedReply(
  replyId: string,
  token?: string | null,
): Promise<ReviewReplyResponse> {
  return apiRequest(`/review-replies/${replyId}`, {
    method: 'DELETE',
    token,
  })
}

/** Helper — safely get the populated review object, or null if not populated */
export function getPopulatedReview(reply: ReviewReply): PopulatedReview | null {
  if (typeof reply.reviewId === 'object' && reply.reviewId !== null) {
    return reply.reviewId as PopulatedReview
  }
  return null
}
