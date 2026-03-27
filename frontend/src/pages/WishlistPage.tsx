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
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-lg font-semibold text-slate-900">Chưa có sách yêu thích</div>
          <p className="mt-1 text-sm text-slate-600">Thả tim trên BookCard để lưu lại.</p>
          <Link
            to="/books"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Khám phá sách
          </Link>
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

