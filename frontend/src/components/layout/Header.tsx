import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useCompare } from '../../contexts/CompareContext'
import { useTheme } from '../../contexts/ThemeContext'
import { clearAuthUser, getAuthUser, onAuthChange } from '../../services/auth'
import { mockBooks } from '../../services/api/mockData'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200',
  ].join(' ')

export function Header() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQ = useMemo(() => searchParams.get('q') ?? '', [searchParams])
  const [q, setQ] = useState(initialQ)
  const [user, setUser] = useState(() => getAuthUser())
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalQuantity } = useCart()
  const { count: favCount } = useWishlist()
  const { count: compareCount } = useCompare()
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const blurTimeoutRef = useRef<number | null>(null)
  const searchWrapRef = useRef<HTMLDivElement | null>(null)
  const { theme, toggleTheme } = useTheme()
  const debouncedQ = useDebouncedValue(q, 160)
  const suggestions = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase()
    if (!needle) return []
    return mockBooks
      .filter((b) => `${b.title ?? ''} ${b.author ?? ''}`.toLowerCase().includes(needle))
      .slice(0, 6)
  }, [debouncedQ])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next = q.trim()
    navigate(next ? `/books?q=${encodeURIComponent(next)}` : '/books')
    setMobileOpen(false)
  }

  useEffect(() => {
    const sync = () => setUser(getAuthUser())
    sync()
    return onAuthChange(sync)
  }, [])

  useEffect(() => {
    // Keep the search input in sync when navigating using links/back/forward.
    setQ(initialQ)
  }, [initialQ])

  useEffect(() => {
    // Close suggestions when clicking outside.
    function onDocMouseDown(e: MouseEvent) {
      const el = searchWrapRef.current
      if (!el) return
      if (el.contains(e.target as Node)) return
      setSearchOpen(false)
      setActiveIndex(-1)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  function logout() {
    clearAuthUser()
    setUser(null)
    navigate('/', { replace: true })
    setMobileOpen(false)
  }

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join('')
    : 'U'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-2">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
            S
          </span>
          <span>SachStore</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 md:hidden"
          aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3 1.42 1.42Z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
            </svg>
          )}
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Trang chủ
          </NavLink>
          <div className="group relative">
            <NavLink to="/books" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                Danh mục sách
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" aria-hidden="true">
                  <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                </svg>
              </span>
            </NavLink>
            <div className="pointer-events-none absolute left-0 top-full mt-2 w-[520px] opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="grid gap-4 md:grid-cols-2">
                  <MenuGroup
                    title="Văn học"
                    items={[
                      { label: 'Tiểu thuyết', to: '/books?categoryId=fiction' },
                      { label: 'Thiếu nhi', to: '/books?categoryId=kids' },
                    ]}
                  />
                  <MenuGroup
                    title="Phát triển bản thân"
                    items={[
                      { label: 'Kỹ năng', to: '/books?categoryId=self-help' },
                      { label: 'Kinh doanh', to: '/books?categoryId=business' },
                    ]}
                  />
                  <MenuGroup
                    title="Công nghệ"
                    items={[
                      { label: 'Lập trình', to: '/books?categoryId=tech' },
                      { label: 'Clean Code', to: '/books?q=clean%20code' },
                    ]}
                  />
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-4">
                    <div className="text-sm font-semibold text-slate-900">Gợi ý nhanh</div>
                    <p className="mt-1 text-xs text-slate-600">
                      Dùng lọc + sắp xếp để tìm đúng sách bạn cần.
                    </p>
                    <Link
                      to="/books"
                      className="mt-3 inline-flex rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Khám phá ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <NavLink to="/cart" className={navLinkClass}>
            <span className="inline-flex items-center gap-2">
              Giỏ hàng
              {totalQuantity > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              ) : null}
            </span>
          </NavLink>
        </nav>

        <div className="flex-1" />

        <button
          type="button"
          onClick={toggleTheme}
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:inline-flex"
          aria-label={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="currentColor" d="M12 3.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V4.5a1 1 0 0 1 1-1Zm7.78 4.72a1 1 0 0 1 0 1.42l-1.77 1.77a1 1 0 0 1-1.42-1.42l1.77-1.77a1 1 0 0 1 1.42 0ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8.28-6.78a1 1 0 0 1 1.42 0l1.77 1.77a1 1 0 1 1-1.42 1.42L4.72 11.64a1 1 0 0 1 0-1.42ZM17 12a1 1 0 0 1 1 1h2.5a1 1 0 1 1 0 2H18a1 1 0 1 1-1-1Zm-10 1a1 1 0 1 1-2 0h2a1 1 0 0 1 1-1Zm10.07 6.07a1 1 0 0 1-1.42 1.42l-1.77-1.77a1 1 0 1 1 1.42-1.42l1.77 1.77Zm-10.14 0l1.77-1.77a1 1 0 0 1 1.42 1.42l-1.77 1.77a1 1 0 1 1-1.42-1.42ZM12 17.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm5.03 2.52a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-7 3a1 1 0 1 1-2 0h2Zm13 0a1 1 0 1 1 2 0h-2Zm-8.97 4.97a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 0 1-1.42 1.42l-1.06-1.06a1 1 0 0 1 0-1.42ZM12 16.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-5.03-1.03l1.06 1.06a1 1 0 1 1-1.42 1.42L5.55 16.9a1 1 0 1 1 1.42-1.42Z"
              />
            </svg>
          )}
        </button>

        <form onSubmit={onSubmit} className="hidden lg:block">
          <div className="relative" ref={searchWrapRef}>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition focus-within:border-indigo-300">
            <span className="text-slate-400" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  fill="currentColor"
                  d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0-4.243-1.757A5.98 5.98 0 0 0 10 16Zm9.707 5.293-4.256-4.256 1.414-1.414 4.256 4.256-1.414 1.414Z"
                />
              </svg>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                if (blurTimeoutRef.current) window.clearTimeout(blurTimeoutRef.current)
                blurTimeoutRef.current = window.setTimeout(() => setSearchOpen(false), 120)
              }}
              onKeyDown={(e) => {
                if (!searchOpen) return
                if (e.key === 'Escape') {
                  setSearchOpen(false)
                  setActiveIndex(-1)
                  return
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActiveIndex((i) => Math.min(i + 1, Math.max(-1, suggestions.length - 1)))
                  return
                }
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveIndex((i) => Math.max(i - 1, -1))
                  return
                }
                if (e.key === 'Enter') {
                  // If suggestion highlighted, pick it instead of normal submit.
                  // (Still allows submitting search when no selection.)
                  if (activeIndex >= 0) {
                    e.preventDefault()
                    const picked = suggestions[activeIndex]
                    if (picked) {
                      setSearchOpen(false)
                      setQ('')
                      setActiveIndex(-1)
                      navigate(`/books/${picked.id}`)
                    }
                  }
                }
              }}
              placeholder="Tìm sách, tác giả..."
              className="w-80 bg-transparent text-sm outline-none placeholder:text-slate-400"
              aria-label="Tìm kiếm"
            />
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Tìm
            </button>
            </div>

            <SearchSuggestions
              open={searchOpen}
              items={suggestions}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              onPick={(id) => {
                setSearchOpen(false)
                setQ('')
                setActiveIndex(-1)
                navigate(`/books/${id}`)
              }}
            />
          </div>
        </form>

        <div className="hidden items-center gap-2 md:flex">
          <QuickIconButton
            label="Yêu thích"
            count={favCount}
            onClick={() => navigate('/wishlist')}
            iconPath="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
          <QuickIconButton
            label="So sánh"
            count={compareCount}
            onClick={() => navigate('/compare')}
            iconPath="M10 3H5a2 2 0 0 0-2 2v15h2V5h5V3Zm9 4h-5v2h5v12h-5v2h5a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM8 21h8v-2H8v2Zm0-4h8V5H8v12Zm2-2V7h4v8h-4Z"
          />
        </div>

        {user?.role === 'admin' ? (
          <Link
            to="/admin"
            className="hidden rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 md:inline-flex"
          >
            Vào quản trị
          </Link>
        ) : null}

        {user ? (
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              aria-label="Tài khoản"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden max-w-[160px] truncate sm:block">{user.name}</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" aria-hidden="true">
                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>

            <div className="pointer-events-none absolute right-0 top-full mt-2 w-64 opacity-0 transition group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <div className="px-3 py-2">
                  <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <div className="my-1 h-px bg-slate-100" />
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-left text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    Vào quản trị
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
                ].join(' ')
              }
            >
              Admin
            </NavLink>
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-200',
                ].join(' ')
              }
            >
              Đăng nhập
            </NavLink>
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
                ].join(' ')
              }
            >
              Đăng ký
            </NavLink>
          </div>
        )}
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto w-full max-w-6xl space-y-3 px-4 py-4">
            <form onSubmit={onSubmit}>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-300">
                <span className="text-slate-400" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0-4.243-1.757A5.98 5.98 0 0 0 10 16Zm9.707 5.293-4.256-4.256 1.414-1.414 4.256 4.256-1.414 1.414Z"
                    />
                  </svg>
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm sách, tác giả..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  aria-label="Tìm kiếm"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Tìm
                </button>
              </div>
            </form>

            <nav className="grid gap-2">
              <MobileLink to="/" onClick={() => setMobileOpen(false)}>
                Trang chủ
              </MobileLink>
              <MobileLink to="/books" onClick={() => setMobileOpen(false)}>
                Danh mục sách
              </MobileLink>
              <MobileLink to="/wishlist" onClick={() => setMobileOpen(false)}>
                <span className="inline-flex items-center justify-between gap-3">
                  Yêu thích
                  {favCount > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white">
                      {favCount > 99 ? '99+' : favCount}
                    </span>
                  ) : null}
                </span>
              </MobileLink>
              <MobileLink to="/compare" onClick={() => setMobileOpen(false)}>
                <span className="inline-flex items-center justify-between gap-3">
                  So sánh
                  {compareCount > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white">
                      {compareCount > 99 ? '99+' : compareCount}
                    </span>
                  ) : null}
                </span>
              </MobileLink>
              <MobileLink to="/cart" onClick={() => setMobileOpen(false)}>
                <span className="inline-flex items-center gap-2">
                  Giỏ hàng
                  {totalQuantity > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white">
                      {totalQuantity > 99 ? '99+' : totalQuantity}
                    </span>
                  ) : null}
                </span>
              </MobileLink>
              <MobileLink to="/admin" onClick={() => setMobileOpen(false)}>
                Admin
              </MobileLink>
            </nav>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                    <div className="truncate text-xs text-slate-500">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-800"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

