import { useMemo } from 'react'
import { formatVND } from '../../utils/format'

type Order = {
  id: string
  customerName: string
  email: string
  createdAt: string
  status: 'pending' | 'paid' | 'shipped' | 'cancelled'
  total: number
  items: number
}

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
  } catch { return iso }
}

const STATUS_CONFIG = {
  paid:      { label: 'Đã thanh toán', cls: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  shipped:   { label: 'Đang giao',     cls: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500'  },
  cancelled: { label: 'Đã huỷ',        cls: 'bg-red-100 text-red-700',      dot: 'bg-red-500'   },
  pending:   { label: 'Chờ xử lý',     cls: 'bg-amber-100 text-amber-800',  dot: 'bg-amber-500' },
}

export function AdminOrdersPage() {
  const now = Date.now()

  const orders = useMemo<Order[]>(() => [
    { id: 'DH-10001', customerName: 'Nguyễn Minh',    email: 'minh@example.com',  createdAt: new Date(now - 1000*60*40).toISOString(),       status: 'paid',      total: 458000, items: 3 },
    { id: 'DH-10002', customerName: 'Trần Anh',        email: 'anh@example.com',   createdAt: new Date(now - 1000*60*60*8).toISOString(),      status: 'pending',   total: 219000, items: 2 },
    { id: 'DH-10003', customerName: 'Lê Vy',           email: 'levy@example.com',  createdAt: new Date(now - 1000*60*60*30).toISOString(),     status: 'shipped',   total: 299000, items: 1 },
    { id: 'DH-10004', customerName: 'Phạm Tuấn',       email: 'tuan@example.com',  createdAt: new Date(now - 1000*60*60*48).toISOString(),     status: 'paid',      total: 539000, items: 4 },
    { id: 'DH-10005', customerName: 'Hoàng Lan',       email: 'lan@example.com',   createdAt: new Date(now - 1000*60*60*72).toISOString(),     status: 'cancelled', total: 189000, items: 1 },
    { id: 'DH-10006', customerName: 'Vũ Thành Nam',    email: 'nam@example.com',   createdAt: new Date(now - 1000*60*60*96).toISOString(),     status: 'shipped',   total: 378000, items: 2 },
    { id: 'DH-10007', customerName: 'Đặng Thu Hương',  email: 'huong@example.com', createdAt: new Date(now - 1000*60*60*120).toISOString(),    status: 'paid',      total: 259000, items: 2 },
  ], [now])

  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    shipped:   orders.filter(o => o.status === 'shipped').length,
    revenue:   orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.total, 0),
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#1A365D' }}>Quản trị</div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">📦 Quản lý đơn hàng</h1>
        <p className="text-sm text-stone-500">Theo dõi và cập nhật trạng thái đơn hàng.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Tổng đơn',    value: stats.total,             icon: '📋', color: '#1A365D' },
          { label: 'Chờ xử lý',  value: stats.pending,           icon: '⏳', color: '#d97706' },
          { label: 'Đang giao',  value: stats.shipped,           icon: '🚚', color: '#2563eb' },
          { label: 'Doanh thu',  value: formatVND(stats.revenue), icon: '💰', color: '#16a34a' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">{s.label}</div>
              <span className="text-lg">{s.icon}</span>
            </div>
            <div className="mt-1.5 text-xl font-extrabold text-stone-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
        <div className="border-b border-amber-100 bg-amber-50/60 px-4 py-3">
          <div className="text-sm font-bold text-stone-900">Danh sách đơn hàng</div>
          <div className="text-xs text-stone-500">{orders.length} đơn gần đây</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-bold uppercase tracking-wide text-stone-600" style={{ background: '#fef9f3' }}>
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Số lượng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {orders.map((o) => {
                const cfg = STATUS_CONFIG[o.status]
                return (
                  <tr key={o.id} className="hover:bg-amber-50/40 transition">
                    <td className="px-4 py-3 font-bold text-stone-900">{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-800">{o.customerName}</div>
                      <div className="text-xs text-stone-400">{o.email}</div>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{formatDateTime(o.createdAt)}</td>
                    <td className="px-4 py-3 text-stone-700">{o.items} sách</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: '#1A365D' }}>{formatVND(o.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button className="rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-amber-50 transition">
                          👁️ Xem
                        </button>
                        <button className="rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-amber-50 transition">
                          ✏️ Cập nhật
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
