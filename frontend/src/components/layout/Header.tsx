import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { clearAuthUser, getAuthUser, onAuthChange } from '../../services/auth'
import { mockBooks } from '../../services/api/mockData'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-semibold transition-all duration-150',
    isActive
      ? 'bg-[#1A365D]/10 text-[#1A365D] dark:bg-blue-500/20 dark:text-blue-450'
      : 'text-slate-650 hover:bg-slate-100 hover:text-slate-905 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const blurTimeoutRef = useRef<number | null>(null)
  const searchWrapRef = useRef<HTMLDivElement | null>(null)
  const debouncedQ = useDebouncedValue(q, 160)

  const [unreadNotifications, setUnreadNotifications] = useState(() => {
    const raw = localStorage.getItem('qls_notifications')
    if (raw) {
      try {
        const list = JSON.parse(raw)
        return Array.isArray(list) ? list.filter((n: any) => !n.read).length : 2
      } catch {}
    }
    return 2 // Default unread count matching INITIAL_NOTIFICATIONS
  })

  useEffect(() => {
    const handler = () => {
      const raw = localStorage.getItem('qls_notifications')
      if (raw) {
        try {
          const list = JSON.parse(raw)
          if (Array.isArray(list)) {
            setUnreadNotifications(list.filter((n: any) => !n.read).length)
          }
        } catch {}
      }
    }
    window.addEventListener('qls_notifications_change', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('qls_notifications_change', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])


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

  useEffect(() => { setQ(initialQ) }, [initialQ])

  useEffect(() => {
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
    ? user.name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('')
    : 'U'

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#E6E6E6] bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-full w-full max-w-[1230px] items-center justify-between gap-4 px-4">
        
        {/* Left: Logo and Hamburg/Menu */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Mobile menu button (Touch Target 40px) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E6E6E6] bg-white text-slate-700 transition hover:bg-slate-50 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-350"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3 1.42 1.42Z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" /></svg>
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-800 dark:text-white shrink-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white text-base font-extrabold shadow-md"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
              S
            </span>
            <span className="text-lg font-black tracking-tight hidden sm:block text-[#212121] dark:text-white">SachStore</span>
          </Link>

          {/* Desktop Nav links (Touch Target 40px) */}
          <nav className="hidden items-center gap-1.5 md:flex">
            <NavLink to="/" className={navLinkClass} end>Trang chủ</NavLink>

            {/* Danh mục dropdown */}
            <div className="group relative">
              <NavLink to="/books" className={navLinkClass}>
                <span className="inline-flex items-center gap-1">
                  Danh mục sách
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-400 transition group-hover:rotate-180 duration-200">
                    <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                  </svg>
                </span>
              </NavLink>
              <div className="pointer-events-none absolute left-0 top-full mt-2 w-[700px] opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100" style={{ zIndex: 100 }}>
                <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="grid gap-6 grid-cols-12">
                    <div className="col-span-8 grid grid-cols-3 gap-6">
                      <MenuGroup title="Văn học" items={[
                        {
                          label: 'Tiểu thuyết',
                          to: '/books?categoryId=fiction',
                          icon: (
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5a2.5 2.5 0 0 1-2.5-2.5z"/></svg>
                          )
                        },
                        {
                          label: 'Thiếu nhi',
                          to: '/books?categoryId=kids',
                          icon: (
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
                          )
                        },
                      ]} />
                      <MenuGroup title="Phát triển" items={[
                        {
                          label: 'Kinh doanh',
                          to: '/books?categoryId=business',
                          icon: (
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                          )
                        },
                        {
                          label: 'Kỹ năng sống',
                          to: '/books?categoryId=self-help',
                          icon: (
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                          )
                        },
                      ]} />
                      <MenuGroup title="Công nghệ" items={[
                        {
                          label: 'Lập trình',
                          to: '/books?categoryId=tech',
                          icon: (
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                          )
                        },
                        {
                          label: 'Clean Code',
                          to: '/books?q=clean%20code',
                          icon: (
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          )
                        },
                      ]} />
                    </div>
                    <div className="col-span-4 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #F0F4F8, #FFFFFF)' }}>
                      <div className="absolute right-0 top-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-blue-100/30 blur-xl pointer-events-none" />
                      <div className="space-y-2 relative z-10">
                        <span className="inline-block rounded-full bg-[#1A365D]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#1A365D] border border-[#1A365D]/20 uppercase tracking-wide">
                          Gợi ý hôm nay
                        </span>
                        <h3 className="text-sm font-bold text-stone-900 leading-snug">
                          Khám phá vũ trụ tri thức tinh tuyển
                        </h3>
                        <p className="text-[11px] text-stone-500 leading-relaxed font-normal">
                          Tuyển chọn sách chính hãng từ các NXB uy tín, hỗ trợ bọc sách miễn phí và giao hàng 2h.
                        </p>
                      </div>
                      <Link to="/books" className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 hover:shadow-md relative z-10 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
                        Xem tất cả sách →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NavLink to="/news" className={navLinkClass}>Tin tức</NavLink>
          </nav>
        </div>

        {/* Center: Search Bar (height 40px, rounded 8px) */}
        <div className="flex-1 max-w-lg hidden md:block">
          <form onSubmit={onSubmit}>
            <div className="relative" ref={searchWrapRef}>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-[#E6E6E6] bg-[#F7F9FA] px-3 focus-within:border-[#1A365D] focus-within:bg-white transition-all dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-blue-500">
                <span className="text-slate-450">
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path fill="currentColor" d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0-4.243-1.757A5.98 5.98 0 0 0 10 16Zm9.707 5.293-4.256-4.256 1.414-1.414 4.256 4.256-1.414 1.414Z" />
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
                  placeholder="Tìm kiếm tựa sách, tác giả, thể loại..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-800 dark:text-slate-100"
                />
                <button type="submit"
                  className="rounded-md px-3.5 h-7.5 text-xs font-bold text-white transition hover:opacity-90 flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
                  Tìm
                </button>
              </div>
              <SearchSuggestions
                open={searchOpen}
                items={suggestions}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
                onPick={(id: any) => { setSearchOpen(false); setQ(''); navigate(`/books/${id}`) }}
              />
            </div>
          </form>
        </div>

        {/* Right: Cart, Account & Icons (Touch Target 40px) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications icon */}
          <button type="button" onClick={() => navigate('/notifications')}
            aria-label="Thông báo" title="Thông báo"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#E6E6E6] bg-white text-slate-655 transition hover:bg-slate-50 hover:text-[#1A365D] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            {unreadNotifications > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-extrabold text-white bg-rose-500">
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
          </button>

          {/* Wishlist icon */}
          <button type="button" onClick={() => navigate('/wishlist')}
            aria-label="Yêu thích" title="Yêu thích"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#E6E6E6] bg-white text-slate-655 transition hover:bg-slate-50 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {favCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-extrabold text-white">
                {favCount > 99 ? '99+' : favCount}
              </span>
            )}
          </button>

          {/* Cart icon */}
          <button type="button" onClick={() => navigate('/cart')}
            aria-label="Giỏ hàng" title="Giỏ hàng"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#E6E6E6] bg-white text-slate-655 transition hover:bg-slate-50 hover:text-[#1A365D] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h11c1.1 0 2-.9 2-2s-.9-2-2-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-extrabold text-white bg-[#C2410C]">
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </span>
            )}
          </button>

          {/* User area (Touch Target 40px) */}
          {user ? (
            <div className="group relative">
              <button type="button"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E6E6E6] bg-white px-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-6 w-6 rounded-full object-cover shrink-0 border border-slate-200" />
                ) : (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
                    {initials}
                  </span>
                )}
                <span className="hidden max-w-[80px] truncate sm:block text-xs">{user.name}</span>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-400"><path fill="currentColor" d="M7 10l5 5 5-5H7z" /></svg>
              </button>

              {/* Dropdown menu */}
              <div className="pointer-events-none absolute right-0 top-full mt-2 w-56 opacity-0 transition-all duration-150 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100" style={{ zIndex: 100 }}>
                <div className="rounded-2xl border border-[#E6E6E6] bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700 mb-1">
                    <div className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-stone-500 dark:text-slate-400 truncate">{user.email}</div>
                  </div>

                  {user.role === 'admin' ? (
                    <>
                      <Link to="/admin/profile" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-[#1A365D]/5 dark:text-slate-300 dark:hover:bg-slate-700 transition">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1A365D]"><path fill="currentColor" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
                        Thông tin Admin
                      </Link>
                      <Link to="/admin" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold text-[#1A365D] hover:bg-[#1A365D]/5 dark:text-blue-400 dark:hover:bg-slate-700 transition">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1A365D]"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
                        Bảng điều khiển
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-[#1A365D]/5 dark:text-slate-300 dark:hover:bg-slate-700 transition">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1A365D]"><path fill="currentColor" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
                        Thông tin cá nhân
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-[#1A365D]/5 dark:text-slate-300 dark:hover:bg-slate-700 transition">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-500"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        Sách yêu thích
                      </Link>
                      <Link to="/cart" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-[#1A365D]/5 dark:text-slate-300 dark:hover:bg-slate-700 transition">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1A365D]"><path fill="currentColor" d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45C5.1 14.32 5 14.65 5 15c0 1.1.9 2 2 2h11v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 2H1z" /></svg>
                        Giỏ hàng
                      </Link>
                      <Link to="/notifications" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-[#1A365D]/5 dark:text-slate-300 dark:hover:bg-slate-700 transition">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1A365D]"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                        Thông báo
                      </Link>
                    </>
                  )}

                  <div className="my-1 h-px bg-slate-100 dark:bg-slate-750" />
                  <button type="button" onClick={logout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition">
                    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <NavLink to="/login"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E6E6E6] bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Đăng nhập
              </NavLink>
              <NavLink to="/register"
                className="inline-flex h-10 items-center justify-center rounded-lg px-3 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search / menu overlay */}
      {mobileOpen && (
        <div className="border-t border-[#E6E6E6] bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="mx-auto w-full max-w-[1230px] space-y-4 px-4 py-4">
            <form onSubmit={onSubmit}>
              <div className="flex h-10 items-center gap-2 rounded-lg border border-[#E6E6E6] bg-[#F7F9FA] px-3 dark:border-slate-700 dark:bg-slate-850">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm tựa sách, tác giả, thể loại..." className="w-full bg-transparent text-sm outline-none text-slate-800 dark:text-slate-100" />
                <button type="submit"
                  className="rounded-md px-3.5 h-7.5 text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
                  Tìm
                </button>
              </div>
            </form>
            <nav className="grid grid-cols-2 gap-2">
              <MobileLink to="/" onClick={() => setMobileOpen(false)}>🏠 Trang chủ</MobileLink>
              <MobileLink to="/books" onClick={() => setMobileOpen(false)}>📚 Danh mục sách</MobileLink>
              <MobileLink to="/wishlist" onClick={() => setMobileOpen(false)}>❤️ Yêu thích</MobileLink>
              <MobileLink to="/cart" onClick={() => setMobileOpen(false)}>🛒 Giỏ hàng</MobileLink>
              <MobileLink to="/news" onClick={() => setMobileOpen(false)}>📰 Tin tức</MobileLink>
              <MobileLink to="/notifications" onClick={() => setMobileOpen(false)}>🔔 Thông báo</MobileLink>
              {user && <MobileLink to="/profile" onClick={() => setMobileOpen(false)}>👤 Tài khoản</MobileLink>}
              {!user && <MobileLink to="/login" onClick={() => setMobileOpen(false)}>🔑 Đăng nhập</MobileLink>}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

function MobileLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick}
      className="inline-flex items-center justify-center h-10 rounded-lg border border-[#E6E6E6] bg-[#F7F9FA] px-3 text-xs font-semibold text-slate-805 hover:bg-slate-100 transition text-center dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200">
      {children}
    </Link>
  )
}

function MenuGroup({ title, items }: { title: string; items: { label: string; to: string; icon: React.ReactNode }[] }) {
  return (
    <div className="space-y-2.5">
      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A365D] border-b border-[#E6E6E6] pb-1.5 mb-1 dark:text-blue-400 dark:border-slate-700">{title}</div>
      <div className="grid gap-0.5">
        {items.map((it) => (
          <Link key={it.to} to={it.to}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-stone-705 hover:bg-[#1A365D]/5 hover:text-[#1A365D] dark:text-slate-350 dark:hover:bg-slate-750 dark:hover:text-blue-400 transition-all duration-200 hover:translate-x-1">
            <span className="shrink-0 text-[#1A365D]/60 dark:text-blue-400/60">{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SearchSuggestions({ open, items, activeIndex, onActiveIndexChange, onPick }: {
  open: boolean; items: any[]; activeIndex: number; onActiveIndexChange: (index: number) => void; onPick: (id: any) => void
}) {
  if (!open || !items.length) return null
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white shadow-2xl dark:border-slate-705 dark:bg-slate-800">
      <div className="p-2 space-y-0.5">
        {items.map((b: any, idx: number) => (
          <button key={String(b.id)} type="button"
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => onActiveIndexChange(idx)}
            onClick={() => onPick(b.id)}
            className={['flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition',
              idx === activeIndex ? 'bg-slate-100 dark:bg-slate-750' : 'hover:bg-slate-50 dark:hover:bg-slate-750/50'].join(' ')}>
            <img src={b.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-S.jpg'}
              alt={b.title} className="h-10 w-8 flex-none rounded-lg object-cover shadow-sm" />
            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">{b.title}</div>
              <div className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{b.author ?? '—'}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}