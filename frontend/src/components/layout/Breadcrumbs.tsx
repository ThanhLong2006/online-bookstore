import { Link, useLocation } from 'react-router-dom'

const LABELS: Record<string, string> = {
  books: 'Sách',
  cart: 'Giỏ hàng',
  login: 'Đăng nhập',
  register: 'Đăng ký',
  admin: 'Quản trị',
}

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)

  const crumbs: { href: string; label: string }[] = [{ href: '/', label: 'Trang chủ' }]

  let acc = ''
  for (const p of parts) {
    acc += `/${p}`
    const label = LABELS[p] ?? decodeURIComponent(p)
    crumbs.push({ href: acc, label })
  }

  return (
    <div className="border-b border-slate-200 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto w-full max-w-[1230px] px-4 py-2">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
          {crumbs.map((c, idx) => {
            const isLast = idx === crumbs.length - 1
            return (
              <span key={c.href} className="inline-flex items-center gap-1.5">
                {idx > 0 ? <span className="text-slate-400">/</span> : null}
                {isLast ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{c.label}</span>
                ) : (
                  <Link to={c.href} className="hover:text-[#1A365D] hover:underline dark:hover:text-blue-400">
                    {c.label}
                  </Link>
                )}
              </span>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

