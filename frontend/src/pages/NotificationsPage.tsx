const NOTIFICATIONS = [
  { id: '1', type: 'order', icon: '📦', title: 'Đơn hàng #12345 đã được giao thành công', time: '5 phút trước', read: false, color: 'bg-green-50 border-green-200' },
  { id: '2', type: 'promo', icon: '🎁', title: 'Ưu đãi Flash Sale – Giảm đến 50% cuối tuần này!', time: '2 giờ trước', read: false, color: 'bg-amber-50 border-amber-200' },
  { id: '3', type: 'news', icon: '📰', title: 'Top 10 sách bán chạy tuần này vừa được cập nhật', time: '1 ngày trước', read: true, color: 'bg-white border-stone-200' },
  { id: '4', type: 'promo', icon: '🏷️', title: 'Thành viên mới – Tặng voucher 20.000đ cho đơn đầu tiên', time: '2 ngày trước', read: true, color: 'bg-white border-stone-200' },
  { id: '5', type: 'system', icon: '🔔', title: 'Chính sách đổi trả mới áp dụng từ 01/06/2026', time: '3 ngày trước', read: true, color: 'bg-white border-stone-200' },
  { id: '6', type: 'order', icon: '⭐', title: 'Hãy đánh giá sách "Atomic Habits" bạn vừa mua!', time: '5 ngày trước', read: true, color: 'bg-white border-stone-200' },
]

export function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">🔔 Thông báo</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {unread > 0 ? `Bạn có ${unread} thông báo chưa đọc` : 'Tất cả đã được đọc'}
          </p>
        </div>
        {unread > 0 && (
          <button className="text-xs font-semibold hover:underline" style={{ color: '#8b4513' }}>
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['Tất cả', 'Đơn hàng', 'Khuyến mãi', 'Tin tức'].map((tab) => (
          <button key={tab}
            className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-amber-50 transition first:bg-amber-800 first:text-white first:border-amber-800">
            {tab}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id}
            className={`flex items-start gap-4 rounded-2xl border p-4 transition hover:shadow-sm cursor-pointer ${n.color}`}>
            <div className="text-2xl shrink-0">{n.icon}</div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm leading-snug ${n.read ? 'text-stone-600 font-medium' : 'text-stone-900 font-bold'}`}>
                {n.title}
              </div>
              <div className="text-xs text-stone-400 mt-1">{n.time}</div>
            </div>
            {!n.read && (
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: '#8b4513' }} />
            )}
          </div>
        ))}
      </div>

      {NOTIFICATIONS.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="text-5xl mb-4">🔕</div>
          <div className="text-lg font-bold text-stone-900">Chưa có thông báo</div>
          <p className="text-sm text-stone-500 mt-1">Các thông báo mới sẽ xuất hiện ở đây.</p>
        </div>
      )}
    </div>
  )
}
