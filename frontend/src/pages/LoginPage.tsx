import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Đăng nhập</h1>
        <p className="text-sm text-slate-600">Demo phía client. Bạn có thể nối API auth tuỳ backend.</p>
      </div>

      <form
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault()
          const user = { name: email.split('@')[0] || 'User', email: email.trim() }
          localStorage.setItem('qls_user', JSON.stringify(user))
          navigate('/', { replace: true })
        }}
      >
        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-800">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-800">Mật khẩu</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Đăng nhập (demo)
        </button>

        <div className="text-center text-sm text-slate-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-indigo-700 hover:underline">
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  )
}

