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
      setTouched({ name: true, email: true, password: true, confirmPassword: true })
      if (Object.keys(registerErrors).length) return

      try {
        setSubmitting(true)
        const users = loadUsers()
        const exists = users.some((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase())
        if (exists) {
          toast.error('Email đã tồn tại. Vui lòng dùng email khác.')
          return
        }
        const isAdmin = name.trim().toLowerCase() === 'admin'
        const user: StoredUser = {
          name: name.trim(),
          email: email.trim(),
          password,
          role: isAdmin ? 'admin' : 'user',
        }
        saveUsers([user, ...users])
        toast.success(isAdmin ? 'Đăng ký thành công với quyền Quản trị!' : 'Đăng ký thành công!')
        setMode('login')
        setSuccessMessage(
          isAdmin
            ? 'Đăng ký thành công với quyền Quản trị. Vui lòng đăng nhập.'
            : 'Đăng ký thành công. Vui lòng đăng nhập.',
        )
        setPassword('')
        setConfirmPassword('')
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
      navigate(target, { replace: true, state: { from: location.pathname } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-amber-200 bg-white p-6 sm:p-8 shadow-xl">
      {/* Centered Brand Logo */}
      <div className="flex flex-col items-center justify-center space-y-2 mb-6">
        <Link to="/" className="flex flex-col items-center gap-2">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white text-lg font-extrabold shadow-md"
            style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}>
            S
          </span>
          <span className="text-xl font-black tracking-tight text-stone-850">SachStore</span>
        </Link>
      </div>

      {/* Tab Selection */}
      <div className="flex items-center gap-2 rounded-2xl bg-amber-50/60 p-1 border border-amber-100 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setSuccessMessage(null)
          }}
          className={[
            'flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200',
            mode === 'login' ? 'bg-white text-amber-900 shadow-sm border border-amber-250/20' : 'text-stone-500 hover:text-stone-900',
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
            'flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200',
            mode === 'register' ? 'bg-white text-amber-900 shadow-sm border border-amber-250/20' : 'text-stone-500 hover:text-stone-900',
          ].join(' ')}
        >
          Đăng ký
        </button>
      </div>

      {successMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950 mb-4">
          {successMessage}
        </div>
      ) : null}

      {/* Form fields */}
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'register' ? (
          <label className="block">
            <div className="mb-1.5 text-xs font-bold text-stone-700">Tên người dùng</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className={[
                'w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs outline-none transition-all duration-200 focus:ring-1 focus:ring-amber-250/30',
                fieldError('name') ? 'border-rose-300 focus:border-rose-450' : 'border-stone-200 focus:border-amber-500',
              ].join(' ')}
              placeholder="Nguyễn Văn A"
              autoComplete="name"
            />
            {fieldError('name') ? <div className="mt-1 text-[10px] font-semibold text-rose-700">{fieldError('name')}</div> : null}
          </label>
        ) : null}

        <label className="block">
          <div className="mb-1.5 text-xs font-bold text-stone-700">Địa chỉ Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={[
              'w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs outline-none transition-all duration-200 focus:ring-1 focus:ring-amber-250/30',
              fieldError('email') ? 'border-rose-300 focus:border-rose-450' : 'border-stone-200 focus:border-amber-500',
            ].join(' ')}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {fieldError('email') ? <div className="mt-1 text-[10px] font-semibold text-rose-700">{fieldError('email')}</div> : null}
        </label>

        <label className="block">
          <div className="mb-1.5 text-xs font-bold text-stone-700">Mật khẩu</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            className={[
              'w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs outline-none transition-all duration-200 focus:ring-1 focus:ring-amber-250/30',
              fieldError('password') ? 'border-rose-300 focus:border-rose-450' : 'border-stone-200 focus:border-amber-500',
            ].join(' ')}
            placeholder="••••••••"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {fieldError('password') ? <div className="mt-1 text-[10px] font-semibold text-rose-700">{fieldError('password')}</div> : null}
        </label>

        {mode === 'register' ? (
          <label className="block">
            <div className="mb-1.5 text-xs font-bold text-stone-700">Nhập lại mật khẩu</div>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
              className={[
                'w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs outline-none transition-all duration-200 focus:ring-1 focus:ring-amber-250/30',
                fieldError('confirmPassword')
                  ? 'border-rose-300 focus:border-rose-450'
                  : 'border-stone-200 focus:border-amber-500',
              ].join(' ')}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
            />
            {fieldError('confirmPassword') ? (
              <div className="mt-1 text-[10px] font-semibold text-rose-700">{fieldError('confirmPassword')}</div>
            ) : null}
          </label>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 mt-4"
          style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}
        >
          {submitting ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs">
        <Link to="/" className="font-semibold text-amber-800 hover:text-amber-900 hover:underline">
          ← Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}
