import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Book, Category } from '../../types/book'
import { formatVND } from '../../utils/format'
import { mockBooks, mockCategories } from '../../services/api/mockData'
import toast from 'react-hot-toast'

type TabKey = 'books' | 'add' | 'orders'

type Order = {
  id: string
  customerName: string
  createdAt: string
  status: 'pending' | 'paid' | 'shipped' | 'cancelled'
  total: number
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso),
    )
  } catch {
    return iso
  }
}

function statusBadge(s: Order['status']) {
  if (s === 'paid') return 'bg-emerald-50 text-emerald-700'
  if (s === 'shipped') return 'bg-indigo-50 text-indigo-700'
  if (s === 'cancelled') return 'bg-rose-50 text-rose-700'
  return 'bg-amber-50 text-amber-800'
}

export function AdminDashboardPage() {
  const [tab, setTab] = useState<TabKey>('books')
  const [books, setBooks] = useState<Book[]>(() => [...mockBooks])
  const categories = useMemo<Category[]>(() => [...mockCategories], [])
  const [bookQuery, setBookQuery] = useState('')

  const [editingId, setEditingId] = useState<string | number | null>(null)
  const editingBook = useMemo(
    () => books.find((b) => String(b.id) === String(editingId)) ?? null,
    [books, editingId],
  )

  const orders = useMemo<Order[]>(() => {
    const now = Date.now()
    return [
      {
        id: 'DH-10001',
        customerName: 'Nguyễn Minh',
        createdAt: new Date(now - 1000 * 60 * 40).toISOString(),
        status: 'paid',
        total: 458000,
      },
      {
        id: 'DH-10002',
        customerName: 'Trần Anh',
        createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
        status: 'pending',
        total: 219000,
      },
      {
        id: 'DH-10003',
        customerName: 'Lê Vy',
        createdAt: new Date(now - 1000 * 60 * 60 * 30).toISOString(),
        status: 'shipped',
        total: 299000,
      },
    ]
  }, [])

  function removeBook(id: string | number) {
    const b = books.find((x) => String(x.id) === String(id))
    const ok = window.confirm(`Xoá sách "${b?.title ?? id}"?`)
    if (!ok) return
    setBooks((prev) => prev.filter((x) => String(x.id) !== String(id)))
    if (String(editingId) === String(id)) setEditingId(null)
  }

  function upsertBook(next: Book) {
    setBooks((prev) => {
      const idx = prev.findIndex((b) => String(b.id) === String(next.id))
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = next
        return copy
      }
      return [next, ...prev]
    })
  }

  const filteredBooks = useMemo(() => {
    const q = bookQuery.trim().toLowerCase()
    if (!q) return books
    return books.filter((b) => {
      const s = `${b.title ?? ''} ${b.author ?? ''} ${b.category?.name ?? ''}`.toLowerCase()
      return s.includes(q)
    })
  }, [bookQuery, books])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-indigo-700">Admin</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard quản trị</h1>
          <p className="text-sm text-slate-600">Quản lý sách, đơn hàng và thống kê nhanh.</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-slate-700 hover:underline">
          ← Về trang người dùng
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Tổng sách" value={String(books.length)} hint="Số lượng sản phẩm hiện có" />
        <StatCard label="Tổng đơn" value="3" hint="Dữ liệu giả lập tuần này" />
      </div>

      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === 'books'} onClick={() => setTab('books')}>
          Danh sách sách
        </TabButton>
        <TabButton active={tab === 'add'} onClick={() => setTab('add')}>
          Thêm sách mới
        </TabButton>
        <TabButton active={tab === 'orders'} onClick={() => setTab('orders')}>
          Đơn hàng
        </TabButton>
      </div>

      {tab === 'books' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Danh sách sách</div>
              <div className="text-xs text-slate-500">{filteredBooks.length} mục</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-300">
                <span className="text-slate-400" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0-4.243-1.757A5.98 5.98 0 0 0 10 16Zm9.707 5.293-4.256-4.256 1.414-1.414 4.256 4.256-1.414 1.414Z"
                    />
                  </svg>
                </span>
                <input
                  value={bookQuery}
                  onChange={(e) => setBookQuery(e.target.value)}
                  className="w-72 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="Tìm theo tên/tác giả/thể loại..."
                  aria-label="Tìm sách"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setTab('add')
                  setEditingId(null)
                }}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                + Thêm
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Sách</th>
                  <th className="px-4 py-3">Thể loại</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Tồn</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((b) => (
                  <tr key={String(b.id)} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-9 overflow-hidden rounded-lg bg-slate-100">
                          {b.coverUrl ? (
                            <img src={b.coverUrl} alt={b.title} className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="line-clamp-1 font-semibold text-slate-900">{b.title}</div>
                          <div className="line-clamp-1 text-xs text-slate-500">{b.author ?? '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{b.category?.name ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-700">{formatVND(b.price)}</td>
                    <td className="px-4 py-3 text-slate-700">{typeof b.stock === 'number' ? b.stock : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(b.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBook(b.id)}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500"
                        >
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-600" colSpan={5}>
                      Không có kết quả phù hợp.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {editingBook ? (
            <EditModal
              book={editingBook}
              categories={categories}
              onClose={() => setEditingId(null)}
              onSave={(b) => {
                upsertBook(b)
                setEditingId(null)
                toast.success('Cập nhật sách thành công')
              }}
            />
          ) : null}
        </div>
      ) : null}

      {tab === 'add' ? (
        <AddBookCard
          categories={categories}
          onAdded={(b) => {
            upsertBook(b)
            setTab('books')
            toast.success('Thêm sách thành công')
          }}
        />
      ) : null}

      {tab === 'orders' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="px-4 py-3">Khách</th>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Tổng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-900">{o.id}</td>
                    <td className="px-4 py-3 text-slate-700">{o.customerName}</td>
                    <td className="px-4 py-3 text-slate-700">{formatDateTime(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={['inline-flex rounded-full px-3 py-1 text-xs font-semibold', statusBadge(o.status)].join(' ')}>
                        {labelStatus(o.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-indigo-700">{formatVND(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )

  function labelStatus(s: Order['status']) {
    if (s === 'paid') return 'Đã thanh toán'
    if (s === 'shipped') return 'Đang giao'
    if (s === 'cancelled') return 'Đã huỷ'
    return 'Chờ xử lý'
  }
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-xl px-4 py-2 text-sm font-semibold transition',
        active ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function AddBookCard({ categories, onAdded }: { categories: Category[]; onAdded: (b: Book) => void }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ? String(categories[0].id) : '')
  const [stock, setStock] = useState('10')
  const [coverUrl, setCoverUrl] = useState('')
  const [description, setDescription] = useState('')
  const previewUrl = coverUrl.trim() || 'https://covers.openlibrary.org/b/id/8225266-L.jpg'

  const canSubmit = title.trim() && price && Number(price) > 0

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const cat = categories.find((c) => String(c.id) === String(categoryId))
    const b: Book = {
      id: uid(),
      title: title.trim(),
      author: author.trim() || undefined,
      price: Number(price),
      category: cat,
      stock: Number(stock || '0') || 0,
      coverUrl: coverUrl.trim() || undefined,
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    onAdded(b)
    setTitle('')
    setAuthor('')
    setPrice('')
    setStock('10')
    setCoverUrl('')
    setDescription('')
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">Thêm sách mới</div>
      <p className="mt-1 text-sm text-slate-600">Có preview ảnh để kiểm tra nhanh trước khi lưu.</p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3 md:grid-cols-2">
        <label className="block md:col-span-2">
          <div className="mb-1 text-sm font-semibold text-slate-800">Tên sách</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            placeholder="Ví dụ: Clean Code"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-800">Tác giả</div>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            placeholder="Robert C. Martin"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-800">Thể loại</div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
          >
            {categories.map((c) => (
              <option key={String(c.id)} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-800">Giá (VND)</div>
          <input
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            placeholder="199000"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-800">Tồn kho</div>
          <input
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ''))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            placeholder="10"
          />
        </label>

        <label className="block md:col-span-2">
          <div className="mb-1 text-sm font-semibold text-slate-800">Ảnh bìa (URL)</div>
          <input
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            placeholder="https://..."
          />
        </label>

        <label className="block md:col-span-2">
          <div className="mb-1 text-sm font-semibold text-slate-800">Mô tả</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            placeholder="Mô tả ngắn về sách..."
          />
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Thêm sách
          </button>
        </div>
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Preview ảnh bìa</div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <div className="aspect-[4/5]">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Mẹo: dùng OpenLibrary/Unsplash để có ảnh đẹp khi demo.
          </div>
        </div>
      </form>
    </div>
  )
}

function EditModal({
  book,
  categories,
  onClose,
  onSave,
}: {
  book: Book
  categories: Category[]
  onClose: () => void
  onSave: (b: Book) => void
}) {
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author ?? '')
  const [price, setPrice] = useState(String(book.price ?? 0))
  const [categoryId, setCategoryId] = useState(book.category?.id ? String(book.category.id) : '')
  const [stock, setStock] = useState(String(book.stock ?? 0))
  const [coverUrl, setCoverUrl] = useState(book.coverUrl ?? '')
  const [description, setDescription] = useState(book.description ?? '')

  const canSubmit = title.trim() && Number(price) > 0

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const cat = categories.find((c) => String(c.id) === String(categoryId))
    onSave({
      ...book,
      title: title.trim(),
      author: author.trim() || undefined,
      price: Number(price),
      category: cat,
      stock: Number(stock || '0') || 0,
      coverUrl: coverUrl.trim() || undefined,
      description: description.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/30 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Sửa sách</div>
            <div className="text-xs text-slate-500">ID: {String(book.id)}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-3 p-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <div className="mb-1 text-sm font-semibold text-slate-800">Tên sách</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-800">Tác giả</div>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-800">Thể loại</div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={String(c.id)} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-800">Giá (VND)</div>
            <input
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            />
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-800">Tồn kho</div>
            <input
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ''))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            />
          </label>

          <label className="block md:col-span-2">
            <div className="mb-1 text-sm font-semibold text-slate-800">Ảnh bìa (URL)</div>
            <input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            />
          </label>

          <label className="block md:col-span-2">
            <div className="mb-1 text-sm font-semibold text-slate-800">Mô tả</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
            />
          </label>

          <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

