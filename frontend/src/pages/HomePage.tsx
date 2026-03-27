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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
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
                    <Link to="/news" className="text-xs font-semibold text-indigo-700 hover:underline">
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

        <HomeSidebar categories={categories} weeklyRanking={home.sections.weeklyRanking} news={home.news} />
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
        <Link to={viewAllHref} className="text-sm font-semibold text-indigo-700 hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
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
        <Link to="/books" className="text-xs font-semibold text-indigo-700 hover:underline">
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

