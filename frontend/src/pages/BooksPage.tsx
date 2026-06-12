import { useEffect, useState, useMemo, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookCard } from '../components/books/BookCard'
import { FilterSidebar } from '../components/books/FilterSidebar'
import { SearchBar } from '../components/ui/SearchBar'
import { getBooks } from '../services/api/books'
import { getCategories } from '../services/api/categories'
import { mockBooks } from '../services/api/mockData'
import type { Book } from '../types/book'
import type { Category } from '../types/book'

export function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1') || 1
  const categoryId = searchParams.get('categoryId') ?? ''
  const sort = (searchParams.get('sort') as 'newest' | 'price_asc' | 'price_desc' | null) ?? 'newest'
  const minPrice = Number(searchParams.get('minPrice') ?? '') || 0
  const maxPrice = Number(searchParams.get('maxPrice') ?? '') || 0
  const pageSize = Number(searchParams.get('pageSize') ?? '12') || 12
  const [searchTerm, setSearchTerm] = useState(q)
  const [isSeoExpanded, setIsSeoExpanded] = useState(false)

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    setSearchTerm(q)
  }, [q])

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true
    setLoading(true)
    setError(null)

    getBooks(
      {
        q,
        page,
        pageSize,
        sort,
        categoryId: categoryId || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      },
      controller.signal,
    )
      .then((res) => {
        if (!mounted) return
        setItems(res.items ?? [])
        setTotal(res.total ?? 0)
      })
      .catch((e) => {
        if (!mounted) return
        if (controller.signal.aborted || e?.name === 'AbortError') return
        setError(typeof e?.message === 'string' ? e.message : 'Không tải được dữ liệu')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
      controller.abort()
    }
  }, [categoryId, maxPrice, minPrice, page, q, sort, pageSize])

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true
    getCategories(controller.signal)
      .then((res) => mounted && setCategories(res ?? []))
      .catch(() => mounted && setCategories([]))
    return () => {
      mounted = false
      controller.abort()
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Recommendations for this catalog page (5 items shown above newsletter)
  const recommendations = useMemo(() => {
    // Recommend books not in this category to show diversity
    const list = mockBooks.filter(b => categoryId ? String(b.category?.id) !== String(categoryId) : true)
    return list.slice(0, 5)
  }, [categoryId])

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (!value) next.delete(key)
    else next.set(key, value)
    next.delete('page') // reset page on filter/sort/size changes
    setSearchParams(next)
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setParam('q', searchTerm.trim())
  }

  function clearFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('categoryId')
    next.delete('minPrice')
    next.delete('maxPrice')
    next.delete('sort')
    next.delete('page')
    next.delete('pageSize')
    setSearchParams(next)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return (
      <div className="flex items-center justify-center gap-1.5 py-6 border-t border-slate-100 dark:border-slate-800">
        <button
          disabled={page <= 1}
          onClick={() => setParam('page', String(page - 1))}
          className="h-8 w-8 rounded border border-[#E6E6E6] bg-white text-xs font-bold text-slate-650 disabled:opacity-40 hover:border-[#1A365D] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
          aria-label="Trang trước"
        >
          &lt;
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => setParam('page', '1')}
              className={`h-8 w-8 rounded border text-xs font-bold transition ${
                page === 1
                  ? 'bg-[#1A365D] border-[#1A365D] text-white'
                  : 'bg-white border-[#E6E6E6] text-slate-600 hover:border-[#1A365D] dark:bg-slate-900 dark:border-slate-800'
              }`}
            >
              1
            </button>
            {start > 2 && <span className="text-xs text-slate-400 px-1">...</span>}
          </>
        )}

        {pages.map((p) => {
          const isActive = p === page
          return (
            <button
              key={p}
              onClick={() => setParam('page', String(p))}
              className={`h-8 w-8 rounded border text-xs font-bold transition ${
                isActive
                  ? 'bg-[#1A365D] border-[#1A365D] text-white shadow-sm'
                  : 'bg-white border-[#E6E6E6] text-slate-650 hover:border-[#1A365D] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {p}
            </button>
          )
        })}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-xs text-slate-400 px-1">...</span>}
            <button
              onClick={() => setParam('page', String(totalPages))}
              className={`h-8 w-8 rounded border text-xs font-bold transition ${
                page === totalPages
                  ? 'bg-[#1A365D] border-[#1A365D] text-white'
                  : 'bg-white border-[#E6E6E6] text-slate-605 hover:border-[#1A365D] dark:bg-slate-900 dark:border-slate-800'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => setParam('page', String(page + 1))}
          className="h-8 w-8 rounded border border-[#E6E6E6] bg-white text-xs font-bold text-slate-650 disabled:opacity-40 hover:border-[#1A365D] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
          aria-label="Trang sau"
        >
          &gt;
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Category Sidebar */}
      <FilterSidebar
        categories={categories}
        selectedCategory={categoryId}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
        onCategoryChange={(nextCategory) => setParam('categoryId', nextCategory)}
        onPriceChange={(field, value) => setParam(field === 'min' ? 'minPrice' : 'maxPrice', value ? String(value) : '')}
        onSortChange={(nextSort) => setParam('sort', nextSort)}
        onClear={clearFilters}
      />

      <div className="space-y-6">
        {/* Top bar filter & sort (Picture 3 style) */}
        <div className="rounded-xl border border-[#E6E6E6] bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 font-medium mr-1">Sắp xếp theo:</span>
            {[
              { id: 'newest', name: 'Mới nhất' },
              { id: 'price_asc', name: 'Giá tăng dần' },
              { id: 'price_desc', name: 'Giá giảm dần' },
            ].map((opt) => {
              const isActive = sort === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setParam('sort', opt.id)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    isActive
                      ? 'bg-[#1A365D] border-[#1A365D] text-white shadow-sm'
                      : 'bg-white border-[#E6E6E6] hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-850'
                  }`}
                >
                  {opt.name}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Search Input bar */}
            <div className="w-full sm:w-auto">
              <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onSubmit={handleSearchSubmit} />
            </div>

            {/* Display products per page */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-450">Hiển thị:</span>
              <select
                value={String(pageSize)}
                onChange={(e) => setParam('pageSize', e.target.value)}
                className="rounded-lg border border-[#E6E6E6] bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#1A365D] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="12">12 sản phẩm</option>
                <option value="24">24 sản phẩm</option>
                <option value="36">36 sản phẩm</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4-column catalog grid on Desktop */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded-lg border border-[#E6E6E6] bg-white dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-[#E6E6E6] bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            Không tìm thấy cuốn sách nào khớp với bộ lọc của bạn.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((b) => (
              <BookCard key={String(b.id)} book={b} />
            ))}
          </div>
        )}

        {/* Numeric Pagination */}
        {renderPagination()}

        {/* Gợi ý cho bạn Section (Curved Green Banner style) */}
        <section className="overflow-hidden rounded-xl border border-[#A2D9CE]/40 bg-[#E8F8F5]/60 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-center text-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-1.5 relative z-10">
              <span>✦ ✦</span> Gợi ý cho bạn <span>✦ ✦</span>
            </h2>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {recommendations.map((b) => (
                <BookCard key={`rec-${b.id}`} book={b} />
              ))}
            </div>
          </div>
        </section>

        {/* Đăng ký Nhận Bản Tin Box */}
        <div className="rounded-xl bg-[#7F8C8D] p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-400/20">
          <div className="flex items-center gap-3">
            <span className="text-xl">✉️</span>
            <span className="text-sm font-black uppercase tracking-wider">Đăng ký nhận bản tin</span>
          </div>
          <form 
            onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận bản tin!') }} 
            className="flex w-full md:w-auto max-w-md items-center gap-2"
          >
            <input
              type="email"
              required
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

        {/* Collapsible SEO Catalogue Info Block */}
        <div className="rounded-xl border border-[#E6E6E6] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className={isSeoExpanded ? '' : 'max-h-[160px] overflow-hidden relative'}>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              {categoryId === 'fiction' ? 'Thông tin danh mục sách tiểu thuyết' : 'Thông tin thư mục sách SachStore'}
            </h3>
            <div className="mt-3 text-xs text-slate-650 dark:text-slate-400 space-y-3 leading-relaxed">
              <p>
                Sách từ lâu đã trở thành một nét văn hóa đọc bổ ích và không thể thiếu đối với độc giả tại Việt Nam và trên toàn thế giới. Hơn cả những câu chuyện được kể bằng ngôn từ, mỗi cuốn sách là một cánh cửa mở ra thế giới tri thức mới, giúp người đọc đắm chìm vào các bài học sâu sắc và đa dạng cung bậc cảm xúc của cuộc sống. Tại SachStore, chúng tôi luôn cập nhật nhanh nhất danh mục sản phẩm phong phú từ các tác phẩm mới xuất bản cho đến các ấn bản kinh điển vượt thời gian.
              </p>
              <p>
                Kho sách của chúng tôi vô cùng đa dạng, hội tụ đầy đủ các thể loại từ tiểu thuyết văn học kinh điển, tác phẩm hiện đại, truyện trinh thám ly kỳ, sách lãng mạn, đến sách phát triển bản thân, kỹ năng sống, kinh tế doanh nghiệp và tài liệu hướng dẫn công nghệ. Sự phong phú này giúp SachStore trở thành một địa chỉ mua sắm tin cậy cho những ai đam mê khám phá thế giới tri thức rộng lớn.
              </p>
              
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Phân loại các dòng sách tại SachStore</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Sách văn học kinh điển:</strong> Những tác phẩm được coi là tượng đài văn học, khẳng định giá trị qua nhiều thế hệ như Sapiens, Giết con chim nhại, Một chín tám tư (1984).</li>
                <li><strong>Tiểu thuyết hiện đại & Phát triển:</strong> Phản ánh nhịp sống đương đại với ngôn ngữ gần gũi, đa dạng chủ đề và khám phá những khía cạnh sâu sắc của con người.</li>
                <li><strong>Trinh thám & Bí ẩn:</strong> Dành cho độc giả yêu thích cảm giác hồi hộp, các tình tiết bất ngờ và logic suy luận sắc bén qua các tập truyện Sherlock Holmes, Percy Jackson.</li>
                <li><strong>Kỹ năng sống & Phát triển bản thân:</strong> Những cẩm nang thực hành thực tế giúp bạn tối ưu hóa thói quen, rèn luyện tư duy và kỷ luật bản thân như Atomic Habits, Đắc nhân tâm.</li>
                <li><strong>Khoa học viễn tưởng & Công nghệ:</strong> Nơi cập nhật các kiến thức công nghệ hiện đại phục vụ học tập và làm việc như Clean Code, JavaScript, AI và phát triển phần mềm chuyên sâu.</li>
              </ul>

              <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Tại sao nên mua sách tại SachStore?</h4>
              <ul className="list-decimal pl-5 space-y-1">
                <li><strong>Danh mục sách khổng lồ, cập nhật liên tục:</strong> Hàng ngàn đầu sách thuộc nhiều chủ đề được bổ sung hàng tuần.</li>
                <li><strong>Sách chính hãng, đảm bảo chất lượng:</strong> Hợp tác trực tiếp với các nhà xuất bản uy tín, cam kết sách in chất lượng cao, không có sách giả.</li>
                <li><strong>Nhiều ưu đãi và khuyến mãi hấp dẫn:</strong> Các chương trình giảm giá giờ vàng, Flash Sale và đặc quyền tích điểm dành riêng cho hội viên.</li>
                <li><strong>Mua sắm trực tuyến tiện lợi:</strong> Giao diện trực quan, bảo mật thanh toán tối đa cùng hệ thống đóng gói chuyên nghiệp chống va đập, bảo vệ mép sách tối ưu.</li>
              </ul>
            </div>
            
            {!isSeoExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent dark:from-slate-900 pointer-events-none" />
            )}
          </div>
          
          <div className="flex justify-center border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSeoExpanded(!isSeoExpanded)}
              className="text-xs font-black text-[#1A365D] hover:text-[#C2410C] transition dark:text-blue-400"
            >
              {isSeoExpanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
