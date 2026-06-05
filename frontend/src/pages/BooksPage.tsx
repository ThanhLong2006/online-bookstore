import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookCard } from '../components/books/BookCard'
import { FilterSidebar } from '../components/books/FilterSidebar'
import { SearchBar } from '../components/ui/SearchBar'
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
  const [searchTerm, setSearchTerm] = useState(q)

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    setSearchTerm(q)
  }, [q])

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
    getCategories(controller.signal)
      .then((res) => mounted && setCategories(res ?? []))
      .catch(() => mounted && setCategories([]))
    return () => {
      mounted = false
      controller.abort()
    }
  }, [])

  const pageSize = 12
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete(key)
    else next.set(key, value)
    next.delete('page') // reset page on filter/sort changes
    setSearchParams(next)
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setParam('q', searchTerm.trim())
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
      <FilterSidebar
        categories={categories}
        selectedCategory={categoryId}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
        onCategoryChange={(nextCategory) => setParam('categoryId', nextCategory)}
        onPriceChange={(field, value) => setParam(field === 'min' ? 'minPrice' : 'maxPrice', value ? String(value) : '')}
        onSortChange={(nextSort) => setParam('sort', nextSort)}
        onClear={clearFilters}
      />

      <div className="space-y-5">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Danh sách sách</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tìm kiếm và lọc sách theo thể loại, giá và sắp xếp để tìm được lựa chọn tốt nhất.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-auto">
              <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onSubmit={handleSearchSubmit} />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Sắp xếp</span>
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Trang</span>
              <select
                value={String(page)}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams)
                  next.set('page', e.target.value)
                  setSearchParams(next)
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {Array.from({ length: totalPages }).map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
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

