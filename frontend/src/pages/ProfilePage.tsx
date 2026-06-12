import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuthUser, clearAuthUser, setAuthUser } from '../services/auth'
import { useTheme } from '../contexts/ThemeContext'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getAuthUser())
  
  // Avatar states
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [avatarInputUrl, setAvatarInputUrl] = useState('')
  const [localAvatarData, setLocalAvatarData] = useState<string | null>(null)

  // Profile editing states
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('qls_email_notifications') !== 'false'
  })
  const { theme, toggleTheme } = useTheme()

  // Change password states
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const u = getAuthUser()
    if (!u) {
      toast.error('Vui lòng đăng nhập để xem thông tin tài khoản')
      navigate('/login', { replace: true })
    } else {
      setUser(u)
      setEditName(u.name)
      setEditEmail(u.email)
    }
  }, [navigate])

  useEffect(() => {
    localStorage.setItem('qls_email_notifications', String(emailNotifications))
  }, [emailNotifications])

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

  // Handle save profile details
  function handleSaveProfile() {
    if (!user) return
    const nameTrim = editName.trim()
    const emailTrim = editEmail.trim()

    if (!nameTrim) {
      toast.error('Họ và tên không được để trống')
      return
    }
    if (!emailTrim) {
      toast.error('Email không được để trống')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      toast.error('Định dạng email không hợp lệ')
      return
    }

    const updatedUser = { ...user, name: nameTrim, email: emailTrim }
    setAuthUser(updatedUser)
    setUser(updatedUser)
    setIsEditing(false)
    toast.success('Cập nhật thông tin cá nhân thành công!')
  }

  // Handle change password
  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ các trường đổi mật khẩu')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu mới không khớp')
      return
    }

    toast.success('Đổi mật khẩu thành công!')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
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
        style={{ background: 'linear-gradient(135deg, #1A365D 0%, #2B6CB0 100%)' }}>
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
          { icon: '❤️', label: 'Yêu thích', to: '/wishlist', id: 'wishlist' },
          { icon: '🛒', label: 'Giỏ hàng', to: '/cart', id: 'cart' },
          { 
            icon: '🔄', 
            label: 'So sánh sách', 
            to: '#compare', 
            id: 'compare',
            action: (e: React.MouseEvent) => {
              e.preventDefault()
              window.dispatchEvent(new CustomEvent('open-compare-modal'))
            } 
          },
          { icon: '🔔', label: 'Thông báo', to: '/notifications', id: 'notifications' },
          { icon: '📰', label: 'Tin tức', to: '/news', id: 'news' },
        ].map((item) => {
          if (item.action) {
            return (
              <a key={item.label} href={item.to} onClick={item.action}
                className="flex flex-col items-center rounded-2xl border border-amber-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center shadow-sm transition hover:bg-amber-50 dark:hover:bg-slate-800 hover:shadow-md cursor-pointer">
                <QuickLinkIcon id={item.id} emoji={item.icon} label={item.label} />
                <span className="text-xs font-semibold text-stone-700 dark:text-slate-300">{item.label}</span>
              </a>
            )
          }
          return (
            <Link key={item.label} to={item.to}
              className="flex flex-col items-center rounded-2xl border border-amber-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center shadow-sm transition hover:bg-amber-50 dark:hover:bg-slate-800 hover:shadow-md">
              <QuickLinkIcon id={item.id} emoji={item.icon} label={item.label} />
              <span className="text-xs font-semibold text-stone-700 dark:text-slate-300">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white">📋 Thông tin cá nhân</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#1A365D] hover:bg-[#2B6CB0] text-white px-3 py-1.5 text-xs font-bold transition shadow-sm"
            >
              <img src="/icons/pencil.png" alt="Sửa" className="h-3.5 w-3.5 object-contain" />
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 text-stone-700 px-3 py-1.5 text-xs font-semibold transition"
              >
                Huỷ
              </button>
              <button
                onClick={handleSaveProfile}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition shadow-sm"
              >
                Lưu
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {/* Họ và tên */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-amber-50 dark:bg-slate-950 px-4 py-3 border border-amber-100 dark:border-slate-800 gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-450 dark:text-slate-500">Họ và tên</span>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full sm:max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            ) : (
              <span className="text-sm font-semibold text-stone-800 dark:text-slate-200">{user.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-amber-50 dark:bg-slate-950 px-4 py-3 border border-amber-100 dark:border-slate-800 gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-450 dark:text-slate-500">Email</span>
            {isEditing ? (
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full sm:max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            ) : (
              <span className="text-sm font-semibold text-stone-800 dark:text-slate-200">{user.email}</span>
            )}
          </div>

          {/* Vai trò */}
          <div className="flex items-center justify-between rounded-xl bg-amber-50 dark:bg-slate-950 px-4 py-3 border border-amber-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-455 dark:text-slate-500">Vai trò</span>
            <span className="text-sm font-semibold text-stone-800 dark:text-slate-200">
              {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
            </span>
          </div>

          {/* Ngày tham gia */}
          <div className="flex items-center justify-between rounded-xl bg-amber-50 dark:bg-slate-950 px-4 py-3 border border-amber-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-455 dark:text-slate-500">Ngày tham gia</span>
            <span className="text-sm font-semibold text-stone-800 dark:text-slate-200">Tháng 6, 2026</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="text-sm font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider mb-2">⚙️ Cài đặt tài khoản</h2>
        <div className="space-y-3">
          {/* Toggle email notifications */}
          <div className="flex items-center justify-between rounded-xl bg-amber-50/50 dark:bg-slate-955 px-4 py-3 border border-amber-100 dark:border-slate-800 transition">
            <div className="space-y-0.5 pr-2">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Thông báo qua Email</div>
              <div className="text-[10px] text-slate-500">Nhận cập nhật về đơn hàng và khuyến mãi mới nhất.</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmailNotifications(!emailNotifications)
                toast.success(
                  !emailNotifications
                    ? 'Đã bật nhận thông báo qua email'
                    : 'Đã tắt nhận thông báo qua email'
                )
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                emailNotifications ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  emailNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle Dark/Light Mode */}
          <div className="flex items-center justify-between rounded-xl bg-amber-50/50 dark:bg-slate-955 px-4 py-3 border border-amber-100 dark:border-slate-800 transition">
            <div className="space-y-0.5 pr-2">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Giao diện Sáng / Tối</div>
              <div className="text-[10px] text-slate-500">Chuyển đổi giao diện hệ thống cho phù hợp với môi trường.</div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                theme === 'dark' ? 'bg-[#1A365D]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="text-sm font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider">🔑 Đổi mật khẩu</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-505 dark:text-slate-405 mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-amber-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-505 dark:text-slate-405 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập tối thiểu 6 ký tự"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-amber-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-505 dark:text-slate-405 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-amber-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95 mt-1"
            style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>

      {/* Website Info */}
      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider">ℹ️ Thông tin Website</h2>
        <div className="text-xs text-stone-600 dark:text-slate-400 space-y-2.5 leading-relaxed pt-1">
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span>Hệ thống bán sách:</span>
            <span className="font-bold text-[#1A365D] dark:text-blue-400">SachStore Online</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span>Phiên bản:</span>
            <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">v2.4.1 (Stable)</code>
          </div>
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span>Giấy phép hoạt động:</span>
            <span>Chính thức (Bản quyền 2026)</span>
          </div>
          <div className="flex justify-between">
            <span>Nhà phát triển:</span>
            <span className="font-semibold text-amber-800 dark:text-amber-500">SachStore Team</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">Tác vụ khác</h2>
        {user.role === 'admin' && (
          <Link to="/admin"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-amber-50 dark:hover:bg-slate-850"
            style={{ color: '#1A365D' }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            Vào bảng quản trị
          </Link>
        )}
        <Link to="/support"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-stone-700 dark:text-slate-300 transition hover:bg-amber-50 dark:hover:bg-slate-850">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
          Hỗ trợ khách hàng
        </Link>
        <button onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/20">
          <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
          Đăng xuất
        </button>
      </div>

      {/* Avatar Edit Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">📷 Thay đổi ảnh đại diện</h3>
              <button type="button" onClick={() => { setShowAvatarModal(false); setLocalAvatarData(null); }} className="text-stone-400 hover:text-stone-600 text-sm font-bold">✕</button>
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center py-2">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-amber-300">
                {(localAvatarData || avatarInputUrl) ? (
                  <img src={localAvatarData || avatarInputUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-300">Không có ảnh</div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Device File */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-1">Chọn ảnh từ thiết bị</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 dark:file:bg-slate-850 file:text-amber-900 dark:file:text-amber-300 hover:file:bg-amber-150 cursor-pointer"
                />
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-stone-400 dark:text-slate-500 text-xs font-bold">HOẶC</span>
                <div className="flex-grow border-t border-stone-200 dark:border-slate-800"></div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-1">Link ảnh từ web</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarInputUrl}
                  onChange={(e) => {
                    setAvatarInputUrl(e.target.value)
                    setLocalAvatarData(null) // Clear file if URL is typed
                  }}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-amber-400 text-stone-800 dark:border-slate-700 dark:bg-slate-955 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-amber-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setShowAvatarModal(false); setLocalAvatarData(null); }}
                className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-amber-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={saveAvatar}
                className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition"
                style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
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

function QuickLinkIcon({ id, emoji, label }: { id: string; emoji: string; label: string }) {
  const [error, setError] = useState(false)

  // Mapping from quick link ID to actual uploaded filename
  const QUICK_LINK_ICON_MAP: Record<string, string> = {
    wishlist: 'burst.png',
    cart: 'credit.png',
    compare: 'shield.png',
    notifications: 'chat.png',
    news: 'globe.png',
  }

  if (error) {
    return <span className="text-2xl mb-1">{emoji}</span>
  }

  const iconFile = QUICK_LINK_ICON_MAP[id] || `${id}.png`

  return (
    <img
      src={`/icons/${iconFile}`}
      alt={label}
      onError={() => setError(true)}
      className="h-8 w-8 object-contain mb-1 shrink-0"
    />
  )
}
