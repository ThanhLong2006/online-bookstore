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
  const trendingFictions = useMemo(() => mockBooks.filter(b => b.category?.id === 'fiction').slice(0, 3), [])
  const trendingTech = useMemo(() => mockBooks.filter(b => b.category?.id === 'tech').slice(0, 3), [])
  const trendingSkills = useMemo(() => mockBooks.filter(b => b.category?.id === 'self-help').slice(0, 3), [])
  const trendingBusiness = useMemo(() => mockBooks.filter(b => b.category?.id === 'business').slice(0, 3), [])

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
      {/* 1. HERO AREA: Main Slider Banner (2/3) + 2 Stacked Sub Banners (1/3) */}
      <section className="grid gap-4 md:grid-cols-3 max-w-[1230px] mx-auto w-full md:h-[460px] h-fit">
        {/* Main Carousel */}
        <div className={`md:col-span-2 overflow-hidden rounded-2xl shadow-lg relative h-[340px] md:h-full group transition-all duration-500 ${
          activeBanner?.id === 'bn-author' 
            ? 'bg-gradient-to-r from-sky-300 via-sky-200 to-indigo-100' 
            : activeBanner?.id === 'bn-1'
            ? 'bg-gradient-to-r from-red-700 via-rose-600 to-orange-500'
            : activeBanner?.id === 'bn-2'
            ? 'bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700'
            : 'bg-gradient-to-r from-teal-800 via-emerald-800 to-green-700'
        }`}>
          {/* Geometry decorations */}
          <div className="absolute -top-[20%] -left-[10%] w-60 h-60 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-[10%] -right-[10%] w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative h-full">
            {activeBanner ? (
              <Link to={activeBanner.href} className="block h-full">
                {activeBanner.id === 'bn-author' && (
                  // Nguyễn Nhật Ánh Special Slide
                  <div className="relative w-full h-full flex items-center justify-between p-6 sm:p-10 z-10">
                    {/* Left & Middle content */}
                    <div className="max-w-[65%] flex flex-col justify-center h-full space-y-3.5 text-left">
                      <div className="inline-flex self-start rounded-full bg-blue-900 text-white px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider shadow-sm">
                        🎖️ Tác giả của tháng
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-blue-950 sm:text-5xl lg:text-6xl leading-none">
                        NGUYỄN NHẬT ÁNH
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-blue-900 font-bold leading-relaxed line-clamp-1">
                        Nhà văn với những câu chuyện tuổi học trò đầy hoài niệm
                      </p>
                      
                      {/* Stats Badges */}
                      <div className="hidden sm:flex gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-blue-950 font-bold leading-tight bg-white/70 px-3.5 py-2 rounded-xl border border-blue-900/10 shadow-sm">
                          <span className="text-base shrink-0">🛡️</span>
                          <span>Hơn 200k bản bán chạy mỗi năm</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-blue-950 font-bold leading-tight bg-white/70 px-3.5 py-2 rounded-xl border border-blue-900/10 shadow-sm">
                          <span className="text-base shrink-0">🏆</span>
                          <span>Giải thưởng văn học ASEAN 2010</span>
                        </div>
                      </div>
                      
                      <div className="inline-flex self-start items-center gap-1.5 rounded-xl bg-blue-900 text-white px-6 py-2.5 text-xs sm:text-sm font-black transition shadow-md hover:bg-yellow-400 hover:text-blue-950 hover:scale-105 active:scale-95 duration-200">
                        Khám phá tác phẩm →
                      </div>
                    </div>

                    {/* Book Box set (Middle Right) */}
                    <div className="hidden lg:flex w-[15%] h-full items-center justify-center">
                      <img 
                        src="/icons/book-box-set.png" 
                        alt="Nguyen Nhat Anh Box Set" 
                        className="max-h-[85%] w-auto object-contain drop-shadow-2xl transform -rotate-6 group-hover:-rotate-3 transition duration-300 pointer-events-none select-none"
                      />
                    </div>

                    {/* Author Avatar (Far Right) */}
                    <div className="relative w-[30%] sm:w-[22%] lg:w-[20%] h-full flex items-center justify-center">
                      <img 
                        src="/icons/author-avatar.png" 
                        alt="Nguyen Nhat Anh Illustration" 
                        className="max-h-[95%] w-auto object-contain drop-shadow-xl transform group-hover:scale-105 transition duration-300 pointer-events-none select-none"
                      />
                    </div>
                  </div>
                )}

                {activeBanner.id === 'bn-1' && (
                  // Slide 2: Tech & Skills Week
                  <div className="relative w-full h-full flex items-center justify-between p-6 sm:p-10 z-10">
                    {/* Left content */}
                    <div className="max-w-[65%] flex flex-col justify-center h-full space-y-3.5 text-left">
                      <div className="inline-flex self-start rounded-full bg-rose-600 text-white px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider shadow-sm animate-pulse">
                        ⚡ Deal hủy diệt tuần này
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-5.5xl leading-none">
                        TECH & SKILLS WEEK
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-white font-bold leading-relaxed line-clamp-1">
                        Giảm đến 30% toàn bộ Sách Công Nghệ & Kỹ Năng Sống
                      </p>
                      
                      {/* Stats Badges */}
                      <div className="hidden sm:flex gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-white font-bold leading-tight bg-white/20 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                          <span className="text-base shrink-0">🚚</span>
                          <span>Freeship mọi đơn hàng từ 150K</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white font-bold leading-tight bg-white/20 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                          <span className="text-base shrink-0">🎫</span>
                          <span>Tặng mã VIPSACH50 giảm ngay 50K</span>
                        </div>
                      </div>
                      
                      <div className="inline-flex self-start items-center gap-1.5 rounded-xl bg-yellow-400 text-slate-950 px-6 py-2.5 text-xs sm:text-sm font-black transition shadow-md hover:bg-white hover:scale-105 active:scale-95 duration-200">
                        Săn deal ngay →
                      </div>
                    </div>

                    {/* Right content: Cutout floating book */}
                    <div className="relative w-[30%] h-full flex items-center justify-center">
                      <img 
                        src="/icons/hero-book.png" 
                        alt="Floating Book" 
                        className="max-h-[95%] w-auto object-contain drop-shadow-2xl transform rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  </div>
                )}

                {activeBanner.id === 'bn-2' && (
                  // Slide 3: New Arrivals
                  <div className="relative w-full h-full flex items-center justify-between p-6 sm:p-10 z-10">
                    {/* Left content */}
                    <div className="max-w-[65%] flex flex-col justify-center h-full space-y-3.5 text-left">
                      <div className="inline-flex self-start rounded-full bg-yellow-400 text-indigo-950 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider shadow-sm">
                        ✨ Sách mới trên kệ
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-5.5xl leading-none">
                        MỚI LÊN KỆ HÔM NAY
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-white/90 font-bold leading-relaxed line-clamp-1">
                        Khám phá các đầu sách xu hướng mới xuất bản hot nhất
                      </p>
                      
                      {/* Stats Badges */}
                      <div className="hidden sm:flex gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-white font-bold leading-tight bg-white/20 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                          <span className="text-base shrink-0">🆕</span>
                          <span>Bản in chính hãng chất lượng cao</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white font-bold leading-tight bg-white/20 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                          <span className="text-base shrink-0">📦</span>
                          <span>Giao hỏa tốc 2h nhận sách ngay</span>
                        </div>
                      </div>
                      
                      <div className="inline-flex self-start items-center gap-1.5 rounded-xl bg-white text-indigo-900 px-6 py-2.5 text-xs sm:text-sm font-black transition shadow-md hover:bg-yellow-400 hover:text-indigo-950 hover:scale-105 active:scale-95 duration-200">
                        Xem sách mới →
                      </div>
                    </div>

                    {/* Right content: Cutout floating book box set */}
                    <div className="relative w-[30%] h-full flex items-center justify-center">
                      <img 
                        src="/icons/book-box-set.png" 
                        alt="Floating Book Box" 
                        className="max-h-[90%] w-auto object-contain drop-shadow-2xl transform rotate-[-6deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  </div>
                )}

                {activeBanner.id !== 'bn-author' && activeBanner.id !== 'bn-1' && activeBanner.id !== 'bn-2' && (
                  // Slide 4: Curated Bookshelves / Default
                  <div className="relative w-full h-full flex items-center justify-between p-6 sm:p-10 z-10">
                    {/* Left content */}
                    <div className="max-w-[65%] flex flex-col justify-center h-full space-y-3.5 text-left">
                      <div className="inline-flex self-start rounded-full bg-white text-emerald-900 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider shadow-sm">
                        👑 Tủ sách tinh tuyển
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-5.5xl leading-none">
                        ĐỌC NHIỀU NHẤT TUẦN
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-white/90 font-bold leading-relaxed line-clamp-1">
                        Top các tác phẩm được săn đón nhiều nhất bởi độc giả SachStore
                      </p>
                      
                      {/* Stats Badges */}
                      <div className="hidden sm:flex gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-white font-bold leading-tight bg-white/20 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                          <span className="text-base shrink-0">⭐️</span>
                          <span>Đánh giá xuất sắc 4.8+/5 sao</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white font-bold leading-tight bg-white/20 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
                          <span className="text-base shrink-0">📖</span>
                          <span>Tuyển chọn kỹ càng nội dung sâu sắc</span>
                        </div>
                      </div>
                      
                      <div className="inline-flex self-start items-center gap-1.5 rounded-xl bg-yellow-400 text-emerald-950 px-6 py-2.5 text-xs sm:text-sm font-black transition shadow-md hover:bg-white hover:text-[#1A365D] hover:scale-105 active:scale-95 duration-200">
                        Khám phá ngay →
                      </div>
                    </div>

                    {/* Right content: Cutout floating book */}
                    <div className="relative w-[30%] h-full flex items-center justify-center">
                      <img 
                        src="/icons/hero-book.png" 
                        alt="Floating Book" 
                        className="max-h-[95%] w-auto object-contain drop-shadow-2xl transform rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  </div>
                )}
              </Link>
            ) : null}

            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-6 sm:left-10 flex items-center gap-1.5 z-20">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBannerIndex(i)}
                  className={[
                    'h-1.5 rounded-full transition-all duration-300',
                    i === bannerIndex ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/50 hover:bg-white',
                  ].join(' ')}
                  aria-label={`Banner ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stacked Sub Banners - two vivid promo panels */}
        <div className="md:col-span-1 flex flex-col gap-4 h-[380px] md:h-full">

          {/* Sub-banner 1: Sale văn học */}
          <Link
            to="/books?categoryId=fiction"
            className="group relative flex-1 min-h-[180px] md:min-h-0 overflow-hidden rounded-2xl shadow-lg flex items-stretch transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
          >
            {/* Book cover image background */}
            <img
              src="https://covers.openlibrary.org/b/id/8101343-L.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-500 pointer-events-none select-none"
            />
            {/* Strong color overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/95 via-red-600/85 to-red-900/60" />
            {/* Decorative circle */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-yellow-400/20 blur-2xl pointer-events-none" />
            <div className="absolute right-3 bottom-0">
              <img
                src="https://covers.openlibrary.org/b/id/8101343-L.jpg"
                alt="Văn học"
                className="h-[160px] md:h-[200px] w-auto object-cover rounded-t-lg shadow-2xl group-hover:scale-105 transition duration-300 select-none pointer-events-none border border-white/20"
              />
            </div>
            {/* Text */}
            <div className="relative z-10 flex flex-col justify-center pl-6 pr-[120px] py-4 space-y-2.5 h-full">
              <span className="inline-block self-start rounded-full bg-yellow-400 text-red-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-md">Xả kho cuối mùa</span>
              <h4 className="text-lg sm:text-2xl font-black leading-tight text-white drop-shadow-md">
                SÁCH ĐỒNG GIÁ<br />
                <span className="text-yellow-300 text-xl sm:text-2xl lg:text-3xl font-black block mt-1">19K · 29K · 49K</span>
              </h4>
              <span className="text-xs sm:text-sm font-black text-white underline decoration-yellow-300 decoration-2 underline-offset-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Mua ngay <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
              </span>
            </div>
          </Link>

          {/* Sub-banner 2: Công nghệ & AI */}
          <Link
            to="/books?categoryId=tech"
            className="group relative flex-1 min-h-[180px] md:min-h-0 overflow-hidden rounded-2xl shadow-lg flex items-stretch transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
          >
            {/* Book cover image background */}
            <img
              src="https://covers.openlibrary.org/b/id/9641996-L.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-500 pointer-events-none select-none"
            />
            {/* Strong overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c4a6e]/95 via-cyan-700/88 to-cyan-900/60" />
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-cyan-300/20 blur-2xl pointer-events-none" />
            <div className="absolute right-4 bottom-0">
              <img
                src="https://covers.openlibrary.org/b/id/9641996-L.jpg"
                alt="Tech book"
                className="h-[170px] md:h-[200px] w-auto object-cover rounded-t-lg shadow-2xl group-hover:scale-105 transition duration-300 select-none pointer-events-none border border-white/20"
              />
            </div>
            {/* Text */}
            <div className="relative z-10 flex flex-col justify-center pl-6 pr-[120px] py-4 space-y-2.5 h-full">
              <span className="inline-block self-start rounded bg-cyan-400 text-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-md">Developer hot</span>
              <h4 className="text-lg sm:text-2xl font-black leading-tight text-white drop-shadow-md">
                LẬP TRÌNH & AI<br />
                <span className="text-cyan-300 text-xl sm:text-2xl lg:text-3xl font-black block mt-1">GIẢM ĐẾN 40%</span>
              </h4>
              <span className="text-xs sm:text-sm font-black text-white underline decoration-cyan-300 decoration-2 underline-offset-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Xem ngay <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* 2. PROMO GRID - 4 vivid cards right below hero */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 max-w-[1230px] mx-auto w-full">
        {[
          {
            tag: 'SÁCH HÈ 2026',
            title: 'Chốt đơn\nsiêu tiết kiệm',
            highlight: 'Giảm đến 30%',
            sub: 'Văn học · Thiếu nhi · Kỹ năng',
            to: '/books',
            icon: '/icons/pencil.png',
            coverUrl: 'https://covers.openlibrary.org/b/id/8225266-L.jpg',
            gradFrom: '#E5193B',
            gradTo: '#f97316',
            tagBg: 'bg-yellow-300 text-red-900',
          },
          {
            tag: 'TÁC GIẢ THÁNG',
            title: 'Nguyễn\nNhật Ánh',
            highlight: 'Tuyển tập đặc sắc',
            sub: 'Hơn 200 tác phẩm',
            to: '/books?q=Nguy%E1%BB%85n%20Nh%E1%BA%ADt%20%C3%81nh',
            icon: '/icons/book.png',
            coverUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
            gradFrom: '#1d4ed8',
            gradTo: '#0ea5e9',
            tagBg: 'bg-sky-200 text-blue-900',
          },
          {
            tag: 'CAMPUS STORE',
            title: 'Học tập\nthông minh',
            highlight: 'Giảm đến 30%',
            sub: 'Giáo khoa · Tham khảo',
            to: '/books?categoryId=education',
            icon: '/icons/idea.png',
            coverUrl: 'https://covers.openlibrary.org/b/id/10527843-L.jpg',
            gradFrom: '#7c3aed',
            gradTo: '#a855f7',
            tagBg: 'bg-purple-200 text-purple-900',
          },
          {
            tag: 'NGOẠI VĂN',
            title: 'Sách tiếng Anh\n& quốc tế',
            highlight: 'Giảm đến 25%',
            sub: 'Best-seller toàn cầu',
            to: '/books?categoryId=foreign',
            icon: '/icons/globe.png',
            coverUrl: 'https://covers.openlibrary.org/b/id/8231432-L.jpg',
            gradFrom: '#047857',
            gradTo: '#0d9488',
            tagBg: 'bg-emerald-200 text-emerald-900',
          },
        ].map((card, idx) => (
          <Link
            key={idx}
            to={card.to}
            className="group relative rounded-xl overflow-hidden flex items-stretch shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-[180px]"
            style={{ background: `linear-gradient(135deg, ${card.gradFrom} 0%, ${card.gradTo} 100%)` }}
          >
            {/* Decorative noise overlay for depth */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3Ccircle cx=\'23\' cy=\'23\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }} />
            {/* Glow top-left */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/20 blur-xl pointer-events-none" />

            {/* Left: Text */}
            <div className="relative z-10 flex flex-col justify-between pl-4 py-4 pr-1 flex-1 min-w-0">
              <div className="space-y-1.5">
                <span className={`inline-block self-start rounded px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider shadow-sm ${card.tagBg}`}>
                  {card.tag}
                </span>
                <h4 className="text-[14px] font-black leading-snug text-white drop-shadow-sm whitespace-pre-line">
                  {card.title}
                </h4>
              </div>
              <div>
                <div className="text-[12px] font-black text-white leading-tight bg-black/25 inline-block px-2.5 py-0.5 rounded-md mb-1.5">
                  {card.highlight}
                </div>
                <div className="text-[9.5px] text-white/75 leading-tight mb-2">{card.sub}</div>
                <div className="inline-flex items-center gap-1 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 px-2.5 py-1.5 text-[9px] font-black uppercase text-white shadow-sm transition-all duration-200 group-hover:bg-white group-hover:text-gray-800">
                  Mua ngay →
                </div>
              </div>
            </div>

            {/* Right: Book cover image */}
            <div className="relative shrink-0 w-[100px] h-full flex items-end justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
              <img
                src={card.coverUrl}
                alt={card.tag}
                className="absolute bottom-0 right-0 h-[160px] w-auto object-cover rounded-t-md shadow-2xl group-hover:scale-105 group-hover:-translate-y-1 transition duration-300 select-none pointer-events-none border border-white/25"
              />
            </div>
          </Link>
        ))}
      </section>
      {/* 3. CORE COMMITMENTS SECTION */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[1230px] mx-auto w-full">
        {[
          {
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            ),
            title: 'Chính Hãng 100%',
            desc: 'Hợp tác trực tiếp với các NXB uy tín. Cam kết đền gấp 10 lần nếu phát hiện sách giả.',
            colorClass: 'text-blue-600 border-blue-100 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-900/30',
            accentClass: 'bg-blue-600',
            to: '/policy#genuine'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            ),
            title: 'Giao Nhanh Hỏa Tốc',
            desc: 'Đóng gói chống va đập tối đa. Giao nhanh trong 2h tại nội thành các thành phố lớn.',
            colorClass: 'text-orange-600 border-orange-100 bg-orange-50 dark:text-orange-450 dark:bg-orange-900/20 dark:border-orange-900/30',
            accentClass: 'bg-orange-600',
            to: '/policy#shipping'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            ),
            title: 'Thanh Toán An Toàn',
            desc: 'Hỗ trợ thẻ ATM/Visa, ví MoMo, ZaloPay. Bảo mật thông tin giao dịch tuyệt đối.',
            colorClass: 'text-emerald-600 border-emerald-100 bg-emerald-50 dark:text-emerald-450 dark:bg-emerald-900/20 dark:border-emerald-900/30',
            accentClass: 'bg-emerald-600',
            to: '/policy#payment'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            ),
            title: 'Hỗ Trợ Tận Tâm 24/7',
            desc: 'Đội ngũ trực tổng đài am hiểu sâu về sách, luôn tiếp thu ý kiến và phản hồi 24/7.',
            colorClass: 'text-purple-600 border-purple-100 bg-purple-50 dark:text-purple-450 dark:bg-purple-900/20 dark:border-purple-900/30',
            accentClass: 'bg-purple-600',
            to: '/support#contact'
          }
        ].map((s, idx) => (
          <Link 
            key={idx} 
            to={s.to}
            className="group relative flex items-center gap-4 rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* Hover accent left border */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.accentClass} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center`} />
            
            {/* Icon container */}
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 ${s.colorClass}`}>
              {s.icon}
            </div>
            
            {/* Text details */}
            <div className="space-y-1 text-left">
              <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight uppercase group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                {s.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {s.desc}
              </p>
            </div>
          </Link>
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

      {/* 4. ORIGINAL PLACE OF XU HƯỚNG MUA SẮM (MOVED DOWN) */}

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

      {/* 7. PLACEHOLDER - Promo cards moved up, this slot is now empty */}

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

      {/* 9.5. XU HƯỚNG MUA SẮM (Shopping Trends Section - Redesigned 3D fanned deck layout, moved below Featured Bookshelves) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-left">
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#212121] dark:text-[#F8FAFC]">📈 Xu Hướng Mua Sắm</h2>
            <p className="text-xs text-slate-500">Cập nhật chủ đề đang thu hút độc giả quan tâm nhiều nhất trong tuần</p>
          </div>
          <Link to="/trends" className="text-xs font-bold text-[#1A365D] hover:text-[#2B6CB0] dark:text-blue-400">
            Xem tất cả →
          </Link>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              badgeText: '📈 XU HƯỚNG +180%',
              badgeClass: 'bg-rose-500/10 text-rose-700 dark:bg-rose-950/35 dark:text-rose-350 border border-rose-200/30',
              title: 'Sách Văn Học',
              desc: 'Tiểu thuyết, truyện trinh thám và tản văn ăn khách nhất',
              glowColor: 'bg-rose-500/10 dark:bg-rose-500/5',
              to: '/trends?categoryId=fiction',
              books: trendingFictions,
            },
            {
              badgeText: '💻 DEVELOPER HOT',
              badgeClass: 'bg-blue-500/10 text-blue-700 dark:bg-blue-950/35 dark:text-blue-350 border border-blue-200/30',
              title: 'Công Nghệ & AI',
              desc: 'Giáo trình lập trình chuyên sâu và sách trí tuệ nhân tạo mới',
              glowColor: 'bg-blue-500/10 dark:bg-blue-500/5',
              to: '/trends?categoryId=tech',
              books: trendingTech,
            },
            {
              badgeText: '🧠 ĐỌC NHIỀU NHẤT',
              badgeClass: 'bg-purple-500/10 text-purple-700 dark:bg-purple-950/35 dark:text-purple-300 border border-purple-200/30',
              title: 'Tư Duy & Kỹ Năng',
              desc: 'Sách rèn luyện thói quen, kỷ luật và nâng cao hiệu suất',
              glowColor: 'bg-purple-500/10 dark:bg-purple-500/5',
              to: '/trends?categoryId=self-help',
              books: trendingSkills,
            },
            {
              badgeText: '📊 TĂNG TRƯỞNG CAO',
              badgeClass: 'bg-amber-500/10 text-amber-700 dark:bg-amber-950/35 dark:text-amber-300 border border-amber-200/30',
              title: 'Quản Trị Kinh Doanh',
              desc: 'Khởi nghiệp, quản trị nhân sự và tài chính đầu tư tinh hoa',
              glowColor: 'bg-amber-500/10 dark:bg-amber-500/5',
              to: '/trends?categoryId=business',
              books: trendingBusiness,
            },
          ].map((card, idx) => (
            <Link
              key={idx}
              to={card.to}
              className="group relative rounded-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-850 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-between items-center h-[200px] overflow-hidden"
            >
              {/* Background soft glow decoration */}
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full ${card.glowColor} blur-2xl opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-300`} />
              
              {/* Left content */}
              <div className="flex flex-col justify-between h-full z-10 flex-1 min-w-0 pr-2 text-left">
                <div className="space-y-2">
                  <span className={`inline-block rounded px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${card.badgeClass}`}>
                    {card.badgeText}
                  </span>
                  <h3 className="text-base font-black text-slate-800 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug font-medium line-clamp-2">
                    {card.desc}
                  </p>
                </div>
                
                <span className="text-xs font-black text-[#1A365D] dark:text-blue-400 group-hover:underline inline-flex items-center gap-1.5 pt-2">
                  Xem ngay <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
                </span>
              </div>

              {/* Right content: 3D fanned books stack */}
              <div className="relative shrink-0 w-[110px] h-full flex items-end justify-center select-none pointer-events-none pb-2">
                {card.books.map((b, idx) => {
                  let cls = ""
                  if (idx === 0) {
                    cls = "h-[105px] w-[75px] z-20 shadow-md border border-white dark:border-slate-800 transform group-hover:scale-105 group-hover:-translate-y-1 group-hover:-rotate-2 transition-all duration-300 rounded"
                  } else if (idx === 1) {
                    cls = "h-[95px] w-[68px] z-10 shadow border border-white/80 dark:border-slate-800/80 absolute right-2 bottom-3 transform -rotate-[8deg] group-hover:-rotate-[12deg] group-hover:translate-x-1 transition-all duration-300 rounded opacity-90"
                  } else {
                    cls = "h-[85px] w-[62px] z-0 shadow-sm border border-white/60 dark:border-slate-800/60 absolute left-2 bottom-4 transform rotate-[10deg] group-hover:rotate-[15deg] group-hover:-translate-x-1 transition-all duration-300 rounded opacity-70"
                  }
                  return (
                    <img
                      key={b.id}
                      src={b.coverUrl}
                      alt={b.title}
                      className={`${cls} object-cover bg-white shadow-md`}
                    />
                  )
                })}
              </div>
            </Link>
          ))}
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

          {/* Exclusive Promotional Campaigns — solid left + image right */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* Card 1: Birthday Sale */}
            <Link
              to="/books?sort=price_asc"
              className="group relative rounded-2xl overflow-hidden flex shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-[250px]"
            >
              {/* LEFT: solid color panel with text */}
              <div className="relative flex-1 bg-gradient-to-br from-red-650 via-red-500 to-orange-500 flex flex-col justify-between p-6 z-10">
                {/* subtle noise */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                {/* Confetti dots top-right */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-70">
                  {['bg-yellow-300','bg-white','bg-pink-200','bg-yellow-400'].map((c,i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${c}`} />
                  ))}
                </div>
                <div className="relative space-y-2">
                  <span className="inline-block rounded-full bg-yellow-400 text-red-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-sm">🎂 Mừng sinh nhật 5 tuổi</span>
                  <h3 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-sm">
                    SIÊU SALE<br />
                    <span className="text-yellow-300 text-2xl sm:text-3xl font-black block mt-0.5">ĐỒNG GIÁ 19K·29K·49K</span>
                  </h3>
                  <p className="text-sm text-white/95 font-medium leading-relaxed">Giảm đến 50% sách văn học. Hỗ trợ Freeship từ 250K.</p>
                </div>
                <div className="relative inline-flex self-start items-center gap-1.5 rounded-xl bg-white text-red-600 px-5 py-2.5 text-xs font-black uppercase shadow-md hover:bg-yellow-400 hover:text-red-950 hover:scale-105 active:scale-95 duration-200">
                  Xem sách giá tốt →
                </div>
              </div>
              {/* RIGHT: book cover image panel */}
              <div className="relative shrink-0 w-[120px] overflow-hidden">
                <img
                  src="https://covers.openlibrary.org/b/id/8101343-L.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 pointer-events-none select-none"
                />
                {/* Left fade to blend with solid panel */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-transparent" />
              </div>
            </Link>

            {/* Card 2: Free Shipping */}
            <Link
              to="/cart"
              className="group relative rounded-2xl overflow-hidden flex shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-[250px]"
            >
              {/* LEFT: solid color panel */}
              <div className="relative flex-1 bg-gradient-to-br from-[#0c4a6e] via-blue-700 to-blue-600 flex flex-col justify-between p-6 z-10">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                <div className="relative space-y-2">
                  <span className="inline-block rounded-full bg-cyan-400 text-cyan-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-sm">🚚 Ưu đãi vận chuyển</span>
                  <h3 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-sm">
                    MIỄN PHÍ<br />
                    <span className="text-cyan-200 text-2xl sm:text-3xl font-black block mt-0.5">VẬN CHUYỂN TOÀN QUỐC</span>
                  </h3>
                  <p className="text-sm text-white/95 font-medium leading-relaxed">Nhập mã <strong className="text-white font-black bg-white/20 px-2 py-0.5 rounded">FREESHIP30</strong> — giảm 30K phí ship.</p>
                </div>
                <div className="relative inline-flex self-start items-center gap-1.5 rounded-xl bg-white text-blue-700 px-5 py-2.5 text-xs font-black uppercase shadow-md hover:bg-cyan-400 hover:text-blue-950 hover:scale-105 active:scale-95 duration-200">
                  Dùng mã tại giỏ hàng →
                </div>
              </div>
              {/* RIGHT: book cover */}
              <div className="relative shrink-0 w-[120px] overflow-hidden">
                <img
                  src="https://covers.openlibrary.org/b/id/9641996-L.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/75 to-transparent" />
              </div>
            </Link>
          </div>

          {/* SĂN VOUCHER ĐỘC QUYỀN — redesigned with color-coded voucher cards */}
          <div className="rounded-2xl border border-[#E6E6E6] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
                  🔥 TRẠM GIẬT VOUCHER
                  <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full">GIẢM THẲNG VÀO GIỎ</span>
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">Bấm "Lưu mã" để áp dụng khi thanh toán</p>
              </div>
              <Link to="/cart" className="text-[9px] font-black text-white/90 hover:text-white underline whitespace-nowrap">
                Đến giỏ hàng →
              </Link>
            </div>
            {/* Vouchers */}
            <div className="grid gap-0 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
              {[
                {
                  code: 'FREESHIP30',
                  label: 'Miễn phí vận chuyển',
                  desc: 'Giảm tối đa 30K',
                  detail: 'Đơn hàng từ 150K',
                  color: 'text-blue-700 dark:text-blue-400',
                  badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
                  icon: '🚚',
                },
                {
                  code: 'NHANH24H',
                  label: 'Giao hỏa tốc',
                  desc: 'Giảm ngay 15K',
                  detail: 'Nhận hàng trong 24h',
                  color: 'text-emerald-700 dark:text-emerald-400',
                  badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
                  icon: '⚡',
                },
                {
                  code: 'VIPSACH50',
                  label: 'Voucher Sách VIP',
                  desc: 'Giảm ngay 50K',
                  detail: 'Đơn hàng từ 500K',
                  color: 'text-purple-700 dark:text-purple-400',
                  badgeBg: 'bg-purple-100 dark:bg-purple-900/40',
                  icon: '👑',
                },
              ].map((v) => (
                <VoucherCard key={v.code} voucher={v} />
              ))}
            </div>
          </div>

          {/* Banner Sự Kiện — full-width with solid dark overlay for readable text */}
          <Link
            to="/books?sort=discount"
            className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 relative h-[290px] flex"
          >
            {/* LEFT: solid dark panel — guaranteed readable */}
            <div className="relative flex-1 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1e3a5f] flex flex-col justify-between p-6 sm:p-8 z-10">
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/60 via-orange-500/40 to-transparent rounded-t-2xl" />
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block rounded-full bg-[#C2410C] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">📅 Sự Kiện Đặc Biệt</span>
                  <span className="inline-block rounded-full bg-amber-400/25 border border-amber-400/50 px-3 py-1 text-xs font-black text-amber-300 uppercase tracking-wider">15/06 – 22/06/2026</span>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
                  HỘI SÁCH HÈ<br />
                  <span className="text-amber-400">SACHSTORE 2026</span>
                </h3>
                <p className="text-sm sm:text-base text-slate-250 dark:text-slate-100 font-medium leading-relaxed">
                  Hàng ngàn đầu sách giảm sâu tới{' '}
                  <strong className="text-amber-400 font-black">70%</strong>.
                  Tặng Bookmark gỗ độc quyền cho mọi hóa đơn.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 group-hover:bg-amber-300 px-6 py-3 text-xs sm:text-sm font-black uppercase text-slate-900 shadow-md transition-all duration-200 group-hover:scale-105">
                  Khám phá sách sale →
                </div>
                <span className="text-xs text-slate-300 font-bold">Tại Đà Nẵng & TP.HCM</span>
              </div>
            </div>

            {/* RIGHT: book covers mosaic */}
            <div className="relative shrink-0 w-[45%] sm:w-[38%] overflow-hidden">
              {/* 3 book covers stacked/fanned */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#1a2744]" />
              <div className="absolute inset-0 flex items-end justify-center gap-2 pb-0 px-3 pointer-events-none select-none">
                {[
                  { src: 'https://covers.openlibrary.org/b/id/8228691-L.jpg', h: 'h-[160px]', cls: 'rotate-[-4deg] translate-x-[-8px]' },
                  { src: 'https://covers.openlibrary.org/b/id/8101343-L.jpg', h: 'h-[200px]', cls: 'z-10' },
                  { src: 'https://covers.openlibrary.org/b/id/8225266-L.jpg', h: 'h-[165px]', cls: 'rotate-[4deg] translate-x-[8px]' },
                ].map((bk, i) => (
                  <img
                    key={i}
                    src={bk.src}
                    alt=""
                    className={`${bk.h} w-auto object-cover rounded-t-lg shadow-2xl border border-white/15 ${bk.cls} group-hover:scale-105 group-hover:-translate-y-1 transition duration-300`}
                  />
                ))}
              </div>
              {/* Fade from left to blend with dark panel */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f] via-[#1e3a5f]/30 to-transparent" />
            </div>
          </Link>
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
  voucher: { code: string; label: string; desc: string; detail: string; color?: string; badgeBg?: string; icon?: string }
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code)
    setCopied(true)
    toast.success(`Đã sao chép mã ${voucher.code}`)
    setTimeout(() => setCopied(false), 2000)
  }

  const color = voucher.color ?? 'text-[#1A365D] dark:text-blue-400'
  const badgeBg = voucher.badgeBg ?? 'bg-blue-50 dark:bg-blue-900/30'
  const icon = voucher.icon ?? '🎫'

  return (
    <div className="relative flex flex-col justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group/card">
      {/* Left accent bar */}
      <div className="space-y-2">
        {/* Icon + label */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-base ${badgeBg} shrink-0`}>{icon}</span>
          <span className={`text-[9px] font-black uppercase tracking-wider ${color}`}>{voucher.label}</span>
        </div>
        {/* Discount amount */}
        <div className={`text-base font-black ${color} leading-tight`}>{voucher.desc}</div>
        <div className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">{voucher.detail}</div>
      </div>
      {/* Code + button */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <code className="text-[10.5px] font-mono font-extrabold text-slate-700 dark:text-slate-300 select-all px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 tracking-wider">{voucher.code}</code>
        <button
          type="button"
          onClick={handleCopy}
          className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase transition-all shrink-0 ${
            copied
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 shadow-none'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:scale-105 active:scale-95 shadow-sm'
          }`}
        >
          {copied ? 'Đã lưu' : 'Lưu mã'}
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

