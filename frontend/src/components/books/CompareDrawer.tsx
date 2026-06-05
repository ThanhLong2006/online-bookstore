import { useEffect, useState } from 'react'
import { useCompare } from '../../contexts/CompareContext'
import { useCart } from '../../contexts/CartContext'
import { formatVND } from '../../utils/format'
import toast from 'react-hot-toast'

export function CompareDrawer() {
  const { items, count, remove, clear } = useCompare()
  const { addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleOpenCompare() {
      if (items.length > 0) {
        setIsOpen(true)
      } else {
        toast.error('Danh sách so sánh đang trống. Hãy thêm sách từ danh sách sách để so sánh nhé!')
      }
    }
    window.addEventListener('open-compare-modal', handleOpenCompare)
    return () => window.removeEventListener('open-compare-modal', handleOpenCompare)
  }, [items.length])

  if (count === 0 && !isOpen) return null

  return (
    <>
      {/* Floating Bottom Drawer */}
      <div className="fixed bottom-4 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 px-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
              {count}
            </span>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">So sánh sách</div>
              <div className="text-xs text-slate-500">Tối đa 4 sản phẩm</div>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {items.map((b) => (
              <div
                key={String(b.id)}
                className="group relative h-12 w-9 flex-none overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm transition hover:scale-105"
              >
                <img
                  src={b.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-S.jpg'}
                  alt={b.title}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => remove(b.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
                  aria-label="Xoá khỏi so sánh"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white">
                    <path
                      fill="currentColor"
                      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
            >
              So sánh ngay
            </button>
            <button
              type="button"
              onClick={clear}
              className="rounded-xl border border-slate-250 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Xoá hết
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="flex h-full max-h-[85vh] w-full max-w-5xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Bảng so sánh thông số sách</h3>
                <p className="text-xs text-slate-500">So sánh chi tiết các đầu sách được lựa chọn</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-55 bg-slate-50 dark:text-slate-400 dark:bg-slate-850 dark:hover:bg-slate-800"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                  />
                </svg>
              </button>
            </div>

            {/* Table Area (Scrollable) */}
            <div className="flex-1 overflow-auto p-6">
              <table className="w-full table-fixed border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="w-48 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Thuộc tính
                    </th>
                    {items.map((b) => (
                      <th key={String(b.id)} className="px-4 py-3 align-top">
                        <div className="space-y-3">
                          <div className="aspect-[3/4] w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800">
                            <img
                              src={b.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-L.jpg'}
                              alt={b.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="line-clamp-2 font-bold text-slate-900 dark:text-white leading-tight">
                            {b.title}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Tác giả</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {b.author ?? '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Giá bán</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3 font-extrabold text-indigo-700 dark:text-indigo-400">
                        {formatVND(b.price)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Đánh giá</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3">
                        {b.rating !== undefined ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-amber-500">★</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{b.rating.toFixed(1)}</span>
                            {b.ratingCount ? (
                              <span className="text-xs text-slate-500">({b.ratingCount})</span>
                            ) : null}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Thể loại</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3">
                        {b.category?.name ? (
                          <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                            {b.category.name}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Nhà xuất bản</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3">
                        {b.publisher ?? '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Năm xuất bản</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3">
                        {b.year ?? '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Số trang</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3">
                        {b.pages ?? '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Trạng thái kho</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3">
                        {typeof b.stock === 'number' ? (
                          b.stock > 0 ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              Còn {b.stock} cuốn
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                              Hết hàng
                            </span>
                          )
                        ) : (
                          '—'
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Mô tả ngắn</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3">
                        <div className="line-clamp-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {b.description || 'Chưa có mô tả chi tiết.'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-500">Hành động</td>
                    {items.map((b) => (
                      <td key={String(b.id)} className="px-4 py-3">
                        <button
                          type="button"
                          disabled={typeof b.stock === 'number' && b.stock <= 0}
                          onClick={() => {
                            addItem(b, 1)
                          }}
                          className="w-full rounded-xl bg-slate-900 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                          Thêm vào giỏ
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
