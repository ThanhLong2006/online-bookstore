import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../contexts/CartContext'
import { formatVND } from '../utils/format'

type PaymentMethod = 'visa' | 'momo' | 'zalopay' | 'atm'

const METHODS: { id: PaymentMethod; label: string; tone: string; icon: React.ReactNode }[] = [
  {
    id: 'visa',
    label: 'Visa / Mastercard',
    tone: 'border-slate-200 hover:border-slate-300',
    icon: (
      <svg viewBox="0 0 48 48" className="h-5 w-8 shrink-0" fill="currentColor">
        <path d="M18.8 28.5L21.3 15h-3.9l-2.5 10.1L13 16.5A5.6 5.6 0 007.8 15H2L1.8 16c2.4.6 4.7 1.6 6.2 3.1L9 28.5h4.1l6.2-13.5z" fill="#1A1F71"/>
        <path d="M29.5 19.4c0-2.3-3.2-2.5-4.4-3.1-.9-.4-1.7-.8-1.7-1.4 0-.6.7-1.2 2.1-1.2a7.1 7.1 0 013.9 1.1l.5-3.3a10 10 0 00-4.3-.8c-3.8 0-6.5 2.1-6.5 5.2 0 3.7 5.1 4 5.1 5.8 0 .6-.7 1.2-2.2 1.2a8.7 8.7 0 01-5-1.5l-.5 3.3a11.8 11.8 0 005.4 1.1c4 0 6.6-2 6.6-4.9z" fill="#1A1F71"/>
        <path d="M37.6 15h-3.2a1.8 1.8 0 00-1.8 1.2l-5.6 12.3h4.2l.8-2.3h5.1l.5 2.3h3.7L37.6 15zm-4.7 8.3l1.8-5 1 5h-2.8z" fill="#1A1F71"/>
        <path d="M46.2 15h-3.2l-3.3 13.5h4.1L46.2 15z" fill="#F7B600"/>
      </svg>
    )
  },
  {
    id: 'momo',
    label: 'Ví MoMo',
    tone: 'border-rose-200 hover:border-rose-300',
    icon: (
      <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0 rounded" fill="currentColor">
        <rect width="40" height="40" rx="6" fill="#b0006d" />
        <path d="M10 24h3.5v-8H10v8zm10.5-8c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm0 5.2c-.9 0-1.7-.7-1.7-1.7s.7-1.7 1.7-1.7 1.7.7 1.7 1.7-.7 1.7-1.7 1.7zm8.5-5.2c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm0 5.2c-.9 0-1.7-.7-1.7-1.7s.7-1.7 1.7-1.7 1.7.7 1.7 1.7-.7 1.7-1.7 1.7z" fill="#ffffff"/>
        <path d="M15.5 16h3v8h-3v-8z" fill="#ffffff"/>
      </svg>
    )
  },
  {
    id: 'zalopay',
    label: 'Ví ZaloPay',
    tone: 'border-indigo-200 hover:border-indigo-300',
    icon: (
      <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0 rounded" fill="currentColor">
        <rect width="40" height="40" rx="6" fill="#0068ff" />
        <path d="M26 12H14c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V14c0-1.1-.9-2-2-2zm-5 11.8c-.8.8-2 .8-2.8 0l-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4-3.5 6.3z" fill="#00c224" />
        <text x="20" y="27" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">ZaloPay</text>
      </svg>
    )
  },
  {
    id: 'atm',
    label: 'Thẻ ATM Nội Địa',
    tone: 'border-slate-200 hover:border-slate-300',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-8 shrink-0 text-amber-800" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
        <rect x="5" y="14" width="3" height="2" rx="0.5"/>
      </svg>
    )
  },
]

