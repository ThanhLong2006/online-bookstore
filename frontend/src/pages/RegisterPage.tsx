import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

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

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') ?? ''

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

  function fieldError(key: string) {
    if (!touched[key]) return null
    return (registerErrors as any)[key] ?? null
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
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
      toast.success(isAdmin ? 'Đăng ký thành công với quyền Quản trị!' : 'Đăng ký tài khoản thành công!')
      navigate(`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`)
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
            style={{ background: 'linear-gradient(135deg, #C2410C, #E05A16)' }}>
            S
          </Link>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Tạo tài khoản mới</h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Tham gia SachStore để nhận ngàn ưu đãi hấp dẫn</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-505 dark:text-slate-400 mb-1">Tên hiển thị</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              placeholder="Nguyễn Văn A"
              disabled={submitting}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-amber-100 dark:bg-slate-950 dark:text-slate-100 ${
                fieldError('name')
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 focus:border-amber-400 dark:border-slate-700'
              }`}
            />
            {fieldError('name') && (
              <p className="mt-1 text-xs text-rose-550 font-semibold">{fieldError('name')}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-505 dark:text-slate-400 mb-1">Địa chỉ Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              placeholder="example@gmail.com"
              disabled={submitting}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-amber-100 dark:bg-slate-955 dark:text-slate-100 ${
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
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-505 dark:text-slate-400 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              placeholder="Tối thiểu 6 ký tự"
              disabled={submitting}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-amber-100 dark:bg-slate-955 dark:text-slate-100 ${
                fieldError('password')
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 focus:border-amber-400 dark:border-slate-700'
              }`}
            />
            {fieldError('password') && (
              <p className="mt-1 text-xs text-rose-550 font-semibold">{fieldError('password')}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-505 dark:text-slate-400 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
              placeholder="Nhập lại mật khẩu"
              disabled={submitting}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-amber-100 dark:bg-slate-955 dark:text-slate-100 ${
                fieldError('confirmPassword')
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 focus:border-amber-400 dark:border-slate-700'
              }`}
            />
            {fieldError('confirmPassword') && (
              <p className="mt-1 text-xs text-rose-550 font-semibold">{fieldError('confirmPassword')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #C2410C, #E05A16)' }}
          >
            {submitting ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
          </button>
        </form>

        {/* Separator / Footer Links */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Đã có tài khoản?{' '}
            <Link to={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-bold text-[#C2410C] hover:underline dark:text-amber-500">
              Đăng nhập ngay
            </Link>
          </p>
          <div>
            <Link to="/" className="text-xs font-semibold text-slate-450 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-300">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
