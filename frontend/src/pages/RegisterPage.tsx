import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>>

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function validate(values: {
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

export function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const errors = useMemo(
    () => validate({ name, email, password, confirmPassword }),
    [name, email, password, confirmPassword],
  )

  const canSubmit = Object.keys(errors).length === 0 && !!name.trim() && !!email.trim() && !!password

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    setSubmitError(null)

    const nextErrors = validate({ name, email, password, confirmPassword })
    if (Object.keys(nextErrors).length) return

    try {
      setSubmitting(true)
      // Client-only demo: save "user" to localStorage so Header can show avatar later.
      const user = { name: name.trim(), email: email.trim() }
      localStorage.setItem('qls_user', JSON.stringify(user))
      navigate('/', { replace: true })
    } catch (err) {
      setSubmitError('Đăng ký không thành công. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  function fieldError(key: keyof FieldErrors) {
    if (!touched[key]) return null
    return errors[key] ?? null
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tạo tài khoản</h1>
        <p className="text-sm text-slate-600">Đăng ký nhanh để lưu giỏ hàng và theo dõi đơn.</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        {submitError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
            {submitError}
          </div>
        ) : null}

        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-800">Tên</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            className={[
              'w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition',
              fieldError('name')
                ? 'border-rose-300 focus:border-rose-400'
                : 'border-slate-200 focus:border-indigo-400',
            ].join(' ')}
            placeholder="Nguyễn Văn A"
            autoComplete="name"
          />
          {fieldError('name') ? (
            <div className="mt-1 text-xs font-medium text-rose-700">{fieldError('name')}</div>
          ) : null}
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-semibold text-slate-800">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={[
              'w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition',
              fieldError('email')
                ? 'border-rose-300 focus:border-rose-400'
                : 'border-slate-200 focus:border-indigo-400',
            ].join(' ')}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {fieldError('email') ? (
            <div className="mt-1 text-xs font-medium text-rose-700">{fieldError('email')}</div>
          ) : null}
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-sm font-semibold text-slate-800">Mật khẩu</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={[
                'w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition',
                fieldError('password')
                  ? 'border-rose-300 focus:border-rose-400'
                  : 'border-slate-200 focus:border-indigo-400',
              ].join(' ')}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
            />
            {fieldError('password') ? (
              <div className="mt-1 text-xs font-medium text-rose-700">
                {fieldError('password')}
              </div>
            ) : (
              <div className="mt-1 text-xs text-slate-500">Tối thiểu 6 ký tự.</div>
            )}
          </label>

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
              <div className="mt-1 text-xs font-medium text-rose-700">
                {fieldError('confirmPassword')}
              </div>
            ) : null}
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Đang tạo tài khoản…' : 'Đăng ký'}
        </button>

        <div className="text-center text-sm text-slate-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-indigo-700 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50 p-4 text-sm text-slate-700">
        <div className="font-semibold text-slate-900">Ghi chú</div>
        <p className="mt-1 text-slate-600">
          Trang này hiện lưu user demo vào <code className="rounded bg-white px-1.5 py-0.5">localStorage</code>{' '}
          để hiển thị trạng thái đăng nhập ở Header.
        </p>
      </div>
    </div>
  )
}

