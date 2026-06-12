import { useState } from 'react'
import { getAuthUser, setAuthUser } from '../../services/auth'
import toast from 'react-hot-toast'

export function AdminProfilePage() {
  const [user, setUser] = useState(() => getAuthUser())
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || 'Admin')
  const [phone, setPhone] = useState('0987654321')
  const [address, setAddress] = useState('123 Đường Sách, Quận 1, TP. Hồ Chí Minh')
  
  // Avatar upload states
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [avatarInputUrl, setAvatarInputUrl] = useState('')
  const [localAvatarData, setLocalAvatarData] = useState<string | null>(null)

  if (!user) return null

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsEditing(false)
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
        setAvatarInputUrl('') // Clear URL input when file is chosen
      }
    }
    reader.readAsDataURL(file)
  }

  // Save changes to avatar
  function saveAvatar() {
    if (!user) return
    const finalUrl = localAvatarData || avatarInputUrl.trim()
    if (!finalUrl) {
      toast.error('Vui lòng chọn ảnh hoặc nhập link ảnh')
      return
    }

    const updatedUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: finalUrl,
    }
    setAuthUser(updatedUser)
    setUser(updatedUser)
    setShowAvatarModal(false)
    setLocalAvatarData(null)
    setAvatarInputUrl('')
    toast.success('Cập nhật ảnh đại diện Admin thành công!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#1A365D' }}>
          Quản trị viên
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Hồ sơ cá nhân</h1>
        <p className="text-sm text-stone-500">Xem và cập nhật thông tin tài khoản quản trị.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Avatar & Basic Stats */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm text-center">
            {/* Admin Avatar Circle */}
            <div className="relative mx-auto mb-4 h-24 w-24 group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={name} className="h-full w-full rounded-full object-cover border border-amber-200 shadow-md ring-4 ring-amber-100" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full text-white text-4xl font-extrabold shadow-md"
                  style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}>
                  👑
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Thay đổi
              </div>
            </div>

            <h2 className="text-xl font-bold text-stone-900">{name}</h2>
            <p className="text-sm text-stone-500 mb-2">{user.email}</p>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
              System Admin
            </span>

            <div className="mt-6 border-t border-stone-100 pt-6 text-left space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Vai trò chính</div>
                <div className="text-sm font-semibold text-stone-800">Quản trị viên tối cao</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Ngày gia nhập</div>
                <div className="text-sm font-semibold text-stone-800">01/06/2026</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Trạng thái hệ thống</div>
                <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Hoạt động (Trực tuyến)
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log Summary */}
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-stone-800 mb-4">Nhật ký hoạt động gần đây</h3>
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between items-start gap-2">
                <span>• Đăng nhập hệ thống thành công</span>
                <span className="text-stone-400 shrink-0">10 phút trước</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span>• Cập nhật thông tin sách "Clean Code"</span>
                <span className="text-stone-400 shrink-0">2 giờ trước</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span>• Xác nhận đơn hàng DH-10003</span>
                <span className="text-stone-400 shrink-0">1 ngày trước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Permissions & Detail Edit */}
        <div className="md:col-span-2 space-y-6">
          {/* Permissions section */}
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-4">🛡️ Quyền hạn trên hệ thống</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <PermissionItem label="Quản lý sách & Danh mục" desc="Thêm, sửa, xoá sản phẩm" enabled={true} />
              <PermissionItem label="Quản lý đơn hàng" desc="Xử lý trạng thái giao hàng" enabled={true} />
              <PermissionItem label="Quản lý người dùng" desc="Khoá/Mở khoá tài khoản khách" enabled={true} />
              <PermissionItem label="Xem báo cáo doanh thu" desc="Biểu đồ phân tích doanh thu" enabled={true} />
              <PermissionItem label="Cấu hình hệ thống" desc="Thay đổi cài đặt website" enabled={false} />
              <PermissionItem label="Quản trị cơ sở dữ liệu" desc="Truy xuất dữ liệu gốc" enabled={false} />
            </div>
          </div>

          {/* Detailed Info / Form */}
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-stone-900">📝 Thông tin chi tiết</h3>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition"
                  style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-stone-700">Họ và tên</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-stone-700">Số điện thoại</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-xs font-semibold text-stone-700">Địa chỉ liên hệ</span>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400"
                  />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-amber-50"
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition"
                    style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Họ và tên</div>
                  <div className="font-semibold text-stone-800">{name}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Số điện thoại</div>
                  <div className="font-semibold text-stone-800">{phone}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Địa chỉ liên hệ</div>
                  <div className="font-semibold text-stone-800">{address}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Email hệ thống</div>
                  <div className="font-semibold text-stone-800">{user.email}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Avatar Edit Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">📷 Thay đổi ảnh đại diện Admin</h3>
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
              {/* File Input */}
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

              {/* URL Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Link ảnh từ web</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarInputUrl}
                  onChange={(e) => {
                    setAvatarInputUrl(e.target.value)
                    setLocalAvatarData(null) // Clear file if URL is written
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

function PermissionItem({ label, desc, enabled }: { label: string; desc: string; enabled: boolean }) {
  return (
    <div className={`flex gap-3 rounded-xl border p-3 shadow-sm ${enabled ? 'border-emerald-100 bg-emerald-50/50' : 'border-stone-100 bg-stone-50/50 opacity-60'}`}>
      <span className={`text-lg leading-none ${enabled ? 'text-emerald-600' : 'text-stone-400'}`}>
        {enabled ? '✓' : '×'}
      </span>
      <div>
        <div className={`text-xs font-bold ${enabled ? 'text-stone-800' : 'text-stone-400'}`}>{label}</div>
        <div className="text-[10px] text-stone-500 mt-0.5">{desc}</div>
      </div>
    </div>
  )
}
