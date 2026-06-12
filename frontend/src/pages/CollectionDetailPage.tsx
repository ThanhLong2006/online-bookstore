import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mockBooks } from '../services/api/mockData'
import { BookCard } from '../components/books/BookCard'
import { formatVND } from '../utils/format'

const SHELVES_CONFIG: Record<string, { title: string; desc: string; icon: string; bg: string; border: string }> = {
  business: {
    title: 'Tinh Hoa Quản Trị',
    desc: 'Bí quyết vận hành doanh nghiệp, khởi nghiệp thành công và rèn luyện kỹ năng lãnh đạo xuất sắc từ những bộ óc kinh doanh vĩ đại.',
    icon: '💼',
    bg: 'bg-[#1A365D]', // Solid Navy
    border: 'border-slate-800'
  },
  tech: {
    title: 'Lập Trình Viên Tinh Nhuệ',
    desc: 'Tuyển tập sách hướng dẫn lập trình, tư duy viết code sạch, kiến trúc phần mềm đến các công nghệ tương lai như AI và Blockchain.',
    icon: '💻',
    bg: 'bg-[#5B21B6]', // Solid Purple
    border: 'border-purple-900/50'
  },
  fiction: {
    title: 'Văn Học Cực Phẩm',
    desc: 'Những tác phẩm văn học, tiểu thuyết, truyện trinh thám kinh điển vượt thời gian đem lại giá trị chiều sâu tinh thần quý báu.',
    icon: '✍️',
    bg: 'bg-[#9D174D]', // Solid Deep Pink
    border: 'border-pink-900/50'
  }
}

