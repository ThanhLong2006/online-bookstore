import { Link, useNavigate } from 'react-router-dom'
import { formatVND } from '../utils/format'

type Invoice = {
  id: string
  createdAt: string
  method: string
  items: { id: string | number; title: string; price: number; quantity: number }[]
  subtotal: number
  total: number
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
  } catch {
    return iso
  }
}

function methodLabel(m: string) {
  if (m === 'momo') return 'MoMo'
  if (m === 'zalopay') return 'ZaloPay'
  if (m === 'atm') return 'ATM'
  return 'Visa'
}

export function InvoicePage() {
  const navigate = useNavigate()
  const raw = sessionStorage.getItem('qls_invoice')
  const invoice = raw ? (safeParse(raw) as Invoice | null) : null

  if (!invoice) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-lg font-semibold text-slate-900">Chưa có hoá đơn</div>
        <p className="mt-1 text-sm text-slate-600">Vui lòng tạo hoá đơn từ trang Thanh toán.</p>
        <Link
          to="/checkout"
          className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Đi tới Thanh toán
        </Link>
      </div>
    )
  }

  const qrPayload = `PAY|${invoice.id}|${invoice.total}|${invoice.method}`

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hoá đơn</h1>
          <p className="text-sm text-slate-600">Bạn có thể in hoá đơn này.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            In hoá đơn
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem('qls_invoice')
              navigate('/checkout', { replace: true })
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Tạo lại
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:border-none print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-indigo-700">SachStore</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">INVOICE</div>
            <div className="mt-2 text-sm text-slate-600">
              Mã hoá đơn: <span className="font-semibold text-slate-900">{invoice.id}</span>
            </div>
            <div className="text-sm text-slate-600">
              Thời gian: <span className="font-semibold text-slate-900">{formatDate(invoice.createdAt)}</span>
            </div>
            <div className="text-sm text-slate-600">
              Thanh toán: <span className="font-semibold text-slate-900">{methodLabel(invoice.method)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-500">QR thanh toán (giả lập)</div>
            <div className="mt-3">
              <FakeQR value={qrPayload} />
            </div>
            <div className="mt-2 text-[11px] text-slate-500">{qrPayload}</div>
          </div>
        </div>

        <div className="my-6 h-px bg-slate-200" />

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3 text-right">Đơn giá</th>
                <th className="px-4 py-3 text-right">SL</th>
                <th className="px-4 py-3 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((it) => (
                <tr key={String(it.id)}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{it.title}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{formatVND(it.price)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{it.quantity}</td>
                  <td className="px-4 py-3 text-right font-semibold text-indigo-700">
                    {formatVND(it.price * it.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-sm space-y-2 text-sm">
            <div className="flex items-center justify-between text-slate-700">
              <span>Tạm tính</span>
              <span className="font-semibold text-slate-900">{formatVND(invoice.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Phí vận chuyển</span>
              <span className="text-slate-500">—</span>
            </div>
            <div className="my-2 h-px bg-slate-200" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Tổng cộng</span>
              <span className="text-lg font-extrabold text-slate-900">{formatVND(invoice.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <Link to="/" className="text-sm font-semibold text-indigo-700 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  )
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function FakeQR({ value }: { value: string }) {
  const bits = hashBits(value, 21 * 21)
  return (
    <div
      className="grid gap-[2px] rounded-xl bg-white p-3 shadow-sm"
      style={{ gridTemplateColumns: 'repeat(21, 6px)' }}
      aria-label="QR code"
    >
      {bits.map((b, idx) => (
        <div
          key={idx}
          className={b ? 'h-[6px] w-[6px] bg-slate-900' : 'h-[6px] w-[6px] bg-white'}
        />
      ))}
    </div>
  )
}

function hashBits(input: string, len: number) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const bits: boolean[] = []
  for (let i = 0; i < len; i++) {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    bits.push((h & 1) === 1)
  }
  return bits
}