const SHIPPING_VOUCHERS = [
  { code: 'FREESHIP30', desc: 'Freeship (Giảm tối đa 30k)', discount: 30000 },
  { code: 'NHANH24H', desc: 'Giao hỏa tốc (Giảm 15k)', discount: 15000 },
  { code: 'VIPSACH50', desc: 'Voucher VIP (Giảm ngay 50k)', discount: 50000 },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, totalQuantity, clear } = useCart()
  const [method, setMethod] = useState<PaymentMethod>('visa')
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const [activeVoucher, setActiveVoucher] = useState<string | null>(() => {
    return sessionStorage.getItem('cart_active_voucher') || null
  })
  const shippingFee = 30000
  const shippingDiscount = useMemo(() => {
    if (!activeVoucher) return 0
    return SHIPPING_VOUCHERS.find((v) => v.code === activeVoucher)?.discount ?? 0
  }, [activeVoucher])
  const total = useMemo(() => {
    return Math.max(0, subtotal + shippingFee - shippingDiscount)
  }, [subtotal, shippingFee, shippingDiscount])

  useEffect(() => {
    sessionStorage.setItem('cart_active_voucher', activeVoucher || '')
    sessionStorage.setItem('cart_shipping_discount', String(shippingDiscount))
  }, [activeVoucher, shippingDiscount])

  const invoice = useMemo(() => {
    return {
      id: `INV-${Math.floor(Date.now() / 1000)}`,
      createdAt: new Date().toISOString(),
      method,
      customerName,
      address,
      phone,
      items: items.map((it) => ({
        id: it.book.id,
        title: it.book.title,
        price: it.book.price,
        quantity: it.quantity,
      })),
      subtotal,
      shippingFee,
      shippingDiscount,
      activeVoucher: activeVoucher || undefined,
      total,
    }
  }, [address, customerName, items, method, phone, subtotal, shippingFee, shippingDiscount, activeVoucher, total])

  function handlePlaceOrder() {
    if (!customerName.trim() || !address.trim() || !phone.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin khách hàng.')
      return
    }

    setIsPlacingOrder(true)
    sessionStorage.setItem('qls_invoice', JSON.stringify(invoice))
    clear() // Clear cart upon placing order
    toast.success('Đặt hàng thành công!')
    navigate('/invoice', { replace: true })
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-lg font-semibold text-slate-900">Không thể thanh toán</div>
        <p className="mt-1 text-sm text-slate-600">Giỏ hàng đang trống.</p>
        <Link
          to="/books"
          className="mt-4 inline-flex rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
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
        <Link to="/cart" className="text-sm font-semibold hover:underline" style={{ color: '#1A365D' }}>
          ← Quay lại giỏ hàng
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Thông tin khách hàng</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Họ và tên</span>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Số điện thoại</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
              <label className="sm:col-span-2 block">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Địa chỉ giao hàng</span>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Phương thức thanh toán</div>
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
                    method === m.id ? 'text-white border-transparent shadow-md' : 'bg-white text-stone-900 dark:bg-slate-950 dark:text-slate-100',
                  ].join(' ')}
                  style={method === m.id ? { background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm border border-stone-100/50">
                      {m.icon}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold tracking-tight">{m.label}</div>
                      <div className={['text-[10px]', method === m.id ? 'text-white/80' : 'text-stone-500'].join(' ')}>
                        Thanh toán nhanh (demo)
                      </div>
                    </div>
                  </div>
                  <span
                    className={[
                      'inline-flex h-5 w-5 items-center justify-center rounded-full border shrink-0',
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

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Đơn hàng</div>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {items.map((it) => (
                <div key={String(it.book.id)} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="line-clamp-1 font-semibold text-slate-900 dark:text-slate-100">{it.book.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {it.quantity} × {formatVND(it.book.price)}
                    </div>
                  </div>
                  <div className="font-semibold" style={{ color: '#1A365D' }}>{formatVND(it.quantity * it.book.price)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="text-sm font-semibold text-slate-900">Tóm tắt đơn hàng</div>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Số lượng sách</span>
              <span className="font-semibold text-slate-900">{totalQuantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phí vận chuyển</span>
              <span className="font-semibold text-slate-900">{formatVND(shippingFee)}</span>
            </div>
            {activeVoucher && (
              <div className="flex items-center justify-between text-emerald-600 font-medium">
                <span>Miễn phí vận chuyển ({activeVoucher})</span>
                <span>-{formatVND(shippingDiscount)}</span>
              </div>
            )}
            <div className="my-2 h-px bg-slate-100" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Tổng cộng</span>
              <span className="text-lg font-extrabold text-[#1A365D] dark:text-blue-450">{formatVND(total)}</span>
            </div>
          </div>

          {/* Shipping Vouchers */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã vận chuyển khả dụng</div>
            <div className="grid gap-2">
              {SHIPPING_VOUCHERS.map((v) => {
                const isApplied = activeVoucher === v.code
                return (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => {
                      setActiveVoucher(isApplied ? null : v.code)
                      if (!isApplied) {
                        toast.success(`Đã áp dụng mã ${v.code}`)
                      } else {
                        toast.success('Đã huỷ áp dụng mã')
                      }
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition ${
                      isApplied
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        {v.code === 'FREESHIP30' ? (
                          <img src="/icons/free-shipping.png" alt="Freeship" className="h-4.5 w-4.5 object-contain shrink-0" />
                        ) : (
                          <span className="text-base">🚚</span>
                        )}
                        {v.code}
                      </div>
                      <div className="text-[10px] text-slate-550 mt-0.5">{v.desc}</div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      isApplied ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isApplied ? 'Đã dùng' : 'Áp dụng'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
          >
            {isPlacingOrder ? 'Đang xử lý...' : 'Tạo hoá đơn'}
          </button>
        </div>
      </div>
    </div>
  )
}

