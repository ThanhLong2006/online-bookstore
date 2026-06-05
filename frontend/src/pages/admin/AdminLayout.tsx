import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthUser, getAuthUser } from '../../services/auth'



export function AdminLayout() {
  const user = getAuthUser()
  const navigate = useNavigate()
  const location = useLocation()

  // Chưa đăng nhập
  if (!user) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white text-2xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
          🔒
        </div>
        <div className="text-xl font-bold text-stone-900">Cần đăng nhập để vào quản trị</div>
        <p className="text-sm text-stone-500">Vui lòng đăng nhập để tiếp tục.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to={`/auth?next=${encodeURIComponent(location.pathname)}`}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
            Đăng nhập
          </Link>
          <Link to="/"
            className="rounded-xl border border-amber-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-amber-50">
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  // Không đủ quyền
  if (user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
          ⛔
        </div>
        <div className="text-xl font-bold text-stone-900">Không đủ quyền truy cập</div>
        <p className="text-sm text-stone-500">
          Tài khoản <strong className="text-stone-800">{user.name}</strong> không có quyền Admin.
        </p>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-stone-600">
          💡 Để được quyền Admin, hãy <strong>đăng ký tài khoản mới với tên là "admin"</strong>.
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link to="/"
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
            Về trang chủ
          </Link>
          <Link to="/auth"
            className="rounded-xl border border-amber-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-amber-50">
            Đăng nhập lại
          </Link>
        </div>
      </div>
    )
  }

  // Admin hợp lệ
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Sidebar Admin */}
      <aside className="h-fit rounded-2xl border border-amber-200 bg-white shadow-sm lg:sticky lg:top-24 overflow-hidden">
        {/* Header sidebar */}
        <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-extrabold">
              👑
            </div>
            <div>
              <div className="text-sm font-bold">Quản trị viên</div>
              <div className="text-xs text-amber-200 truncate max-w-[140px]">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div className="p-3 space-y-0.5">
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Menu</div>

          <NavLink to="/admin" end
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'text-white shadow-sm' : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900'}`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #8b4513, #a0522d)' } : {}}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" style={{ width: '20px', height: '20px' }}><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
            Dashboard
          </NavLink>

          <NavLink to="/admin/books"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'text-white shadow-sm' : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900'}`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #8b4513, #a0522d)' } : {}}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" style={{ width: '20px', height: '20px' }}><path fill="currentColor" d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-6 2 1 2H9l1-2h2zm6 16H6V4h2v4h8V4h2v16z" /></svg>
            Quản lý sách
          </NavLink>

          <NavLink to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'text-white shadow-sm' : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900'}`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #8b4513, #a0522d)' } : {}}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" style={{ width: '20px', height: '20px' }}><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" /></svg>
            Người dùng
          </NavLink>

          <NavLink to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'text-white shadow-sm' : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900'}`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #8b4513, #a0522d)' } : {}}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" style={{ width: '20px', height: '20px' }}><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
            Đơn hàng
          </NavLink>

          <NavLink to="/admin/profile"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'text-white shadow-sm' : 'text-stone-600 hover:bg-amber-50 hover:text-amber-900'}`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #8b4513, #a0522d)' } : {}}>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" style={{ width: '20px', height: '20px' }}><path fill="currentColor" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
            Hồ sơ Admin
          </NavLink>

          <div className="h-px bg-amber-100 my-2" />

          <Link to="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-500 hover:bg-amber-50 transition">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" style={{ width: '20px', height: '20px' }}><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
            Về trang chủ
          </Link>

          <button type="button"
            onClick={() => { clearAuthUser(); navigate('/', { replace: true }) }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" style={{ width: '20px', height: '20px' }}><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Nội dung chính */}
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