const SUB_TABS: Record<string, { id: string; name: string }[]> = {
  business: [
    { id: '', name: 'Tất cả sản phẩm' },
    { id: 'startup', name: 'Khởi nghiệp' },
    { id: 'leadership', name: 'Lãnh đạo' },
    { id: 'finance', name: 'Tài chính - Đầu tư' },
    { id: 'management', name: 'Quản lý vận hành' },
  ],
  tech: [
    { id: '', name: 'Tất cả sản phẩm' },
    { id: 'basic', name: 'Lập trình cơ bản' },
    { id: 'ai', name: 'AI & Machine Learning' },
    { id: 'architecture', name: 'Kiến trúc & Hệ thống' },
    { id: 'web3', name: 'Web3 & Blockchain' },
  ],
  fiction: [
    { id: '', name: 'Tất cả sản phẩm' },
    { id: 'novel', name: 'Tiểu thuyết' },
    { id: 'mystery', name: 'Trinh thám - Hình sự' },
    { id: 'classic', name: 'Văn học kinh điển' },
    { id: 'fantasy', name: 'Kỳ ảo & Viễn tưởng' },
  ],
}

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const shelfId = id?.toLowerCase() ?? 'business'
  const [activeTab, setActiveTab] = useState<string>('')
  const [visibleCount, setVisibleCount] = useState<number>(5)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

  const shelf = useMemo(() => {
    return SHELVES_CONFIG[shelfId] ?? SHELVES_CONFIG.business
  }, [shelfId])

  const subTabs = useMemo(() => {
    return SUB_TABS[shelfId] ?? SUB_TABS.business
  }, [shelfId])

  // Get books for this collection (featured + main list)
  const allCollectionBooks = useMemo(() => {
    // business -> business + self-help
    // tech -> tech
    // fiction -> fiction + kids
    if (shelfId === 'tech') {
      return mockBooks.filter(b => b.category?.id === 'tech')
    }
    if (shelfId === 'fiction') {
      return mockBooks.filter(b => b.category?.id === 'fiction' || b.category?.id === 'kids')
    }
    return mockBooks.filter(b => b.category?.id === 'business' || b.category?.id === 'self-help')
  }, [shelfId])

  // Featured books shown inside the colored banner
  const featuredBooks = useMemo(() => {
    return allCollectionBooks.slice(0, 4)
  }, [allCollectionBooks])

  // Main books list (filtered by category tab)
  const mainBooks = useMemo(() => {
    let list = [...allCollectionBooks]
    if (activeTab) {
      if (activeTab === 'startup') {
        list = list.filter(b => b.title.toLowerCase().includes('startup') || b.title.toLowerCase().includes('why'))
      } else if (activeTab === 'leadership') {
        list = list.filter(b => b.title.toLowerCase().includes('habits') || b.title.toLowerCase().includes('work'))
      } else if (activeTab === 'basic') {
        list = list.filter(b => b.title.toLowerCase().includes('javascript') || b.title.toLowerCase().includes('code'))
      } else if (activeTab === 'ai') {
        list = list.filter(b => b.title.toLowerCase().includes('gemini') || b.title.toLowerCase().includes('code'))
      } else {
        // Fallback slice differently for demo
        const idx = subTabs.findIndex(t => t.id === activeTab) || 1
        list = allCollectionBooks.slice(idx % allCollectionBooks.length)
      }
    }
    // Make sure we have enough items by duplicating if small for demo look
    if (list.length > 0 && list.length < 5) {
      list = [...list, ...list, ...list].slice(0, 8)
    }
    return list
  }, [allCollectionBooks, activeTab, subTabs])

  // Bottom recommendations (green background area - expanded to 10 books across 2 rows)
  const recommendations = useMemo(() => {
    // Recommend books not in this category
    const currentCats = shelfId === 'tech' ? ['tech'] : shelfId === 'fiction' ? ['fiction', 'kids'] : ['business', 'self-help']
    let filtered = mockBooks.filter(b => !currentCats.includes(String(b.category?.id ?? '')))
    
    // Fill from general mockBooks if not enough
    if (filtered.length < 10) {
      const rest = mockBooks.filter(b => !filtered.some(f => f.id === b.id))
      filtered = [...filtered, ...rest]
    }
    
    // Duplicate if needed for visual rendering
    if (filtered.length > 0 && filtered.length < 10) {
      filtered = [...filtered, ...filtered, ...filtered].slice(0, 10)
    }
    
    return filtered.slice(0, 10)
  }, [shelfId])

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount(prev => prev + 5)
      setIsLoadingMore(false)
    }, 400)
  }

  const displayedBooks = mainBooks.slice(0, visibleCount)

  return (
    <div className="space-y-8">
      {/* 1. Giant Banner Header mimicking the second screenshot */}
      <div className={`relative overflow-hidden rounded-xl ${shelf.bg} p-6 sm:p-8 text-white shadow-md border ${shelf.border} flex flex-col lg:flex-row gap-6 items-center justify-between`}>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        {/* Banner Details */}
        <div className="relative z-10 space-y-3 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
            <span>{shelf.icon}</span> TỦ SÁCH CHUYÊN ĐỀ
          </span>
          <h1 className="text-2xl font-black tracking-tight sm:text-4.5xl uppercase leading-none">{shelf.title}</h1>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">{shelf.desc}</p>
        </div>

        {/* Featured book row inside the header container (Picture 2 style) */}
        <div className="w-full lg:w-auto overflow-x-auto pb-2 flex gap-3 shrink-0 scrollbar-thin">
          {featuredBooks.map((b) => (
            <Link 
              key={`feat-${b.id}`}
              to={`/books/${b.id}`} 
              className="w-[140px] shrink-0 bg-white rounded-lg p-2.5 shadow-md hover:-translate-y-1 transition duration-200 text-slate-800 flex flex-col justify-between"
            >
              <div className="aspect-[3/4] w-full flex items-center justify-center p-1 bg-slate-50 rounded mb-2">
                <img src={b.coverUrl} alt={b.title} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="space-y-0.5">
                <div className="line-clamp-1 text-[11px] font-extrabold text-slate-900 leading-tight">{b.title}</div>
                <div className="text-[10px] text-[#C2410C] font-black">{formatVND(b.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Sub-categories Navigation Tabs */}
      <div className="rounded-xl border border-[#E6E6E6] bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-1.5">
          {subTabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setVisibleCount(5) // Reset count
                }}
                className={`h-9 px-4 rounded-lg text-xs font-bold transition-all duration-150 border ${
                  isActive
                    ? 'border-[#C2410C] text-[#C2410C] bg-white dark:bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-650 hover:text-[#C2410C] dark:text-slate-350'
                }`}
              >
                {tab.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Grid of Main Books */}
      <section className="space-y-6">
        <div className="border-b border-[#E6E6E6] pb-3 dark:border-slate-800">
          <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900 dark:text-[#F8FAFC]">Danh mục sản phẩm</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {displayedBooks.map((b) => (
            <BookCard key={b.id} book={b} showExclusiveBadge={b.price > 220000} />
          ))}
        </div>

        {/* Xem Thêm Button (Picture 2 style) */}
        {mainBooks.length > visibleCount && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="h-10 px-8 rounded-lg border border-[#C2410C] text-[#C2410C] font-black text-xs hover:bg-[#C2410C] hover:text-white disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-200"
            >
              {isLoadingMore ? 'Đang tải...' : 'Xem Thêm'}
            </button>
          </div>
        )}
      </section>

      {/* 4. Recommendations shelf at the bottom as shown in screenshot 2 (Green Banner) */}
      <section className="overflow-hidden rounded-xl border border-[#A2D9CE]/40 bg-[#E8F8F5]/60 dark:border-slate-800 dark:bg-slate-900/40">
        {/* Curved Green Banner Header */}
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
    </div>
  )
}
