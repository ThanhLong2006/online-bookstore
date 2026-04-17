import { Link } from 'react-router-dom'
import type { CartItem as CartItemType } from '../../contexts/CartContext'
import { formatVND } from '../../utils/format'

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItemType
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-900">
      <Link
        to={`/books/${item.book.id}`}
        className="h-24 w-20 flex-none overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
      >
        {item.book.coverUrl ? (
          <img src={item.book.coverUrl} alt={item.book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            No cover
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/books/${item.book.id}`}
              className="line-clamp-2 text-sm font-semibold text-slate-900 transition hover:underline dark:text-slate-100"
            >
              {item.book.title}
            </Link>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.book.author ?? '—'}</div>
            {item.book.category?.name ? (
              <div className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {item.book.category.name}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:hover:bg-rose-950"
          >
            Xoá
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              aria-label="Giảm"
            >
              −
            </button>
            <input
              inputMode="numeric"
              value={String(item.quantity)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, '')
                const quantity = Number(raw || 1)
                onQuantityChange(quantity)
              }}
              className="h-9 w-16 rounded-xl border border-slate-200 bg-white px-2 text-center text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              aria-label="Số lượng"
            />
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              aria-label="Tăng"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Đơn giá: {formatVND(item.book.price)}</div>
            <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              {formatVND(item.book.price * item.quantity)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
