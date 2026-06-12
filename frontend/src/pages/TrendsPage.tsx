import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mockBooks } from '../services/api/mockData'
import { BookCard } from '../components/books/BookCard'
import type { Book } from '../types/book'

const CATEGORY_TABS = [
  { id: '', name: 'All' },
  { id: 'comics', name: 'Manga - Comics' },
  { id: 'self-help', name: 'Psychology - Life Skills' },
  { id: 'fiction', name: 'Literature' },
  { id: 'foreign', name: 'Language Books' },
  { id: 'kids', name: 'Children' },
  { id: 'tech', name: 'Dictionaries & Languages' },
  { id: 'business', name: 'Economy' },
  { id: 'education', name: 'Textbook - Reference' },
]

export function TrendsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCat = searchParams.get('categoryId') ?? ''
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'price_asc' | 'price_desc'>('trending')

  const setSelectedCat = (id: string) => {
    const next = new URLSearchParams(searchParams)
    if (!id) next.delete('categoryId')
    else next.set('categoryId', id)
    setSearchParams(next)
  }

  const filteredBooks = useMemo(() => {
    let list = [...mockBooks]
    if (selectedCat) {
      list = list.filter(b => b.category?.id === selectedCat)
    }
    
    // Sort
    if (sortBy === 'trending') {
      list.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
    } else if (sortBy === 'newest') {
      const time = (b: Book) => b.createdAt ? new Date(b.createdAt).getTime() : 0
      list.sort((a, b) => time(b) - time(a))
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    }
    
    return list
  }, [selectedCat, sortBy])

  return (
    <div className="space-y-6">
      {/* Pink Header Banner resembling the screenshot 1 */}
      <div className="rounded-xl border border-pink-100 bg-[#FCDDEC]/30 p-5 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#E11D48] text-white shadow-sm text-lg font-bold">
            📈
          </span>
          <div>
            <h1 className="text-xl font-black text-[#212121] dark:text-[#F8FAFC] tracking-tight uppercase">Shopping Trends</h1>
            <p className="text-xs text-slate-550 dark:text-slate-400">Những tựa sách đang đứng đầu xu hướng tìm kiếm và mua sắm trong tuần</p>
          </div>
        </div>
      </div>

      {/* Tabs and Filters Container */}
      <div className="rounded-xl border border-[#E6E6E6] bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Category Tabs inline with active orange border like screenshot */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3 dark:border-slate-800">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCat === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCat(tab.id)}
                className={`h-9 px-4 rounded-lg text-xs font-bold transition-all duration-150 border ${
                  isActive
                    ? 'border-[#C2410C] text-[#C2410C] bg-white dark:bg-slate-900 shadow-sm'
                    : 'border-transparent text-slate-600 hover:text-[#C2410C] dark:text-slate-350'
                }`}
              >
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* Sort select align right */}
        <div className="flex items-center justify-end gap-2.5">
          <span className="text-xs font-bold text-slate-550 dark:text-slate-400">Sort by :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-[#E6E6E6] bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none transition focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] dark:border-slate-700 dark:bg-slate-955 dark:text-slate-100"
          >
            <option value="trending">Trending</option>
            <option value="newest">Mới cập nhật</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Grid Display (Grid: 5 columns on Desktop, 3 on Tablet, 2 on Mobile) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {filteredBooks.map((b) => (
          <BookCard 
            key={b.id} 
            book={b} 
            showTrendingBadge={true} 
            showExclusiveBadge={b.price > 200000}
          />
        ))}
      </div>
    </div>
  )
}
