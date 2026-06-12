import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CartItem } from '../components/books/CartItem'
import { useCart } from '../contexts/CartContext'
import { formatVND } from '../utils/format'

const SHIPPING_VOUCHERS = [
  { code: 'FREESHIP30', desc: 'Freeship (Giảm tối đa 30k)', discount: 30000 },
  { code: 'NHANH24H', desc: 'Giao hỏa tốc (Giảm 15k)', discount: 15000 },
  { code: 'VIPSACH50', desc: 'Voucher VIP (Giảm ngay 50k)', discount: 50000 },
]

export function CartPage() {
  const { items, subtotal, totalQuantity, removeItem, setQuantity, clear } = useCart()
  const [shippingFee] = useState(30000)
  const [activeVoucher, setActiveVoucher] = useState<string | null>(() => {
    return sessionStorage.getItem('cart_active_voucher') || null
  })

  const shippingDiscount = useMemo(() => {
    if (!activeVoucher) return 0
    return SHIPPING_VOUCHERS.find(v => v.code === activeVoucher)?.discount ?? 0
  }, [activeVoucher])

  const total = useMemo(() => {
    return Math.max(0, subtotal + shippingFee - shippingDiscount)
  }, [subtotal, shippingFee, shippingDiscount])

  useEffect(() => {
    sessionStorage.setItem('cart_shipping_fee', String(shippingFee))
    sessionStorage.setItem('cart_active_voucher', activeVoucher || '')
    sessionStorage.setItem('cart_shipping_discount', String(shippingDiscount))
  }, [shippingFee, activeVoucher, shippingDiscount])

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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
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
            className="mt-4 inline-flex rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
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

          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Tóm tắt đơn hàng</div>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
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
                    <span>Mã miễn phí vận chuyển ({activeVoucher})</span>
                    <span>-{formatVND(shippingDiscount)}</span>
                  </div>
                )}
                <div className="my-2 h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-lg font-extrabold text-slate-900">{formatVND(total)}</span>
                </div>
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
                      onClick={() => setActiveVoucher(isApplied ? null : v.code)}
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
                        <div className="text-[10px] text-slate-500 mt-0.5">{v.desc}</div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isApplied ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isApplied ? 'Đã áp dụng' : 'Áp dụng'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-4 block w-full text-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
            >
              Thanh toán
            </Link>
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