function MobileLink({
  to,
  onClick,
  children,
}: {
  to: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
    >
      {children}
    </Link>
  )
}

function MenuGroup({
  title,
  items,
}: {
  title: string
  items: { label: string; to: string }[]
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="grid gap-1">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 hover:text-indigo-700"
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function QuickIconButton({
  label,
  count,
  onClick,
  iconPath,
}: {
  label: string
  count: number
  onClick: () => void
  iconPath: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d={iconPath} />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[11px] font-extrabold text-white">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  )
}

function SearchSuggestions({
  open,
  items,
  activeIndex,
  onActiveIndexChange,
  onPick,
}: {
  open: boolean
  items: { id: string | number; title: string; author?: string; coverUrl?: string }[]
  activeIndex: number
  onActiveIndexChange: (i: number) => void
  onPick: (id: string | number) => void
}) {
  if (!open) return null
  if (!items.length) return null

  return (
    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="p-2">
        <div className="space-y-1">
          {items.map((b, idx) => (
            <button
              key={String(b.id)}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => onActiveIndexChange(idx)}
              onClick={() => onPick(b.id)}
              className={[
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition',
                idx === activeIndex ? 'bg-slate-50' : 'hover:bg-slate-50',
              ].join(' ')}
            >
              <img
                src={b.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-S.jpg'}
                alt={b.title}
                className="h-10 w-8 flex-none rounded-lg object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-sm font-semibold text-slate-900">{b.title}</div>
                <div className="line-clamp-1 text-xs text-slate-500">{b.author ?? '—'}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

