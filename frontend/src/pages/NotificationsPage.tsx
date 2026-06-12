import { useState } from 'react'
import toast from 'react-hot-toast'

const INITIAL_NOTIFICATIONS = [
  { id: '1', type: 'order', icon: '📦', title: 'Đơn hàng #12345 đã được giao thành công', time: '5 phút trước', read: false },
  { id: '2', type: 'promo', icon: '🎁', title: 'Ưu đãi Flash Sale – Giảm đến 50% cuối tuần này!', time: '2 giờ trước', read: false },
  { id: '3', type: 'news', icon: '📰', title: 'Top 10 sách bán chạy tuần này vừa được cập nhật', time: '1 ngày trước', read: true },
  { id: '4', type: 'promo', icon: '🏷️', title: 'Thành viên mới – Tặng voucher 20.000đ cho đơn đầu tiên', time: '2 ngày trước', read: true },
  { id: '5', type: 'system', icon: '🔔', title: 'Chính sách đổi trả mới áp dụng từ 01/06/2026', time: '3 ngày trước', read: true },
  { id: '6', type: 'order', icon: '⭐', title: 'Hãy đánh giá sách "Atomic Habits" bạn vừa mua!', time: '5 ngày trước', read: true },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState('Tất cả')

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'Tất cả') return true
    if (activeTab === 'Đơn hàng') return n.type === 'order'
    if (activeTab === 'Khuyến mãi') return n.type === 'promo'
    if (activeTab === 'Tin tức') return n.type === 'news' || n.type === 'system'
    return true
  })

  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success('Đã đánh dấu đọc tất cả thông báo!')
  }

  // Delete a notification
  const deleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Prevent triggering click to mark as read
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.success('Đã xoá thông báo')
  }

  // Get style class based on notification type and read state
  const getCardStyle = (type: string, read: boolean) => {
    const base = 'flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md cursor-pointer relative group'
    if (read) {
      return `${base} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100`
    }
    
    // Unread styles based on type
    switch (type) {
      case 'order':
        return `${base} bg-green-50/60 dark:bg-green-950/10 border-green-200 dark:border-green-900/50 shadow-[0_2px_8px_-3px_rgba(34,197,94,0.2)]`
      case 'promo':
        return `${base} bg-amber-50/60 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/50 shadow-[0_2px_8px_-3px_rgba(245,158,11,0.2)]`
      case 'news':
        return `${base} bg-blue-50/60 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/50 shadow-[0_2px_8px_-3px_rgba(59,130,246,0.2)]`
      default:
        return `${base} bg-purple-50/60 dark:bg-purple-950/10 border-purple-200 dark:border-purple-900/50 shadow-[0_2px_8px_-3px_rgba(168,85,247,0.2)]`
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔔</span> Thông báo
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {unreadCount > 0 ? (
              <span>Bạn có <span className="font-extrabold text-[#C2410C]">{unreadCount}</span> thông báo chưa đọc</span>
            ) : (
              'Bạn đã đọc hết tất cả thông báo'
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-55 dark:hover:bg-slate-700 text-[#1A365D] dark:text-blue-400 transition shadow-sm"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['Tất cả', 'Đơn hàng', 'Khuyến mãi', 'Tin tức'].map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all duration-200 whitespace-nowrap border ${
                isActive
                  ? 'bg-[#1A365D] text-white border-[#1A365D] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-55 dark:bg-slate-900 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-850'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={getCardStyle(n.type, n.read)}
          >
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-850 shadow-sm border border-slate-100 dark:border-slate-800 text-xl">
              {n.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
              <div className={`text-sm leading-snug transition-colors ${
                n.read 
                  ? 'text-slate-600 dark:text-slate-400 font-medium' 
                  : 'text-slate-900 dark:text-slate-150 font-bold'
              }`}>
                {n.title}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-2">
                <span>{n.time}</span>
                <span>•</span>
                <span className="capitalize font-semibold text-slate-500 dark:text-slate-450 text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  {n.type === 'promo' ? 'Khuyến mãi' : n.type === 'order' ? 'Đơn hàng' : n.type === 'system' ? 'Hệ thống' : 'Tin tức'}
                </span>
              </div>
            </div>

            {/* Actions: delete button + unread dot */}
            <div className="flex items-center gap-2 shrink-0 self-center">
              {!n.read && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#1A365D] dark:bg-blue-500 shrink-0 shadow-sm animate-pulse" />
              )}
              <button
                type="button"
                onClick={(e) => deleteNotification(e, n.id)}
                className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-lg flex items-center justify-center text-slate-450 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-100"
                title="Xoá thông báo"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-5xl mb-4">📭</div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">Không có thông báo nào</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
            Hòm thư của bạn ở mục <span className="font-semibold">"{activeTab}"</span> đang trống. Các thông báo mới sẽ tự động cập nhật tại đây.
          </p>
          {activeTab !== 'Tất cả' && (
            <button
              onClick={() => setActiveTab('Tất cả')}
              className="mt-4 rounded-xl bg-[#1A365D] text-white px-4 py-2 text-xs font-bold shadow-sm hover:bg-[#2B6CB0] transition"
            >
              Xem tất cả thông báo
            </button>
          )}
        </div>
      )}
    </div>
  )
}
