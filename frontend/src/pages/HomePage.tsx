import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookCard } from '../components/books/BookCard'
import { HomeSidebar } from '../components/home/Sidebar'
import { mockCategories, mockGetHomeSections } from '../services/api/mockData'
import type { Book, Category } from '../types/book'

export function HomePage() {
  const categories = useMemo<Category[]>(() => mockCategories.slice(0, 8), [])
  const home = useMemo(() => mockGetHomeSections(), [])
  const [bannerIndex, setBannerIndex] = useState(0)
  const banners = home.banners

  useEffect(() => {
    if (!banners.length) return
    const id = window.setInterval(() => setBannerIndex((i) => (i + 1) % banners.length), 4500)
    return () => window.clearInterval(id)
  }, [banners.length])

  const activeBanner = banners[bannerIndex]

  return (
    <div className="space-y-8">
      {/* 1. BANNER SECTION: Full width of the content container */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative">
          {activeBanner ? (
            <Link to={activeBanner.href} className="group block">
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-100">
                <img
                  src={activeBanner.imageUrl}
                  alt={activeBanner.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/35 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full max-w-xl p-5 sm:p-6">
                    <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                      Marketplace Picks
                    </div>
                    <div className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                      {activeBanner.title}
                    </div>
                    <p className="mt-1 text-sm text-white/90">{activeBanner.subtitle}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition group-hover:bg-slate-50">
                      Xem ngay
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path fill="currentColor" d="M10 17l5-5-5-5v10z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBannerIndex(i)}
                className={[
                  'h-2.5 w-2.5 rounded-full transition',
                  i === bannerIndex ? 'bg-white shadow-sm' : 'bg-white/40 hover:bg-white/70',
                ].join(' ')}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. BRAND STORY & CORE COMMITMENTS SECTION */}
      <section className="grid gap-6 lg:grid-cols-12 items-stretch">
        {/* Left Column: Brand Story Card */}
        <div className="lg:col-span-5 rounded-2xl border border-amber-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fef9f3 0%, #fdf0e0 100%)' }}>
          <div className="absolute right-0 top-0 -mr-12 -mt-12 h-36 w-36 rounded-full bg-amber-100/30 blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900 border border-amber-200">
              Về SachStore
            </span>
            <h2 className="text-xl font-extrabold text-stone-900 sm:text-2xl leading-snug">
              Nơi khởi đầu của những hành trình tri thức
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Khởi đầu từ niềm đam mê mãnh liệt với những trang giấy thơm mùi mực, <strong>SachStore</strong> được thành lập với sứ mệnh mang thế giới tri thức tinh tuyền nhất đến tay mọi người đọc.
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Chúng tôi tin rằng mỗi cuốn sách không chỉ là những dòng chữ, mà là một người bạn đồng hành, một người thầy dẫn lối mở ra thế giới mới. Sự an tâm và hành trình thưởng thức sách của bạn là niềm hạnh phúc lớn nhất của chúng tôi.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-800 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              📖
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Người sáng lập SachStore</div>
              <div className="text-[10px] text-stone-550">Gửi trọn tâm huyết vào từng trang sách</div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Core Commitments */}
        <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              ),
              title: 'Chính hãng 100%',
              desc: 'Hợp tác trực tiếp với các nhà xuất bản uy tín hàng đầu. Cam kết mọi đầu sách đều là bản in chính thức chất lượng cao.'
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
              desc: 'Đóng gói chuẩn quy trình chống va đập, bảo vệ mép sách. Giao hàng nhanh chóng và tin cậy đến tận tay bạn.'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              ),
              title: 'Thanh toán an toàn',
              desc: 'Hỗ trợ đa dạng cổng thanh toán tiện lợi (MoMo, ZaloPay, Thẻ ATM/Visa). Bảo mật thông tin giao dịch tối đa.'
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              ),
              title: 'Hỗ trợ tận tâm 24/7',
              desc: 'Đội ngũ tư vấn viên am hiểu sách luôn sẵn sàng hỗ trợ, lắng nghe và giải đáp mọi phản hồi của bạn.'
            }
          ].map((s, idx) => (
            <div key={idx} className="flex gap-4 rounded-2xl border border-amber-200/60 bg-white p-5 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-amber-800 bg-amber-50 border border-amber-100 shadow-sm">
                {s.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900 tracking-tight">{s.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-normal">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MAIN CONTENT: Grid layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <QuickCategoryStrip categories={categories} />

          <HomeSection
            title="Sách mới cập nhật"
            subtitle="Cập nhật gần đây • Nhiều ưu đãi hấp dẫn"
            items={home.sections.newest}
            viewAllHref="/books?sort=newest"
          />

          <HomeSection
            title="Sách xem nhiều nhất"
            subtitle="Top xu hướng • Dựa theo lượt xem"
            items={home.sections.mostViewed}
            viewAllHref="/books"
          />

          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Bộ sưu tập nổi bật</h2>
                <p className="text-sm text-slate-600">Chọn nhanh theo chủ đề</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {home.featuredCollections.map((col) => (
                <div
                  key={col.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{col.title}</div>
                      <div className="text-xs text-slate-500">{col.subtitle}</div>
                    </div>
                    <Link to="/news" className="text-xs font-semibold text-amber-800 hover:underline">
                      Xem thêm
                    </Link>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {col.items.slice(0, 4).map((b: Book) => (
                      <BookCard key={String(b.id)} book={b} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

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
          <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
        <Link to={viewAllHref} className="text-sm font-semibold text-amber-800 hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-3">
        {items.map((b) => (
          <BookCard key={String(b.id)} book={b} />
        ))}
      </div>
    </section>
  )
}

function QuickCategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Danh mục sách</div>
          <div className="text-xs text-slate-500">Chọn nhanh để lọc</div>
        </div>
        <Link to="/books" className="text-xs font-semibold text-amber-800 hover:underline">
          Tất cả danh mục
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={String(c.id)}
            to={`/books?categoryId=${encodeURIComponent(String(c.id))}`}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
