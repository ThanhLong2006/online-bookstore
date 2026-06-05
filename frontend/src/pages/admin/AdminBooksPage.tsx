import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Book, Category } from '../../types/book'
import { formatVND } from '../../utils/format'
import { mockBooks, mockCategories } from '../../services/api/mockData'
import toast from 'react-hot-toast'

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>(() => [...mockBooks])
  const categories = useMemo<Category[]>(() => [...mockCategories], [])
  const [bookQuery, setBookQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)

  const editingBook = useMemo(
    () => books.find((b) => String(b.id) === String(editingId)) ?? null,
    [books, editingId],
  )

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
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#8b4513' }}>Quản trị</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">📚 Quản lý sách</h1>
          <p className="text-sm text-stone-500">Thêm, sửa, xóa và quản lý toàn bộ danh mục sách.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
          {showAddForm ? '✕ Đóng form' : '+ Thêm sách mới'}
        </button>
      </div>

      {/* Add book form */}
      {showAddForm && (
        <AddBookCard
          categories={categories}
          onAdded={(b) => {
            upsertBook(b)
            setShowAddForm(false)
            toast.success('Thêm sách thành công!')
          }}
        />
      )}

      {/* Book table */}
      <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 bg-amber-50/60 px-4 py-3">
          <div>
            <div className="text-sm font-bold text-stone-900">Danh sách sách</div>
            <div className="text-xs text-stone-500">{filteredBooks.length} sản phẩm</div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 shadow-sm focus-within:border-amber-400">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-500">
              <path fill="currentColor" d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0-4.243-1.757A5.98 5.98 0 0 0 10 16Zm9.707 5.293-4.256-4.256 1.414-1.414 4.256 4.256-1.414 1.414Z" />
            </svg>
            <input
              value={bookQuery}
              onChange={(e) => setBookQuery(e.target.value)}
              className="w-64 bg-transparent text-sm outline-none placeholder:text-stone-400"
              placeholder="Tìm tên sách, tác giả, thể loại..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-bold uppercase tracking-wide text-stone-600" style={{ background: '#fef9f3' }}>
              <tr>
                <th className="px-4 py-3">Sách</th>
                <th className="px-4 py-3">Thể loại</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Tồn kho</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {filteredBooks.map((b) => (
                <tr key={String(b.id)} className="hover:bg-amber-50/40 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 overflow-hidden rounded-lg border border-amber-100 bg-amber-50 shrink-0">
                        {b.coverUrl ? (
                          <img src={b.coverUrl} alt={b.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-amber-300 text-lg">📖</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="line-clamp-1 font-semibold text-stone-900">{b.title}</div>
                        <div className="line-clamp-1 text-xs text-stone-500">{b.author ?? '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      {b.category?.name ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#8b4513' }}>{formatVND(b.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      (b.stock ?? 0) > 10 ? 'bg-green-100 text-green-700' :
                      (b.stock ?? 0) > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {typeof b.stock === 'number' ? b.stock : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(b.id)}
                        className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-amber-50">
                        ✏️ Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBook(b.id)}
                        className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600">
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-stone-500" colSpan={5}>
                    Không tìm thấy sách phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editingBook && (
          <EditModal
            book={editingBook}
            categories={categories}
            onClose={() => setEditingId(null)}
            onSave={(b) => {
              upsertBook(b)
              setEditingId(null)
              toast.success('Cập nhật sách thành công!')
            }}
          />
        )}
      </div>
    </div>
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
    setTitle(''); setAuthor(''); setPrice(''); setStock('10'); setCoverUrl(''); setDescription('')
  }

  const inputCls = 'w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100'
  const labelCls = 'mb-1 text-xs font-bold uppercase tracking-wider text-stone-500'

  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-stone-900 mb-4">➕ Thêm sách mới</h3>
      <form onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block md:col-span-2">
            <div className={labelCls}>Tên sách *</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Ví dụ: Clean Code" />
          </label>
          <label className="block">
            <div className={labelCls}>Tác giả</div>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} placeholder="Robert C. Martin" />
          </label>
          <label className="block">
            <div className={labelCls}>Thể loại</div>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
              {categories.map((c) => <option key={String(c.id)} value={String(c.id)}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <div className={labelCls}>Giá (VND) *</div>
            <input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} placeholder="199000" />
          </label>
          <label className="block">
            <div className={labelCls}>Tồn kho</div>
            <input inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} placeholder="10" />
          </label>
          <label className="block md:col-span-2">
            <div className={labelCls}>Ảnh bìa (URL)</div>
            <input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className={inputCls} placeholder="https://..." />
          </label>
          <label className="block md:col-span-2">
            <div className={labelCls}>Mô tả</div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} min-h-[80px] resize-none`} placeholder="Mô tả ngắn về sách..." />
          </label>
          <div className="md:col-span-2">
            <button type="submit" disabled={!canSubmit}
              className="w-full rounded-xl py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
              ✅ Thêm sách
            </button>
          </div>
        </div>
        <div className="h-fit rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Preview ảnh bìa</div>
          <div className="overflow-hidden rounded-xl border border-amber-200 bg-white aspect-[4/5]">
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <p className="mt-2 text-xs text-stone-400">Dùng OpenLibrary hoặc Unsplash để có ảnh đẹp.</p>
        </div>
      </form>
    </div>
  )
}

function EditModal({ book, categories, onClose, onSave }: {
  book: Book; categories: Category[]; onClose: () => void; onSave: (b: Book) => void
}) {
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author ?? '')
  const [price, setPrice] = useState(String(book.price ?? 0))
  const [categoryId, setCategoryId] = useState(book.category?.id ? String(book.category.id) : '')
  const [stock, setStock] = useState(String(book.stock ?? 0))
  const [coverUrl, setCoverUrl] = useState(book.coverUrl ?? '')
  const [description, setDescription] = useState(book.description ?? '')
  const canSubmit = title.trim() && Number(price) > 0
  const inputCls = 'w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400'

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const cat = categories.find((c) => String(c.id) === String(categoryId))
    onSave({ ...book, title: title.trim(), author: author.trim() || undefined, price: Number(price), category: cat, stock: Number(stock || '0') || 0, coverUrl: coverUrl.trim() || undefined, description: description.trim() || undefined })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-amber-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-100 px-5 py-4">
          <div>
            <div className="font-bold text-stone-900">✏️ Sửa sách</div>
            <div className="text-xs text-stone-500">ID: {String(book.id)}</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl px-3 py-1.5 text-sm font-semibold text-stone-600 hover:bg-amber-50 transition">✕ Đóng</button>
        </div>
        <form onSubmit={onSubmit} className="grid gap-3 p-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">Tên sách</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">Tác giả</div>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">Thể loại</div>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
              <option value="">—</option>
              {categories.map((c) => <option key={String(c.id)} value={String(c.id)}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">Giá (VND)</div>
            <input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} />
          </label>
          <label className="block">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">Tồn kho</div>
            <input inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ''))} className={inputCls} />
          </label>
          <label className="block md:col-span-2">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">Ảnh bìa (URL)</div>
            <input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className={inputCls} />
          </label>
          <label className="block md:col-span-2">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-500">Mô tả</div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} min-h-[80px] resize-none`} />
          </label>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-amber-50 transition">Huỷ</button>
            <button type="submit" disabled={!canSubmit}
              className="rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
