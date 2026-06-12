import { useState } from 'react'

type UserRow = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  joinDate: string
  orders: number
  status: 'active' | 'blocked'
}

const MOCK_USERS: UserRow[] = [
  { id: '1', name: 'admin',          email: 'admin@sachstore.vn',    role: 'admin', joinDate: '01/06/2026', orders: 0,  status: 'active'  },
  { id: '2', name: 'Nguyễn Minh',   email: 'minh@example.com',      role: 'user',  joinDate: '03/06/2026', orders: 3,  status: 'active'  },
  { id: '3', name: 'Trần Anh',       email: 'anh@example.com',       role: 'user',  joinDate: '04/06/2026', orders: 2,  status: 'active'  },
  { id: '4', name: 'Lê Vy',          email: 'levy@example.com',      role: 'user',  joinDate: '04/06/2026', orders: 1,  status: 'active'  },
  { id: '5', name: 'Phạm Tuấn',      email: 'tuan@example.com',      role: 'user',  joinDate: '05/06/2026', orders: 4,  status: 'active'  },
  { id: '6', name: 'Hoàng Lan',      email: 'lan@example.com',       role: 'user',  joinDate: '05/06/2026', orders: 1,  status: 'blocked' },
  { id: '7', name: 'Vũ Thành Nam',   email: 'nam@example.com',       role: 'user',  joinDate: '05/06/2026', orders: 2,  status: 'active'  },
  { id: '8', name: 'Đặng Thu Hương', email: 'huong@example.com',     role: 'user',  joinDate: '05/06/2026', orders: 2,  status: 'active'  },
]

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>(MOCK_USERS)
  const [query, setQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')

  const filtered = users.filter((u) => {
    const matchQ = !query.trim() || `${u.name} ${u.email}`.toLowerCase().includes(query.trim().toLowerCase())
    const matchRole = filterRole === 'all' || u.role === filterRole
    return matchQ && matchRole
  })

  function toggleBlock(id: string) {
    setUsers((prev) => prev.map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ))
  }

  const stats = {
    total:   users.length,
    admins:  users.filter(u => u.role === 'admin').length,
    active:  users.filter(u => u.status === 'active').length,
    blocked: users.filter(u => u.status === 'blocked').length,
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#1A365D' }}>Quản trị</div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">👥 Quản lý người dùng</h1>
        <p className="text-sm text-stone-500">Xem, phân quyền và quản lý tài khoản thành viên.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Tổng thành viên', value: stats.total,   icon: '👥', },
          { label: 'Quản trị viên',  value: stats.admins,  icon: '👑', },
          { label: 'Đang hoạt động', value: stats.active,  icon: '✅', },
          { label: 'Đã chặn',        value: stats.blocked, icon: '🚫', },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">{s.label}</div>
              <span className="text-lg">{s.icon}</span>
            </div>
            <div className="mt-1.5 text-2xl font-extrabold text-stone-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 shadow-sm flex-1 max-w-xs focus-within:border-amber-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-500 shrink-0">
            <path fill="currentColor" d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm9.707 5.293-4.256-4.256 1.414-1.414 4.256 4.256-1.414 1.414Z" />
          </svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
            placeholder="Tìm tên, email..." />
        </div>
        <div className="flex gap-1.5">
          {(['all','user','admin'] as const).map((r) => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition border ${filterRole === r ? 'text-white border-transparent' : 'bg-white text-stone-600 border-amber-200 hover:bg-amber-50'}`}
              style={filterRole === r ? { background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' } : {}}>
              {r === 'all' ? 'Tất cả' : r === 'admin' ? '👑 Admin' : '👤 User'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs font-bold uppercase tracking-wide text-stone-600" style={{ background: '#fef9f3' }}>
              <tr>
                <th className="px-4 py-3">Thành viên</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Ngày tham gia</th>
                <th className="px-4 py-3">Đơn hàng</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-amber-50/40 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                        style={{ background: u.role === 'admin' ? 'linear-gradient(135deg, #1A365D, #2B6CB0)' : '#94a3b8' }}>
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900">{u.name}</div>
                        <div className="text-xs text-stone-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.role === 'admin'
                      ? <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}>👑 Admin</span>
                      : <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">👤 User</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{u.joinDate}</td>
                  <td className="px-4 py-3 font-semibold text-stone-700">{u.orders}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {u.status === 'active' ? 'Hoạt động' : 'Đã chặn'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleBlock(u.id)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${u.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                          {u.status === 'active' ? '🚫 Chặn' : '✅ Bỏ chặn'}
                        </button>
                      )}
                      <button className="rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-amber-50 transition">
                        👁️ Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-stone-400">Không tìm thấy thành viên.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
