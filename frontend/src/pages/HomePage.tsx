import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BookCard } from '../components/books/BookCard'
import { HomeSidebar } from '../components/home/Sidebar'
import { mockBooks, mockGetHomeSections } from '../services/api/mockData'
import { formatVND } from '../utils/format'
import type { Book } from '../types/book'

export function HomePage() {
  const home = useMemo(() => mockGetHomeSections(), [])
  const [bannerIndex, setBannerIndex] = useState(0)
  const banners = home.banners

  // Books for Shopping Trends (Xu hướng mua sắm)
  const trendingFictions = useMemo(() => mockBooks.filter(b => b.category?.id === 'fiction').slice(0, 2), [])
  const trendingTech = useMemo(() => mockBooks.filter(b => b.category?.id === 'tech').slice(0, 2), [])
  const trendingSkills = useMemo(() => mockBooks.filter(b => b.category?.id === 'self-help').slice(0, 2), [])
  const trendingBusiness = useMemo(() => mockBooks.filter(b => b.category?.id === 'business').slice(0, 2), [])

  // Books for Curated Bookshelves (Tủ sách nổi bật)
  const shelfBusiness = useMemo(() => mockBooks.filter(b => b.category?.id === 'business').slice(0, 4), [])
  const shelfTech = useMemo(() => mockBooks.filter(b => b.category?.id === 'tech').slice(0, 4), [])
  const shelfFiction = useMemo(() => mockBooks.filter(b => b.category?.id === 'fiction').slice(2, 6), [])

  // Auto-scroll main slider
  useEffect(() => {
    if (!banners.length) return
    const id = window.setInterval(() => setBannerIndex((i) => (i + 1) % banners.length), 4500)
    return () => window.clearInterval(id)
  }, [banners.length])

  const activeBanner = banners[bannerIndex]

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 })
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 2, minutes: 0, seconds: 0 } // Reset for demo
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      {/* 1. HERO AREA: Main Slider Banner (2/3) + 2 Stacked Sub Banners (1/3) - Height aligned at 360px */}
      <section className="grid gap-4 lg:grid-cols-12 lg:h-[360px]">
        {/* Main Carousel */}
        <div className="lg:col-span-8 overflow-hidden rounded-xl border border-[#E6E6E6] bg-white shadow-sm dark:border-slate-800 relative h-[250px] sm:h-[300px] lg:h-full">
          <div className="relative h-full">
            {activeBanner ? (
              <Link to={activeBanner.href} className="group block h-full">
                <div className="relative w-full h-full overflow-hidden bg-slate-100">
                  <img
                    src={activeBanner.imageUrl}
                    alt={activeBanner.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1A365D]/90 via-[#1A365D]/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-lg p-6 sm:p-10">
                      <div className="inline-flex rounded bg-[#C2410C] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                        SachStore Picks
                      </div>
                      <div className="mt-3 text-xl font-black tracking-tight text-white sm:text-3.5xl leading-tight">
                        {activeBanner.title}
                      </div>
                      <p className="mt-2 text-xs sm:text-base text-white/90 font-medium">{activeBanner.subtitle}</p>
                      <div className="mt-5 inline-flex items-center gap-1.5 rounded bg-white px-5 py-2.5 text-xs font-bold text-[#1A365D] transition shadow-md hover:bg-slate-50">
                        Xem ngay →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-20">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBannerIndex(i)}
                  className={[
                    'h-1.5 rounded-full transition-all duration-300',
                    i === bannerIndex ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/70 hover:bg-white',
                  ].join(' ')}
                  aria-label={`Banner ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stacked Sub Banners - Resized taller to match slider height precisely */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-[250px] sm:h-[300px] lg:h-full">
          <Link to="/books?categoryId=fiction" className="group relative flex-1 overflow-hidden rounded-xl border border-[#E6E6E6] dark:border-slate-800 shadow-sm flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80" 
              alt="Promo 1" 
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#C2410C]/90 via-[#C2410C]/65 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5 z-10 text-white w-2/3">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-orange-250">Xả kho cuối mùa</span>
              <h4 className="mt-1 text-sm font-black leading-tight sm:text-base">SÁCH ĐỒNG GIÁ 19K - 29K - 49K</h4>
              <span className="mt-2 text-[10px] font-bold underline group-hover:translate-x-1 transition-transform inline-flex items-center">Mua ngay →</span>
            </div>
          </Link>

          <Link to="/books?categoryId=tech" className="group relative flex-1 overflow-hidden rounded-xl border border-[#E6E6E6] dark:border-slate-800 shadow-sm flex items-center">
            <img 
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80" 
              alt="Promo 2" 
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A365D]/95 via-[#1A365D]/75 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5 z-10 text-white w-2/3">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-250">Dành cho Developer</span>
              <h4 className="mt-1 text-sm font-black leading-tight sm:text-base">LẬP TRÌNH & CÔNG NGHỆ GIẢM 40%</h4>
              <span className="mt-2 text-[10px] font-bold underline group-hover:translate-x-1 transition-transform inline-flex items-center">Mua ngay →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 2. CORE COMMITMENTS SECTION */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            ),
            title: 'Chính hãng 100%',
            desc: 'Hợp tác trực tiếp với các NXB uy tín. Cam kết sách in chính thức chất lượng cao.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            ),
            title: 'Giao nhanh hỏa tốc',
            desc: 'Đóng gói chống va đập, bảo vệ mép sách. Giao nhanh 2h tại các thành phố lớn.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            ),
            title: 'Thanh toán an toàn',
            desc: 'Hỗ trợ đa dạng cổng MoMo, ZaloPay, thẻ ATM/Visa. Bảo mật tuyệt đối.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            ),
            title: 'Hỗ trợ tận tâm 24/7',
            desc: 'Đội ngũ hỗ trợ am hiểu sách luôn nhiệt tình phục vụ và tiếp thu mọi phản hồi.'
          }
        ].map((s, idx) => (
          <div key={idx} className="flex gap-3.5 rounded-lg border border-[#E6E6E6] bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition duration-200">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#1A365D] bg-[#1A365D]/5 dark:text-blue-400 dark:bg-blue-400/10 border border-[#1A365D]/10">
              {s.icon}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-tight uppercase">{s.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. RICH CATEGORY GRID */}
      <section className="rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-sm font-extrabold uppercase tracking-wide text-slate-900 dark:text-slate-100">Danh mục nổi bật</div>
            <div className="text-xs text-slate-500">Tìm sách nhanh theo chủ đề yêu thích</div>
          </div>
          <Link to="/books" className="text-xs font-bold text-[#1A365D] hover:underline dark:text-blue-400">
            Tất cả danh mục →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {[
            { id: 'fiction', name: 'Văn Học', bg: 'from-rose-500/10 to-rose-500/5', border: 'border-rose-200/40', text: 'text-rose-700 dark:text-rose-400', icon: '📚' },
            { id: 'kids', name: 'Thiếu Nhi', bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-200/40', text: 'text-emerald-700 dark:text-emerald-400', icon: '🧸' },
            { id: 'business', name: 'Kinh Doanh', bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-200/40', text: 'text-amber-700 dark:text-amber-400', icon: '📈' },
            { id: 'self-help', name: 'Kỹ Năng', bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-200/40', text: 'text-purple-700 dark:text-purple-400', icon: '🧠' },
            { id: 'tech', name: 'Công Nghệ', bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-200/40', text: 'text-blue-700 dark:text-blue-400', icon: '💻' },
            { id: 'foreign', name: 'Ngoại Văn', bg: 'from-teal-500/10 to-teal-500/5', border: 'border-teal-200/40', text: 'text-teal-700 dark:text-teal-400', icon: '🌍' },
            { id: 'comics', name: 'Manga / Comic', bg: 'from-pink-500/10 to-pink-500/5', border: 'border-pink-200/40', text: 'text-pink-700 dark:text-pink-400', icon: '💥' },
            { id: 'education', name: 'Giáo Khoa', bg: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-200/40', text: 'text-cyan-700 dark:text-cyan-400', icon: '✏️' },
          ].map((c) => (
            <Link
              key={c.id}
              to={`/books?categoryId=${c.id}`}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border ${c.border} bg-gradient-to-b ${c.bg} transition hover:scale-[1.03] hover:shadow-sm`}
            >
              <HomeCategoryIcon id={c.id} emoji={c.icon} name={c.name} />
              <span className={`text-xs font-bold ${c.text} text-center`}>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. XU HƯỚNG MUA SẮM (Shopping Trends Section - 4 blocks displaying hot categories with book thumbnails) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#212121] dark:text-[#F8FAFC]">📈 Xu Hướng Mua Sắm</h2>
            <p className="text-xs text-slate-500">Cập nhật chủ đề đang thu hút độc giả quan tâm nhiều nhất trong tuần</p>
          </div>
          <Link to="/trends" className="text-xs font-bold text-[#1A365D] hover:text-[#2B6CB0] dark:text-blue-400">
            Xem tất cả →
          </Link>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Văn học */}
          <div className="rounded-xl border border-[#E6E6E6] bg-gradient-to-br from-rose-500/5 to-rose-600/10 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex justify-between items-center group">
            <div className="space-y-2.5">
              <span className="inline-block rounded bg-rose-500/15 px-2 py-0.5 text-[9px] font-black text-rose-700 dark:text-rose-350 tracking-wider">XU HƯỚNG +180%</span>
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205">Sách Văn Học</h3>
              <Link to="/trends?categoryId=fiction" className="inline-block text-xs font-bold text-[#1A365D] hover:underline dark:text-blue-400">Xem ngay →</Link>
            </div>
            <div className="flex -space-x-4 shrink-0 transition group-hover:translate-x-1 duration-200">
              {trendingFictions.map((b) => (
                <img key={b.id} src={b.coverUrl} alt={b.title} className="h-16 w-11 object-cover rounded shadow-md border border-white dark:border-slate-800 shrink-0 bg-white" />
              ))}
            </div>
          </div>

          {/* Card 2: Công nghệ */}
          <div className="rounded-xl border border-[#E6E6E6] bg-gradient-to-br from-blue-500/5 to-blue-600/10 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex justify-between items-center group">
            <div className="space-y-2.5">
              <span className="inline-block rounded bg-blue-500/15 px-2 py-0.5 text-[9px] font-black text-blue-700 dark:text-blue-355 tracking-wider">DEVELOPER HOT</span>
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205">Công Nghệ & AI</h3>
              <Link to="/trends?categoryId=tech" className="inline-block text-xs font-bold text-[#1A365D] hover:underline dark:text-blue-400">Xem ngay →</Link>
            </div>
            <div className="flex -space-x-4 shrink-0 transition group-hover:translate-x-1 duration-200">
              {trendingTech.map((b) => (
                <img key={b.id} src={b.coverUrl} alt={b.title} className="h-16 w-11 object-cover rounded shadow-md border border-white dark:border-slate-800 shrink-0 bg-white" />
              ))}
            </div>
          </div>

          {/* Card 3: Kỹ năng */}
          <div className="rounded-xl border border-[#E6E6E6] bg-gradient-to-br from-purple-500/5 to-purple-600/10 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex justify-between items-center group">
            <div className="space-y-2.5">
              <span className="inline-block rounded bg-purple-500/15 px-2 py-0.5 text-[9px] font-black text-purple-700 dark:text-purple-355 tracking-wider">ĐỌC NHIỀU NHẤT</span>
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205">Tư Duy & Kỹ Năng</h3>
              <Link to="/trends?categoryId=self-help" className="inline-block text-xs font-bold text-[#1A365D] hover:underline dark:text-blue-400">Xem ngay →</Link>
            </div>
            <div className="flex -space-x-4 shrink-0 transition group-hover:translate-x-1 duration-200">
              {trendingSkills.map((b) => (
                <img key={b.id} src={b.coverUrl} alt={b.title} className="h-16 w-11 object-cover rounded shadow-md border border-white dark:border-slate-800 shrink-0 bg-white" />
              ))}
            </div>
          </div>

          {/* Card 4: Kinh doanh */}
          <div className="rounded-xl border border-[#E6E6E6] bg-gradient-to-br from-amber-500/5 to-amber-600/10 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex justify-between items-center group">
            <div className="space-y-2.5">
              <span className="inline-block rounded bg-amber-500/15 px-2 py-0.5 text-[9px] font-black text-amber-700 dark:text-amber-350 tracking-wider">TĂNG TRƯỞNG CAO</span>
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-205">Quản Trị Kinh Doanh</h3>
              <Link to="/trends?categoryId=business" className="inline-block text-xs font-bold text-[#1A365D] hover:underline dark:text-blue-400">Xem ngay →</Link>
            </div>
            <div className="flex -space-x-4 shrink-0 transition group-hover:translate-x-1 duration-200">
              {trendingBusiness.map((b) => (
                <img key={b.id} src={b.coverUrl} alt={b.title} className="h-16 w-11 object-cover rounded shadow-md border border-white dark:border-slate-800 shrink-0 bg-white" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLASH SALE WITH COUNTDOWN AND PROGRESS BARS */}
      <section className="space-y-3 rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black tracking-tight text-[#212121] dark:text-[#F8FAFC]">⚡ Flash Sale Giờ Vàng</h2>
            <div className="flex items-center gap-1 text-[11px] font-bold text-white bg-slate-900 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              <span className="bg-[#C2410C] px-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-[#C2410C] px-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-[#C2410C] px-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
          <Link to="/books?sort=price_desc" className="text-xs font-bold text-[#1A365D] hover:text-[#2B6CB0] dark:text-blue-400">
            Xem tất cả →
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:pb-0">
          {home.sections.newest.slice(0, 5).map((b, idx) => {
            const percent = [85, 42, 91, 18, 62][idx] ?? 50
            return (
              <div key={String(b.id)} className="w-[170px] shrink-0 snap-start sm:w-auto flex flex-col justify-between gap-3 bg-white dark:bg-slate-900 rounded-lg">
                <BookCard book={b} />
                
                <div className="px-1.5 pb-2 space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-[#C2410C] to-[#EA580C] rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <span>Đã bán {percent}%</span>
                    <span className={percent >= 80 ? 'text-[#C2410C] animate-pulse font-extrabold' : ''}>
                      {percent >= 80 ? '⚡ Sắp hết' : '🔥 Đang hot'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <HomeSection
        title="📚 Sách mới cập nhật"
        subtitle="Cập nhật gần đây • Nhiều đầu sách tuyển chọn vừa lên kệ"
        items={home.sections.newest}
        viewAllHref="/books?sort=newest"
      />

      {/* 7. MID-PAGE PROMOTIONAL ADS - Height adjusted taller for legibility */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link to="/books?categoryId=self-help" className="group relative overflow-hidden rounded-xl h-[140px] lg:h-[155px] flex items-center p-6 text-white border border-[#E6E6E6] dark:border-slate-800 shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80" 
            alt="Mid Banner 1" 
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-slate-900/85 to-transparent" />
          <div className="relative z-10 space-y-1.5">
            <span className="inline-block rounded bg-rose-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">Tác giả khuyên đọc</span>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">PHÁT TRIỂN BẢN THÂN - LỰA CHỌN KHÔN NGOAN</h3>
            <p className="text-[11px] text-slate-300">Tuyển chọn sách đổi mới tư duy và cải thiện năng suất làm việc</p>
          </div>
        </Link>

        <Link to="/books?categoryId=business" className="group relative overflow-hidden rounded-xl h-[140px] lg:h-[155px] flex items-center p-6 text-white border border-[#E6E6E6] dark:border-slate-800 shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" 
            alt="Mid Banner 2" 
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 via-slate-900/85 to-transparent" />
          <div className="relative z-10 space-y-1.5">
            <span className="inline-block rounded bg-[#C2410C] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">Kinh doanh khởi nghiệp</span>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">QUẢN TRỊ KINH DOANH & PHÁT TRIỂN DOANH NGHIỆP</h3>
            <p className="text-[11px] text-slate-350">Bứt phá doanh số với các chiến lược thực tế kinh điển</p>
          </div>
        </Link>
      </section>

      {/* 8. MOST VIEWED */}
      <HomeSection
        title="🔥 Sách xem nhiều nhất"
        subtitle="Xu hướng tìm kiếm • Đầu sách thu hút độc giả tuần qua"
        items={home.sections.mostViewed}
        viewAllHref="/books"
      />

      {/* 9. TỦ SÁCH NỔI BẬT (Featured Bookshelves - 3 columns list format) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black tracking-tight text-[#212121] dark:text-[#F8FAFC]">📚 Tủ Sách Nổi Bật</h2>
          <p className="text-xs text-slate-500">Tuyển tập tinh tuyển theo các chuyên đề học thuật và nghệ thuật kinh điển</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Shelf 1 */}
          <div className="rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div className="mb-4">
              <Link to="/collections/business" className="flex items-center gap-2 mb-1 hover:underline group">
                <span className="text-xl">💼</span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#1A365D] dark:text-blue-400 group-hover:text-[#2B6CB0]">Tinh Hoa Quản Trị</h3>
              </Link>
              <p className="text-[11px] text-slate-550 dark:text-slate-400">Bí quyết vận hành doanh nghiệp & kỹ năng lãnh đạo xuất sắc.</p>
            </div>
            <div className="space-y-3">
              {shelfBusiness.map((b) => (
                <Link key={b.id} to={`/books/${b.id}`} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded px-1.5 transition-all">
                  <img src={b.coverUrl} alt={b.title} className="h-14 w-10 object-cover rounded shadow-sm shrink-0 bg-slate-50 border border-slate-100 dark:border-slate-800" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-xs font-bold text-[#212121] dark:text-white leading-snug">{b.title}</div>
                    <div className="line-clamp-1 text-[10px] text-slate-500">{b.author ?? '—'}</div>
                    <div className="text-[11px] font-extrabold text-[#1A365D] dark:text-blue-400 mt-0.5">{formatVND(b.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Shelf 2 */}
          <div className="rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div className="mb-4">
              <Link to="/collections/tech" className="flex items-center gap-2 mb-1 hover:underline group">
                <span className="text-xl">💻</span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-indigo-700 dark:text-indigo-400 group-hover:text-indigo-500">Lập Trình Viên Tinh Nhuệ</h3>
              </Link>
              <p className="text-[11px] text-slate-550 dark:text-slate-400">Từ tư duy Clean Code đến các công nghệ phát triển AI tương lai.</p>
            </div>
            <div className="space-y-3">
              {shelfTech.map((b) => (
                <Link key={b.id} to={`/books/${b.id}`} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded px-1.5 transition-all">
                  <img src={b.coverUrl} alt={b.title} className="h-14 w-10 object-cover rounded shadow-sm shrink-0 bg-slate-50 border border-slate-100 dark:border-slate-800" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-xs font-bold text-[#212121] dark:text-white leading-snug">{b.title}</div>
                    <div className="line-clamp-1 text-[10px] text-slate-500">{b.author ?? '—'}</div>
                    <div className="text-[11px] font-extrabold text-[#1A365D] dark:text-blue-400 mt-0.5">{formatVND(b.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Shelf 3 */}
          <div className="rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div className="mb-4">
              <Link to="/collections/fiction" className="flex items-center gap-2 mb-1 hover:underline group">
                <span className="text-xl">✍️</span>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-rose-700 dark:text-rose-450 group-hover:text-rose-500">Văn Học Cực Phẩm</h3>
              </Link>
              <p className="text-[11px] text-slate-550 dark:text-slate-400">Các tác phẩm tiểu thuyết, tản văn và trinh thám kinh điển thế giới.</p>
            </div>
            <div className="space-y-3">
              {shelfFiction.map((b) => (
                <Link key={b.id} to={`/books/${b.id}`} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded px-1.5 transition-all">
                  <img src={b.coverUrl} alt={b.title} className="h-14 w-10 object-cover rounded shadow-sm shrink-0 bg-slate-50 border border-slate-100 dark:border-slate-800" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-xs font-bold text-[#212121] dark:text-white leading-snug">{b.title}</div>
                    <div className="line-clamp-1 text-[10px] text-slate-500">{b.author ?? '—'}</div>
                    <div className="text-[11px] font-extrabold text-[#1A365D] dark:text-blue-400 mt-0.5">{formatVND(b.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. SPLIT BOTTOM LAYOUT: Collections & Sidebar (weekly ranking, news) */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left column: Collections & Brand Story */}
        <div className="space-y-8">
          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#212121] dark:text-[#F8FAFC]">🎨 Bộ sưu tập nổi bật</h2>
                <p className="text-xs text-slate-500">Lựa chọn sách nhanh theo từng chủ đề yêu thích</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {home.featuredCollections.map((col) => (
                <div
                  key={col.id}
                  className="rounded-lg border border-[#E6E6E6] bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{col.title}</div>
                      <div className="text-[11px] text-slate-500">{col.subtitle}</div>
                    </div>
                    <Link to="/books" className="text-xs font-bold text-[#1A365D] hover:underline dark:text-blue-400">
                      Xem thêm
                    </Link>
                  </div>
                  {/* Grid 2x2 for collection items */}
                  <div className="grid grid-cols-2 gap-3">
                    {col.items.slice(0, 2).map((b: Book) => (
                      <BookCard key={String(b.id)} book={b} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Brand Story Card */}
          <div className="rounded-lg border border-[#E6E6E6] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 h-36 w-36 rounded-full bg-blue-100/20 blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <span className="inline-block rounded bg-[#1A365D]/10 px-2.5 py-1 text-[10px] font-bold text-[#1A365D] dark:text-blue-400 uppercase tracking-wide border border-[#1A365D]/20">
                Câu chuyện SachStore
              </span>
              <h2 className="text-xl font-extrabold text-[#212121] dark:text-[#F8FAFC] leading-snug">
                Nơi khởi đầu của những hành trình tri thức
              </h2>
              <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-normal">
                Khởi đầu từ niềm đam mê mãnh liệt với những trang giấy thơm mùi mực, <strong>SachStore</strong> được thành lập với sứ mệnh mang thế giới tri thức tinh tuyền nhất đến tay mọi người đọc.
              </p>
              <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-normal">
                Chúng tôi tin rằng mỗi cuốn sách không chỉ là những dòng chữ, mà là một người bạn đồng hành, một người thầy dẫn lối mở ra thế giới mới. Sự an tâm và hành trình thưởng thức sách của bạn là niềm hạnh phúc lớn nhất của chúng tôi.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1A365D] to-[#2B6CB0] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                📖
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200">Đội ngũ sáng lập SachStore</div>
                <div className="text-[10px] text-slate-500">Gửi trọn tâm huyết vào từng trang sách</div>
              </div>
            </div>
          </div>

          {/* Exclusive Promotional Campaigns Card (Balancing Left Column) */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#E6E6E6] bg-gradient-to-r from-red-500 to-orange-600 p-5 text-white shadow-sm flex flex-col justify-between h-[155px] relative overflow-hidden dark:border-slate-850">
              <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div>
                <span className="inline-block rounded bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">Mừng Sinh Nhật 5 Tuổi</span>
                <h3 className="text-sm font-black mt-1 leading-snug">SIÊU SALE ĐỒNG GIÁ 19K - 49K</h3>
                <p className="text-[10px] text-white/90 mt-1 leading-relaxed">Giảm đến 50% toàn bộ sách văn học. Áp dụng freeship cho đơn hàng từ 250k.</p>
              </div>
              <Link to="/books?categoryId=fiction" className="text-[10px] font-bold underline hover:translate-x-1 transition mt-2 inline-flex items-center gap-1">Nhận mã ngay →</Link>
            </div>
            
            <div className="rounded-xl border border-[#E6E6E6] bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white shadow-sm flex flex-col justify-between h-[155px] relative overflow-hidden dark:border-slate-850">
              <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <img src="/icons/free-shipping.png" alt="Miễn phí vận chuyển" className="absolute -right-2 -bottom-2 h-20 w-20 object-contain opacity-25 pointer-events-none" />
              <div>
                <span className="inline-block rounded bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">Ưu Đãi Vận Chuyển</span>
                <h3 className="text-sm font-black mt-1 leading-snug">MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC</h3>
                <p className="text-[10px] text-white/90 mt-1 leading-relaxed">Nhập mã FREESHIP30 giảm ngay 30.000đ phí vận chuyển khi đặt mua online.</p>
              </div>
              <Link to="/books" className="text-[10px] font-bold underline hover:translate-x-1 transition mt-2 inline-flex items-center gap-1">Sử dụng ngay →</Link>
            </div>
          </div>

          {/* SĂN VOUCHER ĐỘC QUYỀN */}
          <div className="rounded-xl border border-[#E6E6E6] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  🎫 Săn Voucher Độc Quyền
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Bấm sao chép để áp dụng mã giảm giá / freeship khi thanh toán</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { code: 'FREESHIP30', label: 'Miễn phí vận chuyển', desc: 'Giảm tối đa 30K', detail: 'Đơn hàng từ 150K' },
                { code: 'NHANH24H', label: 'Giao hỏa tốc', desc: 'Giảm ngay 15K', detail: 'Nhận hàng nhanh' },
                { code: 'VIPSACH50', label: 'Voucher Sách Vip', desc: 'Giảm ngay 50K', detail: 'Đơn hàng từ 500K' },
              ].map((v) => (
                <VoucherCard key={v.code} voucher={v} />
              ))}
            </div>
          </div>

          {/* Banner Quảng Cáo Sự Kiện Nổi Bật */}
          <div className="rounded-xl border border-[#E6E6E6] bg-gradient-to-r from-[#1A365D] via-[#244b7d] to-[#C2410C] p-5 text-white shadow-sm relative overflow-hidden dark:border-slate-850 flex flex-col justify-between h-[160px]">
            <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <span className="inline-block rounded bg-[#C2410C] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">Sự Kiện Đặc Biệt</span>
              <h3 className="text-base font-black leading-snug tracking-tight">HỘI SÁCH HÈ SACHSTORE 2026</h3>
              <p className="text-[10.5px] text-white/90 leading-relaxed max-w-md">
                Hàng ngàn đầu sách văn học, khoa học, kỹ năng đồng loạt giảm sâu tới <span className="font-extrabold text-amber-350">70%</span>. Tặng ngay Bookmark gỗ thiết kế độc quyền cho mọi hóa đơn.
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-[9.5px] text-white/80">Thời gian: 15/06 - 22/06/2026 tại chi nhánh Đà Nẵng & HCM</span>
              <Link to="/books" className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-[#1A365D] hover:bg-amber-50 hover:scale-105 active:scale-95 transition shadow-md">
                Tham gia ngay →
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: Weekly Rankings & News sidebar */}
        <HomeSidebar weeklyRanking={home.sections.weeklyRanking} news={home.news} />
      </div>
    </div>
  )
}

function HomeSection({
  title,
  subtitle,
  items,
  viewAllHref,
}: {
  title: string
  subtitle: string
  items: Book[]
  viewAllHref: string
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight text-[#212121] dark:text-[#F8FAFC]">{title}</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <Link to={viewAllHref} className="text-xs font-bold text-[#1A365D] hover:text-[#2B6CB0] dark:text-blue-400">
          Xem tất cả →
        </Link>
      </div>

      {/* Grid: 5 columns on Desktop */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.slice(0, 5).map((b) => (
          <BookCard key={String(b.id)} book={b} />
        ))}
      </div>
    </section>
  )
}

function VoucherCard({
  voucher,
}: {
  voucher: { code: string; label: string; desc: string; detail: string }
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code)
    setCopied(true)
    toast.success(`Đã sao chép mã ${voucher.code}`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative flex flex-col justify-between rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-3 hover:bg-slate-55 dark:border-slate-700 dark:bg-slate-850 dark:hover:bg-slate-800 transition">
      <div className="space-y-1">
        <span className="rounded bg-[#1A365D]/10 dark:bg-[#1A365D]/20 border border-[#1A365D]/20 px-2 py-0.5 text-[8.5px] font-bold text-[#1A365D] dark:text-blue-400">
          {voucher.label}
        </span>
        <div className="text-xs font-black text-slate-800 dark:text-slate-200 mt-1.5">{voucher.desc}</div>
        <div className="text-[9px] text-slate-550">{voucher.detail}</div>
      </div>
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between gap-1.5">
        <code className="text-[10px] font-mono font-extrabold text-stone-700 dark:text-stone-300 select-all px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700">{voucher.code}</code>
        <button
          type="button"
          onClick={handleCopy}
          className={`rounded-lg px-2 py-1 text-[9px] font-black uppercase transition-all shrink-0 ${
            copied
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-[#1A365D] hover:bg-[#2B6CB0] text-white hover:scale-105 active:scale-95'
          }`}
        >
          {copied ? 'Đã lưu' : 'Sao chép'}
        </button>
      </div>
    </div>
  )
}

function HomeCategoryIcon({ id, emoji, name }: { id: string; emoji: string; name: string }) {
  const [error, setError] = useState(false)

  // Mapping from category ID to actual uploaded filename
  const HOME_CATEGORY_ICON_MAP: Record<string, string> = {
    fiction: 'book.png',
    kids: 'game.png',
    business: 'financial-profit.png',
    'self-help': 'idea.png',
    tech: 'desktop-computer.png',
    foreign: 'globe.png',
    comics: 'burst.png',
    education: 'pencil.png',
  }

  if (error) {
    return <span className="text-2xl mb-1.5">{emoji}</span>
  }

  const iconFile = HOME_CATEGORY_ICON_MAP[id] || `${id}.png`

  return (
    <img
      src={`/icons/${iconFile}`}
      alt={name}
      onError={() => setError(true)}
      className="h-8 w-8 object-contain mb-1.5 shrink-0"
    />
  )
}

