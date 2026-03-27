import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import { formatVND } from '../utils/format'

type PaymentMethod = 'visa' | 'momo' | 'zalopay' | 'atm'

const METHODS: { id: PaymentMethod; label: string; tone: string }[] = [
  { id: 'visa', label: 'Visa', tone: 'border-slate-200 hover:border-slate-300' },
  { id: 'momo', label: 'MoMo', tone: 'border-rose-200 hover:border-rose-300' },
  { id: 'zalopay', label: 'ZaloPay', tone: 'border-indigo-200 hover:border-indigo-300' },
  { id: 'atm', label: 'ATM', tone: 'border-slate-200 hover:border-slate-300' },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, totalQuantity } = useCart()
  const [method, setMethod] = useState<PaymentMethod>('visa')

  const invoice = useMemo(() => {
    return {
      id: `INV-${Math.floor(Date.now() / 1000)}`,
      createdAt: new Date().toISOString(),
      method,
      items: items.map((it) => ({
        id: it.book.id,
        title: it.book.title,
        price: it.book.price,
        quantity: it.quantity,
      })),
      subtotal,
      total: subtotal,
    }
  }, [items, method, subtotal])

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-lg font-semibold text-slate-900">Không thể thanh toán</div>
        <p className="mt-1 text-sm text-slate-600">Giỏ hàng đang trống.</p>
        <Link
          to="/books"
          className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Khám phá sách
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Thanh toán</h1>
          <p className="text-sm text-slate-600">Chọn phương thức thanh toán và xuất hoá đơn.</p>
        </div>
        <Link to="/cart" className="text-sm font-semibold text-indigo-700 hover:underline">
          ← Quay lại giỏ hàng
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Phương thức thanh toán</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMethod(m.id)
                    toast.success(`Đã chọn ${m.label}`)
                  }}
                  className={[
                    'flex items-center justify-between rounded-2xl border p-4 text-left transition',
                    m.tone,
                    method === m.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900',
                  ].join(' ')}
                >
                  <div className="space-y-1">
                    <div className="text-sm font-extrabold">{m.label}</div>
                    <div className={['text-xs', method === m.id ? 'text-white/80' : 'text-slate-500'].join(' ')}>
                      Thanh toán nhanh (demo)
                    </div>
                  </div>
                  <span
                    className={[
                      'inline-flex h-5 w-5 items-center justify-center rounded-full border',
                      method === m.id ? 'border-white/40' : 'border-slate-200',
                    ].join(' ')}
                  >
                    {method === m.id ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Đơn hàng</div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              {items.map((it) => (
                <div key={String(it.book.id)} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="line-clamp-1 font-semibold text-slate-900">{it.book.title}</div>
                    <div className="text-xs text-slate-500">
                      {it.quantity} × {formatVND(it.book.price)}
                    </div>
                  </div>
                  <div className="font-semibold text-indigo-700">{formatVND(it.quantity * it.book.price)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Tóm tắt</div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Số lượng</span>
              <span className="font-semibold text-slate-900">{totalQuantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
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
              sessionStorage.setItem('qls_invoice', JSON.stringify(invoice))
              navigate('/invoice', { replace: false })
            }}
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Tạo hoá đơn
          </button>
        </div>
      </div>
    </div>
  )
}

