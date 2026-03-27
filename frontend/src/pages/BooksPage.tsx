import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookCard } from '../components/books/BookCard'
import { getBooks } from '../services/api/books'
import { getCategories } from '../services/api/categories'
import type { Book } from '../types/book'
import type { Category } from '../types/book'

export function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1') || 1
  const categoryId = searchParams.get('categoryId') ?? ''
  const sort = (searchParams.get('sort') as 'newest' | 'price_asc' | 'price_desc' | null) ?? 'newest'
  const minPrice = Number(searchParams.get('minPrice') ?? '') || 0
  const maxPrice = Number(searchParams.get('maxPrice') ?? '') || 0

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [catLoading, setCatLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true
    setLoading(true)
    setError(null)

    getBooks(
      {
        q,
        page,
        pageSize: 12,
        sort,
        categoryId: categoryId || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      },
      controller.signal,
    )
      .then((res) => {
        if (!mounted) return
        setItems(res.items ?? [])
        setTotal(res.total ?? 0)
      })
      .catch((e) => {
        if (!mounted) return
        // Ignore abort errors (navigation / StrictMode cleanup).
        if (controller.signal.aborted || e?.name === 'AbortError') return
        setError(typeof e?.message === 'string' ? e.message : 'Không tải được dữ liệu')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
      controller.abort()
    }
  }, [categoryId, maxPrice, minPrice, page, q, sort])

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true
    setCatLoading(true)
    getCategories(controller.signal)
      .then((res) => mounted && setCategories(res ?? []))
      .catch(() => mounted && setCategories([]))
      .finally(() => mounted && setCatLoading(false))
    return () => {
      mounted = false
      controller.abort()
    }
  }, [])

  const pageSize = 12
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const priceHint = useMemo(() => {
    const lo = minPrice > 0 ? formatCurrencyCompact(minPrice) : '—'
    const hi = maxPrice > 0 ? formatCurrencyCompact(maxPrice) : '—'
    if (minPrice > 0 && maxPrice > 0 && minPrice > maxPrice) return 'Khoảng giá chưa hợp lệ'
    if (minPrice > 0 || maxPrice > 0) return `${lo} → ${hi}`
    return 'Tất cả'
  }, [maxPrice, minPrice])

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete(key)
    else next.set(key, value)
    next.delete('page') // reset page on filter/sort changes
    setSearchParams(next)
  }

  function clearFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('categoryId')
    next.delete('minPrice')
    next.delete('maxPrice')
    next.delete('sort')
    next.delete('page')
    setSearchParams(next)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Bộ lọc</div>
              <div className="text-xs text-slate-500">Thể loại & giá</div>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Xoá lọc
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-800">Thể loại</div>
              {catLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-slate-50">
                    <input
                      type="radio"
                      name="category"
                      checked={!categoryId}
                      onChange={() => setParam('categoryId', '')}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <span className="text-slate-700">Tất cả</span>
                  </label>
                  {categories.map((c) => (
                    <label
                      key={String(c.id)}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-slate-50"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={String(categoryId) === String(c.id)}
                        onChange={() => setParam('categoryId', String(c.id))}
                        className="h-4 w-4 accent-indigo-600"
                      />
                      <span className="text-slate-700">{c.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-slate-800">Giá</div>
                <div className="text-xs text-slate-500">{priceHint}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <div className="sr-only">Giá từ</div>
                  <input
                    inputMode="numeric"
                    value={minPrice ? String(minPrice) : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '')
                      setParam('minPrice', raw)
                    }}
                    placeholder="Từ (VND)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
                  />
                </label>
                <label className="block">
                  <div className="sr-only">Giá đến</div>
                  <input
                    inputMode="numeric"
                    value={maxPrice ? String(maxPrice) : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '')
                      setParam('maxPrice', raw)
                    }}
                    placeholder="Đến (VND)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
                  />
                </label>
              </div>
              {minPrice > 0 && maxPrice > 0 && minPrice > maxPrice ? (
                <div className="text-xs font-medium text-rose-700">
                  Giá từ phải nhỏ hơn hoặc bằng giá đến.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Danh sách sách</h1>
          <p className="text-sm text-slate-600">
            Tìm kiếm qua query <code className="rounded bg-slate-100 px-1.5 py-0.5">q</code>
            , phân trang qua <code className="rounded bg-slate-100 px-1.5 py-0.5">page</code>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Sắp xếp</span>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>

          <span className="text-sm text-slate-600">Trang</span>
          <select
            value={String(page)}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams)
              next.set('page', e.target.value)
              setSearchParams(next)
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-[270px] animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((b) => (
            <BookCard key={String(b.id)} book={b} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          disabled={page <= 1}
          onClick={() => {
            const next = new URLSearchParams(searchParams)
            next.set('page', String(Math.max(1, page - 1)))
            setSearchParams(next)
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50"
        >
          ← Trước
        </button>
        <div className="text-sm text-slate-600">
          {total ? (
            <>
              Tổng <span className="font-semibold text-slate-900">{total}</span> sách
            </>
          ) : (
            '—'
          )}
        </div>
        <button
          disabled={page >= totalPages}
          onClick={() => {
            const next = new URLSearchParams(searchParams)
            next.set('page', String(Math.min(totalPages, page + 1)))
            setSearchParams(next)
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50"
        >
          Sau →
        </button>
      </div>
      </div>
    </div>
  )
}

function formatCurrencyCompact(v: number) {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
  } catch {
    return `${v}₫`
  }
}

