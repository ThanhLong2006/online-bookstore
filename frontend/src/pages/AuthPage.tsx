import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { setAuthUser } from '../services/auth'

type Mode = 'login' | 'register'
type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>>

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function validateRegister(values: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): FieldErrors {
  const errors: FieldErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const password = values.password
  const confirmPassword = values.confirmPassword

  if (!name) errors.name = 'Vui lòng nhập tên.'
  if (!email) errors.email = 'Vui lòng nhập email.'
  else if (!isValidEmail(email)) errors.email = 'Email không đúng định dạng.'

  if (!password) errors.password = 'Vui lòng nhập mật khẩu.'
  else if (password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự.'

  if (!confirmPassword) errors.confirmPassword = 'Vui lòng nhập lại mật khẩu.'
  else if (confirmPassword !== password) errors.confirmPassword = 'Mật khẩu nhập lại không khớp.'

  return errors
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
const ADMIN_SECRET = 'admin123'

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

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') ?? ''

  const [mode, setMode] = useState<Mode>('login')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registerAdmin, setRegisterAdmin] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  const registerErrors = useMemo(
    () => validateRegister({ name, email, password, confirmPassword }),
    [name, email, password, confirmPassword],
  )
  const loginErrors = useMemo(() => validateLogin({ email, password }), [email, password])

  function fieldError(key: string) {
    if (!touched[key]) return null
    if (mode === 'register') return (registerErrors as any)[key] ?? null
    return (loginErrors as any)[key] ?? null
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSuccessMessage(null)
    if (mode === 'register') {
      setTouched({ name: true, email: true, password: true, confirmPassword: true, adminKey: true })
      if (Object.keys(registerErrors).length) return
      if (registerAdmin && adminKey.trim() !== ADMIN_SECRET) {
        toast.error('Secret Admin Key không đúng')
        return
      }

      try {
        setSubmitting(true)
        const users = loadUsers()
        const exists = users.some((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase())
        if (exists) {
          toast.error('Email đã tồn tại. Vui lòng dùng email khác.')
          return
        }
        const user: StoredUser = {
          name: name.trim(),
          email: email.trim(),
          password,
          role: registerAdmin ? 'admin' : 'user',
        }
        saveUsers([user, ...users])
        toast.success('Đăng ký thành công')
        setMode('login')
        setSuccessMessage('Đăng ký thành công. Vui lòng đăng nhập.')
        setPassword('')
        setConfirmPassword('')
        setAdminKey('')
        setRegisterAdmin(false)
      } finally {
        setSubmitting(false)
      }
      return
    }

    setTouched({ email: true, password: true })
    if (Object.keys(loginErrors).length) return

    try {
      setSubmitting(true)
      const users = loadUsers()
      const found = users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase())
      if (!found || found.password !== password) {
        toast.error('Email hoặc mật khẩu không đúng')
        return
      }
      setAuthUser({ name: found.name, email: found.email, role: found.role })
      toast.success('Đăng nhập thành công')

      const target = next || (found.role === 'admin' ? '/admin' : '/')
      // Preserve SPA history behavior similar to "replace" after auth.
      navigate(target, { replace: true, state: { from: location.pathname } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
        </h1>
        <p className="text-sm text-slate-600">
          {mode === 'login'
            ? 'Đăng nhập để mua sắm và truy cập tính năng nâng cao.'
            : 'Đăng ký nhanh để lưu giỏ hàng và theo dõi đơn.'}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setSuccessMessage(null)
            }}
            className={[
              'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register')
              setSuccessMessage(null)
            }}
            className={[
              'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
          >
            Đăng ký
          </button>
        </div>

        {successMessage ? (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            {successMessage}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          {mode === 'register' ? (
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-slate-800">Tên</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                className={[
                  'w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition',
                  fieldError('name') ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-indigo-400',
                ].join(' ')}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
              {fieldError('name') ? <div className="mt-1 text-xs font-medium text-rose-700">{fieldError('name')}</div> : null}
            </label>
          ) : null}

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-800">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={[
                'w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition',
                fieldError('email') ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-indigo-400',
              ].join(' ')}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {fieldError('email') ? <div className="mt-1 text-xs font-medium text-rose-700">{fieldError('email')}</div> : null}
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-800">Mật khẩu</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={[
                'w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition',
                fieldError('password') ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-indigo-400',
              ].join(' ')}
              placeholder="••••••••"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {fieldError('password') ? <div className="mt-1 text-xs font-medium text-rose-700">{fieldError('password')}</div> : null}
          </label>

          {mode === 'register' ? (
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-slate-800">Nhập lại mật khẩu</div>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                className={[
                  'w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition',
                  fieldError('confirmPassword')
                    ? 'border-rose-300 focus:border-rose-400'
                    : 'border-slate-200 focus:border-indigo-400',
                ].join(' ')}
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
              />
              {fieldError('confirmPassword') ? (
                <div className="mt-1 text-xs font-medium text-rose-700">{fieldError('confirmPassword')}</div>
              ) : null}
            </label>
          ) : null}

          {mode === 'register' ? (
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={registerAdmin}
                  onChange={(e) => setRegisterAdmin(e.target.checked)}
                  className="h-4 w-4 accent-indigo-600"
                />
                Đăng ký quyền Quản trị
              </label>
              {registerAdmin ? (
                <label className="block">
                  <div className="mb-1 text-sm font-semibold text-slate-800">Secret Admin Key</div>
                  <input
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, adminKey: true }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
                    placeholder="admin123"
                  />
                  <div className="mt-1 text-xs text-slate-500">Mặc định để test: <span className="font-semibold text-slate-700">admin123</span></div>
                </label>
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>

          <div className="text-center text-xs text-slate-500">
            Demo auth dùng localStorage. Bạn có thể nối API thật sau.
          </div>
        </form>
      </div>

      <div className="text-center text-sm text-slate-600">
        <Link to="/" className="font-semibold text-indigo-700 hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  )
}

