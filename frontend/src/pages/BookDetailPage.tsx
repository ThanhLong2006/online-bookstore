import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBook } from '../services/api/books'
import type { Book } from '../types/book'
import { useCart } from '../contexts/CartContext'
import { formatVND } from '../utils/format'
import { mockGetRelatedBooks } from '../services/api/mockData'

export function BookDetailPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [book, setBook] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()
  const [related, setRelated] = useState<Book[]>([])

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    let mounted = true
    setLoading(true)
    setError(null)

    getBook(id, controller.signal)
      .then((res) => {
        if (!mounted) return
        setBook(res)
        setRelated(mockGetRelatedBooks(res, 6))
      })
      .catch((e) => {
        if (!mounted) return
        if (controller.signal.aborted || e?.name === 'AbortError') return
        setError(typeof e?.message === 'string' ? e.message : 'Không tải được dữ liệu')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
      controller.abort()
    }
  }, [id])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-[4/5] animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="space-y-3">
          <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-1/3 animate-pulse rounded bg-slate-200" />
          <div className="h-24 w-full animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        {error}
      </div>
    )
  }

  if (!book) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
        Không tìm thấy sách.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link to="/books" className="font-semibold text-indigo-700 hover:underline">
          ← Quay lại danh sách
        </Link>
        {book.category?.name ? (
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {book.category.name}
          </span>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[4/5] bg-slate-100">
            <img
              src={book.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-L.jpg'}
              alt={book.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{book.title}</h1>
            <p className="mt-1 text-sm text-slate-600">{book.author ?? '—'}</p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="text-2xl font-extrabold text-indigo-700">{formatVND(book.price)}</div>
            {typeof book.stock === 'number' ? (
              <div
                className={[
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  book.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
                ].join(' ')}
              >
                {book.stock > 0 ? `Còn ${book.stock} cuốn` : 'Hết hàng'}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Spec label="Nhà xuất bản" value={book.publisher ?? '—'} />
            <Spec label="Năm" value={typeof book.year === 'number' ? String(book.year) : '—'} />
            <Spec label="Số trang" value={typeof book.pages === 'number' ? String(book.pages) : '—'} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Mô tả chi tiết</div>
            <p className="mt-1 whitespace-pre-line leading-relaxed text-slate-600">
              {book.description ?? 'Chưa có mô tả.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addItem(book, 1)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Thêm vào giỏ hàng
            </button>
            <Link
              to="/cart"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Xem giỏ hàng
            </Link>
            <Link
              to="/books"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Sách cùng thể loại</h2>
            <p className="text-sm text-slate-600">Gợi ý dựa theo thể loại & độ phổ biến</p>
          </div>
          <Link
            to={book.category?.id ? `/books?categoryId=${encodeURIComponent(String(book.category.id))}` : '/books'}
            className="text-sm font-semibold text-indigo-700 hover:underline"
          >
            Xem thêm
          </Link>
        </div>

        {related.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((b) => (
              <Link
                key={String(b.id)}
                to={`/books/${b.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-[4/5] bg-slate-100">
                  <img
                    src={b.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-L.jpg'}
                    alt={b.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-xs font-semibold text-slate-900">{b.title}</div>
                  <div className="mt-1 text-xs font-extrabold text-indigo-700">{formatVND(b.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            Chưa có gợi ý.
          </div>
        )}
      </section>
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 font-semibold text-slate-900">{value}</div>
    </div>
  )
}

