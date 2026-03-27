import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="text-4xl font-extrabold tracking-tight text-slate-900">404</div>
      <p className="text-sm text-slate-600">Trang không tồn tại.</p>
      <Link
        to="/"
        className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Về trang chủ
      </Link>
    </div>
  )
}

