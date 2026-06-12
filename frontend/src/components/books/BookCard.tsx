import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import { formatVND } from '../../utils/format'
import { useWishlist } from '../../contexts/WishlistContext'
import { useCompare } from '../../contexts/CompareContext'

export function BookCard({
  book,
  showTrendingBadge = false,
  showExclusiveBadge = false,
}: {
  book: Book
  showTrendingBadge?: boolean
  showExclusiveBadge?: boolean
}) {
  const { has: hasWish, toggle: toggleWish } = useWishlist()
  const { has: hasCompare, toggle: toggleCompare } = useCompare()
  const wished = hasWish(book.id)
  const compared = hasCompare(book.id)

  const original = typeof book.originalPrice === 'number' ? book.originalPrice : undefined
  const discountPercent =
    typeof book.discountPercent === 'number'
      ? book.discountPercent
      : original && original > book.price
        ? Math.round(((original - book.price) / original) * 100)
        : undefined

  const rating = typeof book.rating === 'number' ? clamp(book.rating, 0, 5) : undefined
  const ratingCount = typeof book.ratingCount === 'number' ? book.ratingCount : undefined
  const sold = typeof book.sold === 'number' ? book.sold : undefined
  const views = typeof book.views === 'number' ? book.views : undefined

  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[#E6E6E6] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="p-3 pb-0 relative">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-[#F7F9FA] flex items-center justify-center p-4 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
          <img
            src={book.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-L.jpg'}
            alt={book.title}
            className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          
          {/* Discount / New Badges (Top Left) */}
          <div className="absolute left-2 top-2 flex flex-col gap-1 z-10 pointer-events-none">
            {book.isNew && (
              <span className="inline-flex items-center rounded bg-[#1A365D] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                NEW
              </span>
            )}
            {discountPercent ? (
              <span className="inline-flex items-center rounded bg-[#C2410C] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                -{discountPercent}%
              </span>
            ) : null}
            {showExclusiveBadge || (book.price && book.price > 250000) ? (
              <span className="inline-flex items-center rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                Độc Quyền
              </span>
            ) : null}
          </div>
          
          {/* Wishlist & Compare (Top Right) */}
          <div className="absolute right-2 top-2 flex gap-1 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                toggleWish(book)
              }}
              className={[
                'inline-flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm transition-all',
                wished
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
              ].join(' ')}
              aria-label="Yêu thích"
              title="Yêu thích"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                toggleCompare(book)
              }}
              className={[
                'inline-flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm transition-all',
                compared
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white/90 text-slate-600 hover:bg-white hover:text-[#1A365D] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
              ].join(' ')}
              aria-label="So sánh"
              title="So sánh"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M5 9h2v10H5V9Zm6-4h2v14h-2V5Zm6 7h2v7h-2v-7Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="line-clamp-2 text-sm font-semibold leading-snug text-[#212121] dark:text-[#F8FAFC]">
            {showTrendingBadge && (
              <span className="inline-flex items-center gap-0.5 rounded bg-[#C2410C] px-1 py-0.5 text-[9px] font-black uppercase text-white mr-1.5 shadow-sm select-none align-middle">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Xu hướng
              </span>
            )}
            <span className="align-middle">{book.title}</span>
          </div>
          <div className="line-clamp-1 text-xs text-slate-550 dark:text-slate-450">{book.author ?? '—'}</div>
        </div>

        <div className="space-y-1.5 mt-auto">
          {/* Rating and Sold */}
          <div className="flex items-center justify-between gap-2">
            {rating !== undefined ? (
              <div className="flex items-center gap-1 text-[11px]">
                <Stars value={rating} />
                <span className="font-semibold text-slate-705 dark:text-slate-300">{rating.toFixed(1)}</span>
                {ratingCount ? (
                  <span className="text-slate-400">({formatCompact(ratingCount)})</span>
                ) : null}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400">—</div>
            )}
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {sold !== undefined ? `${formatCompact(sold)} đã bán` : '—'}
            </div>
          </div>

          {/* Price and original price */}
          <div className="flex items-end justify-between gap-1.5 pt-0.5">
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#1A365D] dark:text-blue-400">{formatVND(book.price)}</div>
              {original && original > book.price ? (
                <div className="text-[10px] text-slate-400 line-through leading-none">{formatVND(original)}</div>
              ) : null}
            </div>
            <div className="text-[10px] text-slate-405 font-medium shrink-0">
              {views !== undefined ? `${formatCompact(views)} xem` : '—'}
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function formatCompact(n: number) {
  try {
    return new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
  } catch {
    return String(n)
  }
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="inline-flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} filled />
      ))}
      {half ? <Star key="h" half /> : null}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} />
      ))}
    </span>
  )
}

function Star({ filled, half }: { filled?: boolean; half?: boolean }) {
  if (half) {
    return (
      <span className="relative inline-flex h-3.5 w-3.5">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-300">
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
          />
        </svg>
        <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-400">
            <path
              fill="currentColor"
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
            />
          </svg>
        </span>
      </span>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={['h-3.5 w-3.5', filled ? 'text-amber-400' : 'text-slate-300'].join(' ')}>
      <path
        fill="currentColor"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
      />
    </svg>
  )
}
