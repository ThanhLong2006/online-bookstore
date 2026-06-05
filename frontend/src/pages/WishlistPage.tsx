import { Link } from 'react-router-dom'
import { BookCard } from '../components/books/BookCard'
import { useWishlist } from '../contexts/WishlistContext'

export function WishlistPage() {
  const { items, count, clear } = useWishlist()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Yêu thích</h1>
          <p className="text-sm text-slate-600">Bạn có {count} sách trong danh sách yêu thích.</p>
        </div>
        {count ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Xoá tất cả
          </button>
        ) : null}
      </div>

      {count === 0 ? (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-20 px-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Illustration */}
          <div className="relative mb-6">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/20">
              <svg viewBox="0 0 64 64" className="h-16 w-16 text-rose-300 dark:text-rose-700" fill="none">
                <path d="M32 56l-2.5-2.28C12 37.36 4 30.28 4 21.5 4 14.42 9.42 9 16.5 9c3.74 0 7.41 1.81 9.5 4.09C28.09 10.81 31.76 9 35.5 9 42.58 9 48 14.42 48 21.5c0 8.78-8 15.86-17.5 26.22L32 56z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 26 h8 M24 22 v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            {/* Floating book icons */}
            <div className="absolute -right-3 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 shadow-sm dark:bg-indigo-950/40">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-400"><path fill="currentColor" d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-6 2 1 2H9l1-2h2zm6 16H6V4h2v4h8V4h2v16z"/></svg>
            </div>
            <div className="absolute -left-3 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 shadow-sm dark:bg-amber-950/40">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-400"><path fill="currentColor" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Chưa có sách yêu thích
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Nhấn vào biểu tượng ❤️ trên thẻ sách để lưu lại những cuốn bạn quan tâm nhất.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/books"
              className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-slate-800 dark:hover:bg-indigo-700"
            >
              Khám phá sách ngay
            </Link>
            <Link
              to="/books?sort=newest"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sách mới nhất
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((b) => (
            <BookCard key={String(b.id)} book={b} />
          ))}
        </div>
      )}
    </div>
  )
}

