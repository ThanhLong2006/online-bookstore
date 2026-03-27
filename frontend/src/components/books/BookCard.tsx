import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import { formatVND } from '../../utils/format'
import { useWishlist } from '../../contexts/WishlistContext'
import { useCompare } from '../../contexts/CompareContext'

export function BookCard({ book }: { book: Book }) {
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
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] w-full bg-slate-100">
        <img
          src={book.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-L.jpg'}
          alt={book.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5">
          {book.isNew ? (
            <span className="inline-flex items-center rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
              New
            </span>
          ) : null}
          {discountPercent ? (
            <span className="inline-flex items-center rounded-full bg-rose-600 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
              -{discountPercent}%
            </span>
          ) : null}
        </div>

        <div className="absolute right-2 top-2 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              toggleWish(book)
            }}
            className={[
              'inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition',
              wished
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 bg-white/90 text-slate-600 hover:bg-white',
            ].join(' ')}
            aria-label="Yêu thích"
            title="Yêu thích"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
              'inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition',
              compared
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white/90 text-slate-600 hover:bg-white',
            ].join(' ')}
            aria-label="So sánh"
            title="So sánh"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M5 9h2v10H5V9Zm6-4h2v14h-2V5Zm6 7h2v7h-2v-7Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="space-y-0.5">
          <div className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
            {book.title}
          </div>
          <div className="line-clamp-1 text-xs text-slate-500">{book.author ?? '—'}</div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {rating !== undefined ? (
            <div className="flex items-center gap-1 text-xs">
              <Stars value={rating} />
              <span className="font-semibold text-slate-700">{rating.toFixed(1)}</span>
              {ratingCount ? (
                <span className="text-slate-500">({formatCompact(ratingCount)})</span>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-slate-500">—</div>
          )}
          <div className="text-xs text-slate-500">
            {sold !== undefined ? `${formatCompact(sold)} đã bán` : '—'}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-base font-extrabold text-indigo-700">{formatVND(book.price)}</div>
            {original && original > book.price ? (
              <div className="text-xs text-slate-500 line-through">{formatVND(original)}</div>
            ) : null}
          </div>
          <div className="text-xs text-slate-500">
            {views !== undefined ? `${formatCompact(views)} xem` : '—'}
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
      <span className="relative inline-flex h-4 w-4">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-300">
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
          />
        </svg>
        <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-400">
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
    <svg viewBox="0 0 24 24" className={['h-4 w-4', filled ? 'text-amber-400' : 'text-slate-300'].join(' ')}>
      <path
        fill="currentColor"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
      />
    </svg>
  )
}

