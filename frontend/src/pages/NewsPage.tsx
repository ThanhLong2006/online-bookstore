import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { mockGetNews } from '../services/api/mockData'

const NEWS_CATEGORIES = [
  { id: 'Tất cả', name: 'Tất cả' },
  { id: 'Khai trương', name: 'Khai trương Chi nhánh' },
  { id: 'Sự kiện', name: 'Sự kiện nổi bật' },
  { id: 'Sách mới', name: 'Giới thiệu sách mới' },
  { id: 'Cộng đồng', name: 'Hoạt động cộng đồng' },
  { id: 'Tin nội bộ', name: 'Tin nội bộ SachStore' },
  { id: 'Cẩm nang', name: 'Cẩm nang độc giả' },
]

export function NewsPage() {
  const allNews = mockGetNews()
  const [activeTab, setActiveTab] = useState<string>('Tất cả')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [email, setEmail] = useState('')

  const itemsPerPage = 6

  // Filter news based on selected category tag
  const filteredNews = useMemo(() => {
    if (activeTab === 'Tất cả') return allNews
    return allNews.filter((n) => n.tag === activeTab)
  }, [activeTab, allNews])

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage))

  // Paged news items
  const pagedNews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredNews.slice(start, start + itemsPerPage)
  }, [filteredNews, currentPage])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      alert('Vui lòng nhập email hợp lệ')
      return
    }
    alert('Đăng ký nhận bản tin thành công!')
    setEmail('')
  }

  const tagColors: Record<string, { bg: string; text: string; border: string }> = {
    'Thông báo': { bg: 'bg-blue-50/80', text: 'text-blue-700', border: 'border-blue-200' },
    'Tin tức': { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Khuyến mãi': { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200' },
    'Khai trương': { bg: 'bg-indigo-50/80', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Sự kiện': { bg: 'bg-rose-50/80', text: 'text-rose-700', border: 'border-rose-200' },
    'Sách mới': { bg: 'bg-purple-50/80', text: 'text-purple-700', border: 'border-purple-200' },
    'Cộng đồng': { bg: 'bg-teal-50/80', text: 'text-teal-700', border: 'border-teal-200' },
    'Tin nội bộ': { bg: 'bg-sky-50/80', text: 'text-sky-700', border: 'border-sky-200' },
    'Cẩm nang': { bg: 'bg-orange-50/80', text: 'text-orange-700', border: 'border-orange-200' },
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null
    return (
      <div className="flex items-center justify-center gap-1.5 py-6 border-t border-slate-100 dark:border-slate-800">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          className="h-8 w-8 rounded border border-[#E6E6E6] bg-white text-xs font-bold text-slate-650 disabled:opacity-40 hover:border-[#1A365D] dark:bg-slate-900 dark:border-slate-800"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1
          const isActive = p === currentPage
          return (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`h-8 w-8 rounded border text-xs font-bold transition ${
                isActive
                  ? 'bg-[#1A365D] border-[#1A365D] text-white shadow-sm'
                  : 'bg-white border-[#E6E6E6] text-slate-650 hover:border-[#1A365D] dark:bg-slate-900 dark:border-slate-800'
              }`}
            >
              {p}
            </button>
          )
        })}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          className="h-8 w-8 rounded border border-[#E6E6E6] bg-white text-xs font-bold text-slate-650 disabled:opacity-40 hover:border-[#1A365D] dark:bg-slate-900 dark:border-slate-800"
        >
          &gt;
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 1. Hero Cover Banner resembling the screenshot */}
      <div className="relative overflow-hidden rounded-2xl h-[220px] sm:h-[260px] flex items-center justify-center text-center text-white shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80" 
          alt="News & Events Banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/85" />
        
        <div className="relative z-10 space-y-2.5 px-6">
          <h1 className="text-2.5xl font-black tracking-tight sm:text-4xl uppercase">Tin tức & Sự kiện</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Kết nối tri thức – Đồng hành cùng văn hóa đọc. Theo dõi các hoạt động cộng đồng, sự kiện ký tặng và cẩm nang bổ ích tại SachStore.
          </p>
        </div>
      </div>

      {/* 2. Horizontal Menu Category Filters (Fahasa style) */}
      <div className="rounded-xl border border-[#E6E6E6] bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {NEWS_CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id)
                  setCurrentPage(1) // Reset page
                }}
                className={`h-9 px-4 rounded-lg text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-[#1A365D] border-[#1A365D] text-white shadow-sm'
                    : 'border-transparent text-slate-650 hover:text-[#1A365D] dark:text-slate-355'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Grid of News Cards */}
      {filteredNews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700 bg-white dark:bg-slate-900">
          <span className="text-4xl">🔍</span>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-200">Không tìm thấy tin tức nào</h3>
          <p className="mt-1 text-xs text-slate-500">Chưa có bài viết nào thuộc danh mục này.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pagedNews.map((n) => (
              <Link
                key={n.id}
                to={`/news/${n.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#E6E6E6] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={n.coverUrl}
                    alt={n.title}
                    className="h-full w-full object-cover transition duration-550 group-hover:scale-103"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col flex-1 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tagColors[n.tag]?.bg} ${tagColors[n.tag]?.text} ${tagColors[n.tag]?.border}`}>
                      {n.tag}
                    </span>
                    <span className="text-xs text-slate-450 font-semibold">{n.date}</span>
                  </div>
                  <h3 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#1A365D] dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {n.title}
                  </h3>
                  <p className="line-clamp-3 text-xs text-slate-500 leading-relaxed flex-1">
                    {n.excerpt}
                  </p>
                  <div className="pt-2.5 flex items-center gap-1.5 text-xs font-bold text-[#1A365D] dark:text-blue-400">
                    Xem chi tiết <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 4. Numeric Pagination at the bottom */}
          {renderPagination()}
        </div>
      )}

      {/* 5. Subscribe Newsletter Box (Tiếng Việt) */}
      <div className="rounded-xl bg-[#7F8C8D] p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-400/20">
        <div className="flex items-center gap-3">
          <span className="text-xl">✉️</span>
          <span className="text-sm font-black uppercase tracking-wider">Đăng ký nhận bản tin</span>
        </div>
        <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md items-center gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập địa chỉ email của bạn..."
            className="flex-1 rounded-lg border border-transparent bg-white px-4 py-2 text-xs text-slate-800 outline-none focus:border-[#1A365D]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#C2410C] px-5 py-2 text-xs font-bold text-white hover:bg-[#A1350A] transition shadow-sm shrink-0"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  )
}
