import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthUser, clearAuthUser, setAuthUser } from '../services/auth'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getAuthUser())
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [avatarInputUrl, setAvatarInputUrl] = useState('')
  const [localAvatarData, setLocalAvatarData] = useState<string | null>(null)

  useEffect(() => {
    const u = getAuthUser()
    if (!u) {
      toast.error('Vui lòng đăng nhập để xem thông tin tài khoản')
      navigate('/auth', { replace: true })
    } else {
      setUser(u)
    }
  }, [navigate])

  function handleLogout() {
    clearAuthUser()
    toast.success('Đã đăng xuất thành công')
    navigate('/', { replace: true })
  }

  // Handle local file selection
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh hợp lệ')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không vượt quá 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLocalAvatarData(reader.result)
        setAvatarInputUrl('') // Clear URL if file is selected
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle saving avatar changes
  function saveAvatar() {
    if (!user) return
    const finalUrl = localAvatarData || avatarInputUrl.trim()
    if (!finalUrl) {
      toast.error('Vui lòng chọn ảnh hoặc nhập link ảnh')
      return
    }

    const updatedUser = { ...user, avatarUrl: finalUrl }
    setAuthUser(updatedUser)
    setUser(updatedUser)
    setShowAvatarModal(false)
    setLocalAvatarData(null)
    setAvatarInputUrl('')
    toast.success('Cập nhật ảnh đại diện thành công!')
  }

  if (!user) return null

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="rounded-3xl p-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)' }} />
        <div className="relative">
          {/* Avatar Container */}
          <div className="relative mx-auto mb-4 h-24 w-24 group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full rounded-full object-cover ring-4 ring-white/30 shadow-xl" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full text-2xl font-extrabold text-white ring-4 ring-white/30 shadow-xl"
                style={{ background: 'rgba(255,255,255,0.2)' }}>
                {initials}
              </div>
            )}
            {/* Hover overlay edit */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Thay đổi
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
          <p className="text-amber-200 text-sm mt-1">{user.email}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
            {user.role === 'admin' ? '👑 Quản trị viên' : '👤 Thành viên'}
          </span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { icon: '❤️', label: 'Yêu thích', to: '/wishlist' },
          { icon: '🛒', label: 'Giỏ hàng', to: '/cart' },
          { 
            icon: '🔄', 
            label: 'So sánh sách', 
            to: '#compare', 
            action: (e: React.MouseEvent) => {
              e.preventDefault()
              window.dispatchEvent(new CustomEvent('open-compare-modal'))
            } 
          },
          { icon: '🔔', label: 'Thông báo', to: '/notifications' },
          { icon: '📰', label: 'Tin tức', to: '/news' },
        ].map((item) => {
          if (item.action) {
            return (
              <a key={item.label} href={item.to} onClick={item.action}
                className="flex flex-col items-center rounded-2xl border border-amber-200 bg-white p-4 text-center shadow-sm transition hover:bg-amber-50 hover:shadow-md cursor-pointer">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs font-semibold text-stone-700">{item.label}</span>
              </a>
            )
          }
          return (
            <Link key={item.label} to={item.to}
              className="flex flex-col items-center rounded-2xl border border-amber-200 bg-white p-4 text-center shadow-sm transition hover:bg-amber-50 hover:shadow-md">
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-semibold text-stone-700">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-stone-900">📋 Thông tin tài khoản</h2>
        <div className="space-y-3">
          {[
            { label: 'Họ và tên', value: user.name },
            { label: 'Email', value: user.email },
            { label: 'Vai trò', value: user.role === 'admin' ? 'Quản trị viên' : 'Thành viên' },
            { label: 'Ngày tham gia', value: 'Tháng 6, 2026' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 border border-amber-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">{row.label}</span>
              <span className="text-sm font-semibold text-stone-800">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm space-y-2">
        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">Cài đặt tài khoản</h2>
        {user.role === 'admin' && (
          <Link to="/admin"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-amber-50"
            style={{ color: '#8b4513' }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            Vào bảng quản trị
          </Link>
        )}
        <Link to="/support"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-amber-50">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
          Hỗ trợ khách hàng
        </Link>
        <button onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
          <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
          Đăng xuất
        </button>
      </div>

      {/* Avatar Edit Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">📷 Thay đổi ảnh đại diện</h3>
              <button type="button" onClick={() => { setShowAvatarModal(false); setLocalAvatarData(null); }} className="text-stone-400 hover:text-stone-650 text-sm font-bold">✕</button>
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center py-2">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-amber-300">
                {(localAvatarData || avatarInputUrl) ? (
                  <img src={localAvatarData || avatarInputUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-800">Không có ảnh</div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Device File */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Chọn ảnh từ thiết bị</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-150 cursor-pointer"
                />
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-4 text-stone-450 text-xs font-bold">HOẶC</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Link ảnh từ web</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarInputUrl}
                  onChange={(e) => {
                    setAvatarInputUrl(e.target.value)
                    setLocalAvatarData(null) // Clear file if URL is typed
                  }}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-amber-400 text-stone-850"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-amber-100">
              <button
                type="button"
                onClick={() => { setShowAvatarModal(false); setLocalAvatarData(null); }}
                className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-amber-50 transition"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={saveAvatar}
                className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition"
                style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
