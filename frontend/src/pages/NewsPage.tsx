import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { mockGetNews } from '../services/api/mockData'
import toast from 'react-hot-toast'

type CategoryTag = 'Tất cả' | 'Thông báo' | 'Tin tức' | 'Khuyến mãi'

export function NewsPage() {
  const allNews = mockGetNews()
  const [activeTab, setActiveTab] = useState<CategoryTag>('Tất cả')
  const [email, setEmail] = useState('')

  // Filter news articles based on selected category tag
  const filteredNews = useMemo(() => {
    if (activeTab === 'Tất cả') return allNews
    return allNews.filter((n) => n.tag === activeTab)
  }, [activeTab, allNews])

  // Featured article is the first one in the list (or the first of the filtered list)
  const featuredArticle = useMemo(() => {
    return filteredNews[0] || null
  }, [filteredNews])

  // The rest of the articles go into the grid
  const remainingNews = useMemo(() => {
    if (!featuredArticle) return []
    return filteredNews.slice(1)
  }, [filteredNews, featuredArticle])

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Vui lòng nhập email hợp lệ')
      return
    }
    toast.success('Đăng ký nhận bản tin thành công!')
    setEmail('')
  }

  const tagColors: Record<string, { bg: string; text: string; border: string }> = {
    'Thông báo': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Tin tức': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Khuyến mãi': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  }

  return (
    <div className="space-y-10">
      {/* Header section with cover gradient */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 p-8 md:p-12 text-stone-800 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #fef9f3 0%, #fdf0e0 100%)' }}>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-150/60 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200">
            📰 Góc Đọc Sách
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">Tin tức & Khuyến mãi</h1>
          <p className="text-base text-stone-600 leading-relaxed">
            Cập nhật các chương trình khuyến mãi lớn nhất, thông báo lịch làm việc của hệ thống và các nội dung phân tích review sách hay tuần này.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
        {(['Tất cả', 'Tin tức', 'Khuyến mãi', 'Thông báo'] as CategoryTag[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all border ${
              activeTab === tab
                ? 'text-white border-transparent shadow-sm'
                : 'bg-white text-stone-650 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
            }`}
            style={activeTab === tab ? { background: 'linear-gradient(135deg, #8b4513, #a0522d)' } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      {filteredNews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 py-16 text-center">
          <span className="text-4xl">🔍</span>
          <h3 className="mt-4 text-base font-bold text-stone-900">Không tìm thấy tin tức</h3>
          <p className="mt-1 text-sm text-stone-550">Chưa có bài viết nào thuộc danh mục này.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Post (Banner Layout) */}
          {featuredArticle && (
            <Link
              to={`/news/${featuredArticle.id}`}
              className="group grid overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm transition hover:shadow-md lg:grid-cols-12"
            >
              <div className="aspect-[16/9] overflow-hidden bg-stone-100 lg:col-span-7 lg:aspect-auto lg:h-[360px]">
                <img
                  src={featuredArticle.coverUrl}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8 lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-0.5 text-xs font-bold border ${tagColors[featuredArticle.tag]?.bg} ${tagColors[featuredArticle.tag]?.text} ${tagColors[featuredArticle.tag]?.border}`}>
                    {featuredArticle.tag}
                  </span>
                  <span className="text-xs text-stone-400 font-semibold">•</span>
                  <span className="text-xs text-stone-500 font-semibold">{featuredArticle.date}</span>
                </div>
                <h2 className="text-xl font-bold text-stone-900 leading-snug group-hover:text-amber-900 transition-colors md:text-2xl">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 md:line-clamp-4">
                  {featuredArticle.excerpt}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-sm font-bold transition-all group-hover:translate-x-1" style={{ color: '#8b4513' }}>
                  Đọc bài viết <span className="text-base">→</span>
                </div>
              </div>
            </Link>
          )}

          {/* Remaining Posts Grid */}
          {remainingNews.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {remainingNews.map((n) => (
                <Link
                  key={n.id}
                  to={`/news/${n.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                    <img
                      src={n.coverUrl}
                      alt={n.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tagColors[n.tag]?.bg} ${tagColors[n.tag]?.text} ${tagColors[n.tag]?.border}`}>
                        {n.tag}
                      </span>
                      <span className="text-xs text-stone-400">{n.date}</span>
                    </div>
                    <h3 className="line-clamp-2 text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                      {n.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-stone-500 leading-relaxed flex-1">
                      {n.excerpt}
                    </p>
                    <div className="pt-2 flex items-center gap-1 text-xs font-bold" style={{ color: '#8b4513' }}>
                      Xem chi tiết <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subscribe Newsletter Section */}
      <div className="rounded-3xl border border-amber-200 p-8 text-center space-y-4 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #fdf0e0 0%, #fdf5eb 100%)' }}>
        <div className="max-w-md mx-auto space-y-3">
          <span className="text-3xl">✉️</span>
          <h3 className="text-lg font-bold text-stone-900">Đăng ký nhận thông tin mới nhất</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Nhận thông tin về các đầu sách mới nhập kho nhanh nhất, mã voucher ưu đãi dành riêng cho thành viên đã đăng ký.
          </p>
          <form onSubmit={handleSubscribe} className="pt-2 flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn..."
              className="flex-1 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-amber-400 text-stone-800"
            />
            <button
              type="submit"
              className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
