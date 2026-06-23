import { createFileRoute, Link } from '@tanstack/react-router'
import {
  LayoutGrid,
  List,
  LoaderCircle,
  MapPin,
  MessageSquareText,
  Search,
  Star,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../services/api'

export const Route = createFileRoute('/ClientDashboard/Reviews')({
  component: ReviewsPage,
})

type Envelope<T> = { data: T }
type Listing = {
  _id: string
  businessName?: string
  locationName?: string
  status: string
}
type Review = {
  _id: string
  reviewerName?: string
  rating: number
  comment?: string
  reviewCreatedAt: string
  currentOwnerReply?: string | null
  hasOwnerReply?: boolean
  status: string
  latestReply?: {
    status: string
    finalText?: string
    aiText?: string
    editedText?: string
  } | null
}
type Analytics = {
  summary: { averageRating: number }
  charts: {
    ratingDistribution: Array<{ stars: number; count: number }>
  }
}

function ReviewsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [listingId, setListingId] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [total, setTotal] = useState(0)
  const [rating, setRating] = useState(0)
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadListings = async () => {
      try {
        await apiRequest('/zernio/sync-reviews', {
          method: 'POST',
        }).catch(() => null)
        const response = await apiRequest<
          Envelope<{ listings: Listing[] }>
        >('/listings')
        const connected = (response.data?.listings ?? []).filter(
          (listing) => listing.status === 'connected',
        )
        setListings(connected)
        setListingId(connected[0]?._id ?? '')
        if (!connected.length) setLoading(false)
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'تعذر تحميل المواقع.',
        )
        setLoading(false)
      }
    }
    void loadListings()
  }, [])

  useEffect(() => {
    if (!listingId) return
    const loadReviews = async () => {
      setLoading(true)
      setError(null)
      try {
        const [reviewResponse, analyticsResponse] = await Promise.all([
          apiRequest<
            Envelope<{ reviews: Review[]; total: number }>
          >(
            `/zernio-reviews?listingId=${encodeURIComponent(listingId)}&limit=100`,
          ),
          apiRequest<Envelope<Analytics>>(
            `/client/dashboard/analytics?listingId=${encodeURIComponent(listingId)}&range=180d`,
          ),
        ])
        setReviews(reviewResponse.data.reviews ?? [])
        setTotal(reviewResponse.data.total ?? 0)
        setAnalytics(analyticsResponse.data)
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'تعذر تحميل التقييمات.',
        )
      } finally {
        setLoading(false)
      }
    }
    void loadReviews()
  }, [listingId])

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return reviews.filter((review) => {
      if (rating && review.rating !== rating) return false
      if (!normalizedQuery) return true
      return [review.reviewerName, review.comment, review.currentOwnerReply]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery))
    })
  }, [reviews, rating, query])

  if (!loading && listings.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
        <MapPin className="h-12 w-12 text-teal-600" />
        <h1 className="mt-5 text-3xl font-extrabold text-slate-900">
          اربط موقعاً لعرض التقييمات
        </h1>
        <Link
          to="/ClientDashboard/Accounts"
          className="mt-6 rounded-xl bg-teal-600 px-5 py-3 font-bold text-white"
        >
          إضافة موقع
        </Link>
      </div>
    )
  }

  const selectedListing = listings.find(
    (listing) => listing._id === listingId,
  )
  const distribution = analytics?.charts.ratingDistribution ?? []
  const maxDistribution = Math.max(
    1,
    ...distribution.map((item) => item.count),
  )

  return (
    <section dir="rtl" className="w-full py-6 text-right">
      <div className="mx-auto max-w-[1380px]">
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">
              مركز التقييمات
            </h1>
            <p className="mt-2 text-slate-500">
              تقييمات Google والردود الفعلية لكل موقع.
            </p>
          </div>
          <select
            value={listingId}
            onChange={(event) => setListingId(event.target.value)}
            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold sm:w-auto"
          >
            {listings.map((listing) => (
              <option key={listing._id} value={listing._id}>
                {listing.locationName || listing.businessName || 'موقع'}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm text-slate-500">
                {selectedListing?.locationName ||
                  selectedListing?.businessName}
              </p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {total} تقييم
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
              <span className="text-4xl font-extrabold">
                {analytics?.summary.averageRating.toFixed(1) ?? '0.0'}
              </span>
              <span className="text-slate-400">/ 5</span>
            </div>
          </div>
          <div className="mt-5 grid gap-2 md:grid-cols-5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count =
                distribution.find((item) => item.stars === stars)?.count ?? 0
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setRating(rating === stars ? 0 : stars)}
                  className={`rounded-xl border p-3 text-right ${
                    rating === stars
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-200'
                  }`}
                >
                  <span className="font-bold">{stars} ★</span>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-teal-600"
                      style={{
                        width: `${(count / maxDistribution) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="mt-2 block text-xs text-slate-500">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-0 flex-1 basis-full sm:min-w-[280px]">
            <Search className="absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="البحث في التقييمات والردود..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-11"
            />
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`rounded-lg p-2 ${layout === 'grid' ? 'bg-teal-50 text-teal-700' : ''}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('list')}
              className={`rounded-lg p-2 ${layout === 'list' ? 'bg-teal-50 text-teal-700' : ''}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center text-teal-600">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredReviews.length ? (
          <div
            className={`mt-5 ${
              layout === 'grid'
                ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
                : 'space-y-4'
            }`}
          >
            {filteredReviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 text-slate-500">
            <MessageSquareText className="h-10 w-10" />
            <p className="mt-3 font-bold">لا توجد تقييمات مطابقة.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const deletedByReviewer = review.status === 'review_deleted'
  const reply =
    review.currentOwnerReply ||
    review.latestReply?.finalText ||
    review.latestReply?.editedText ||
    review.latestReply?.aiText

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 font-extrabold text-teal-700">
            {(review.reviewerName || 'G').trim().charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900">
              {review.reviewerName || 'عميل Google'}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {formatDate(review.reviewCreatedAt)}
            </p>
          </div>
        </div>
        <div className="text-amber-500">
          {'★'.repeat(review.rating)}
          <span className="text-slate-200">
            {'★'.repeat(Math.max(0, 5 - review.rating))}
          </span>
        </div>
      </div>

      <p className="mt-5 min-h-12 leading-7 text-slate-700">
        {review.comment || 'تقييم بدون تعليق'}
      </p>

      {deletedByReviewer ? (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
          Deleted by Reviewer
        </div>
      ) : reply ? (
        <div className="mt-5 rounded-xl border-r-4 border-teal-500 bg-teal-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-teal-800">
              AI Agent Response
            </span>
            {review.latestReply?.status ? (
              <span className="text-[11px] text-teal-700">
                {statusLabel(review.latestReply.status)}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">{reply}</p>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-700">
          Under Review
        </div>
      )}
    </article>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    published: 'منشور',
    pending_approval: 'بانتظار الموافقة',
    approved: 'معتمد',
    failed: 'فشل النشر',
    superseded: 'مستبدل',
    rejected: 'مرفوض',
  }
  return labels[status] || status
}
