import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthUser, getAuthUser } from '../../services/auth'

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-xl px-3 py-2 text-sm font-semibold transition',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')
}

export function AdminLayout() {
  const user = getAuthUser()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) {
    return (
      <div className="mx-auto max-w-lg space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="text-sm font-semibold text-indigo-700">Admin</div>
        <div className="text-xl font-bold tracking-tight text-slate-900">Cần đăng nhập để vào quản trị</div>
        <p className="text-sm text-slate-600">
          Vui lòng đăng nhập để tiếp tục.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to={`/auth?next=${encodeURIComponent(location.pathname)}`}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Đăng nhập
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-lg space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="text-sm font-semibold text-indigo-700">Admin</div>
        <div className="text-xl font-bold tracking-tight text-slate-900">Không đủ quyền truy cập</div>
        <p className="text-sm text-slate-600">Tài khoản hiện tại không có quyền Admin.</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">Quản trị</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearAuthUser()
              navigate('/', { replace: true })
            }}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Đăng xuất
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          <NavLink to="/admin" end className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin#books" className={navClass}>
            Quản lý sách
          </NavLink>
          <NavLink to="/admin#orders" className={navClass}>
            Đơn hàng
          </NavLink>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
          Tip: Đăng nhập bằng email có chứa <span className="font-semibold text-slate-800">admin</span> để vào quyền admin (demo).
        </div>
      </aside>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}

