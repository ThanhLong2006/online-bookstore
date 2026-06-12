import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { setAuthUser } from '../services/auth'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function validateLogin(values: { email: string; password: string }) {
  const errors: Partial<Record<'email' | 'password', string>> = {}
  const email = values.email.trim()
  if (!email) errors.email = 'Vui lòng nhập email.'
  else if (!isValidEmail(email)) errors.email = 'Email không đúng định dạng.'
  if (!values.password) errors.password = 'Vui lòng nhập mật khẩu.'
  return errors
}

type StoredUser = {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
}

const USERS_KEY = 'qls_users'

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as any
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((u) => u && typeof u === 'object')
      .filter((u) => typeof u.email === 'string' && typeof u.password === 'string' && typeof u.name === 'string')
      .map((u) => ({ name: u.name, email: u.email, password: u.password, role: u.role === 'admin' ? 'admin' : 'user' }))
  } catch {
    return []
  }
}

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') ?? ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  const loginErrors = useMemo(() => validateLogin({ email, password }), [email, password])

  function fieldError(key: string) {
    if (!touched[key]) return null
    return (loginErrors as any)[key] ?? null
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (Object.keys(loginErrors).length) return

    try {
      setSubmitting(true)
      const users = loadUsers()
      const found = users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase())
      
      // Default admin mock user if database is empty
      if (email.trim().toLowerCase() === 'admin123@gmail.com' && password === 'admin123') {
        const adminUser = { name: 'admin123', email: 'admin123@gmail.com', role: 'admin' as const }
        setAuthUser(adminUser)
        toast.success('Đăng nhập thành công với quyền Quản trị!')
        navigate(next || '/', { replace: true })
        return
      }

      if (!found || found.password !== password) {
        toast.error('Email hoặc mật khẩu không đúng')
        return
      }

      setAuthUser({ name: found.name, email: found.email, role: found.role })
      toast.success(found.role === 'admin' ? 'Đăng nhập thành công với quyền Quản trị!' : 'Đăng nhập thành công!')
      navigate(next || '/', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1A365D] via-[#2D3F59] to-[#C2410C] p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

      {/* Form Card */}
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white text-xl font-extrabold shadow-md mb-3"
            style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}>
            S
          </Link>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Chào mừng trở lại</h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Đăng nhập vào tài khoản SachStore của bạn</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Địa chỉ Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              placeholder="example@gmail.com"
              disabled={submitting}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-amber-100 dark:bg-slate-950 dark:text-slate-100 ${
                fieldError('email')
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 focus:border-amber-400 dark:border-slate-700'
              }`}
            />
            {fieldError('email') && (
              <p className="mt-1 text-xs text-rose-550 font-semibold">{fieldError('email')}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mật khẩu</label>
              <a href="#forgot" className="text-[10px] font-semibold text-slate-500 hover:text-[#1A365D] dark:hover:text-blue-400">Quên mật khẩu?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              placeholder="••••••••"
              disabled={submitting}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-amber-100 dark:bg-slate-950 dark:text-slate-100 ${
                fieldError('password')
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 focus:border-amber-400 dark:border-slate-700'
              }`}
            />
            {fieldError('password') && (
              <p className="mt-1 text-xs text-rose-550 font-semibold">{fieldError('password')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
          >
            {submitting ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Separator / Footer Links */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chưa có tài khoản?{' '}
            <Link to={`/register${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-bold text-[#1A365D] hover:underline dark:text-blue-400">
              Đăng ký ngay
            </Link>
          </p>
          <div>
            <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
