import { Link } from 'react-router-dom'
import { CartItem } from '../components/books/CartItem'
import { useCart } from '../contexts/CartContext'
import { formatVND } from '../utils/format'
import toast from 'react-hot-toast'

export function CartPage() {
  const { items, subtotal, totalQuantity, removeItem, setQuantity, clear } = useCart()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Giỏ hàng</h1>
          <p className="text-sm text-slate-600">Bạn đang có {totalQuantity || 0} sản phẩm.</p>
        </div>
        {items.length ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Xoá tất cả
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.17 14h9.66c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21.29 5H6.21L5.27 3H2v2h2l3.6 7.59-1.35 2.45C5.52 16.37 6.48 18 8 18h12v-2H8l1.1-2Z"
              />
            </svg>
          </div>
          <div className="mt-3 text-lg font-semibold text-slate-900">Giỏ hàng đang trống</div>
          <p className="mt-1 text-sm text-slate-600">Thêm vài cuốn sách để bắt đầu mua sắm.</p>
          <Link
            to="/books"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Khám phá sách
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem
                key={String(item.book.id)}
                item={item}
                onQuantityChange={(quantity) => setQuantity(item.book.id, quantity)}
                onRemove={() => removeItem(item.book.id)}
              />
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Tóm tắt đơn hàng</div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-slate-500">—</span>
              </div>
              <div className="my-2 h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Tổng cộng</span>
                <span className="text-lg font-extrabold text-slate-900">{formatVND(subtotal)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!items.length) {
                  toast.error('Giỏ hàng đang trống')
                  return
                }
              }}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Link to="/checkout" className="block">
                Thanh toán
              </Link>
            </button>
            <Link
              to="/books"
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

