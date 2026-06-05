import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatVND } from '../../utils/format'

type RecentOrder = {
  id: string
  customerName: string
  createdAt: string
  status: 'pending' | 'paid' | 'shipped' | 'cancelled'
  total: number
}

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(
      new Date(iso),
    )
  } catch {
    return iso
  }
}

function statusBadge(s: RecentOrder['status']) {
  if (s === 'paid') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'shipped') return 'bg-indigo-50 text-indigo-700 border border-indigo-200'
  if (s === 'cancelled') return 'bg-rose-50 text-rose-700 border border-rose-200'
  return 'bg-amber-50 text-amber-800 border border-amber-200'
}

function labelStatus(s: RecentOrder['status']) {
  if (s === 'paid') return 'Đã thanh toán'
  if (s === 'shipped') return 'Đang giao'
  if (s === 'cancelled') return 'Đã huỷ'
  return 'Chờ xử lý'
}

export function AdminDashboardPage() {
  const now = Date.now()
  
  const recentOrders = useMemo<RecentOrder[]>(() => {
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
  }, [now])

  const topBooks = [
    { title: 'Đắc Nhân Tâm', sales: 124, revenue: 10664000, cover: 'https://covers.openlibrary.org/b/id/8225266-L.jpg' },
    { title: 'Nhà Giả Kim', sales: 98, revenue: 7742000, cover: 'https://covers.openlibrary.org/b/id/8311102-L.jpg' },
    { title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', sales: 85, revenue: 6120000, cover: 'https://covers.openlibrary.org/b/id/9266155-L.jpg' },
  ]

  // Monthly sales mockup data
  const monthlySales = [
    { month: 'T12', amount: 12400000 },
    { month: 'T1', amount: 15800000 },
    { month: 'T2', amount: 11200000 },
    { month: 'T3', amount: 19400000 },
    { month: 'T4', amount: 22000000 },
    { month: 'T5', amount: 25400000 },
  ]

  const maxAmount = Math.max(...monthlySales.map(s => s.amount))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#8b4513' }}>Quản trị viên</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Dashboard tổng quan</h1>
          <p className="text-sm text-stone-500">Xem nhanh tình hình kinh doanh của hiệu sách.</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-stone-500 hover:underline">
          ← Về trang chủ
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng sách" value="156" hint="Đầu sách hiện có" icon="📚" />
        <StatCard label="Đơn hàng" value="38" hint="Trong tháng này" icon="📦" />
        <StatCard label="Doanh thu" value="9.650.000đ" hint="Tăng 12% so với tháng trước" icon="💰" />
        <StatCard label="Thành viên" value="84" hint="Người dùng đã đăng ký" icon="👤" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart (SVG-based) */}
        <div className="lg:col-span-2 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-stone-800">Doanh thu 6 tháng gần nhất</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Tổng quan
            </span>
          </div>

          {/* Simple simulated bar chart using flexbox */}
          <div className="h-64 flex flex-col justify-between pt-6">
            <div className="h-48 flex items-end justify-between gap-4 px-2 relative">
              {monthlySales.map((s) => {
                const pct = (s.amount / maxAmount) * 100 // Max height 100% of the h-48 container
                return (
                  <div key={s.month} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-stone-850 text-white text-[10px] font-bold py-1.5 px-2.5 rounded shadow-lg pointer-events-none transition-all duration-200"
                      style={{ bottom: `calc(${pct}% + 10px)`, zIndex: 10 }}>
                      {formatVND(s.amount)}
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                      style={{ 
                        height: `${pct}%`, 
                        background: 'linear-gradient(to top, #8b4513, #cd853f)',
                        boxShadow: '0 4px 12px rgba(139, 69, 19, 0.12)'
                      }}
                    />
                  </div>
                )
              })}
            </div>
            {/* Labels under the bars */}
            <div className="flex justify-between gap-4 px-2 mt-2 border-t border-stone-100 pt-2">
              {monthlySales.map((s) => (
                <div key={s.month} className="flex-1 text-center text-xs font-bold text-stone-500">
                  {s.month}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Books */}
        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-stone-800 mb-4">Sách bán chạy nhất</h3>
          <div className="space-y-4">
            {topBooks.map((book, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-12 w-10 overflow-hidden rounded bg-slate-100 border border-stone-200 shrink-0">
                  <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-stone-850">{book.title}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{book.sales} lượt bán</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold" style={{ color: '#8b4513' }}>{formatVND(book.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-3 border-t border-stone-100 text-center">
            <Link to="/admin/books" className="text-xs font-bold text-amber-800 hover:underline">
              Quản lý toàn bộ sách →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-amber-100">
          <h3 className="text-sm font-bold text-stone-850">Đơn đặt hàng gần đây</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-amber-800 hover:underline">
            Xem tất cả đơn hàng →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-amber-100">
              <tr>
                <th className="px-5 py-3">Mã đơn</th>
                <th className="px-5 py-3">Khách hàng</th>
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="px-5 py-3 font-semibold text-stone-900">{o.id}</td>
                  <td className="px-5 py-3 text-stone-700">{o.customerName}</td>
                  <td className="px-5 py-3 text-stone-600">{formatDateTime(o.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span className={['inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', statusBadge(o.status)].join(' ')}>
                      {labelStatus(o.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold" style={{ color: '#8b4513' }}>{formatVND(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-400">{label}</div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mt-3 text-2xl font-extrabold tracking-tight text-stone-900">{value}</div>
      <div className="mt-1.5 text-xs text-stone-450">{hint}</div>
    </div>
  )
}
