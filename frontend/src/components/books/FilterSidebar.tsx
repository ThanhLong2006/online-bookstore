import { useState, useMemo } from 'react'
import type { Category } from '../../types/book'

export function FilterSidebar({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  sort,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onClear,
}: {
  categories: Category[]
  selectedCategory: string
  minPrice: number
  maxPrice: number
  sort: 'newest' | 'price_asc' | 'price_desc'
  onCategoryChange: (categoryId: string) => void
  onPriceChange: (field: 'min' | 'max', value: number) => void
  onSortChange: (sort: 'newest' | 'price_asc' | 'price_desc') => void
  onClear: () => void
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-20 self-start">
      <div className="rounded-lg border border-[#E6E6E6] bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Bộ lọc tìm kiếm</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Chọn chủ đề & giá</div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 text-xs font-bold text-[#1A365D] hover:bg-slate-50 transition dark:text-blue-400 dark:hover:bg-slate-800"
          >
            Xoá lọc
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Thể loại sách</div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onCategoryChange('')}
                className={[
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 border-l-4',
                  !selectedCategory
                    ? 'bg-[#1A365D]/10 text-[#1A365D] shadow-sm border-[#1A365D] dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-[#1A365D] border-transparent dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                ].join(' ')}
              >
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                  Tất cả danh mục
                </span>
              </button>

              {categories.map((category) => {
                const isActive = String(selectedCategory) === String(category.id);
                return (
                  <button
                    key={String(category.id)}
                    type="button"
                    onClick={() => onCategoryChange(String(category.id))}
                    className={[
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 border-l-4',
                      isActive
                        ? 'bg-[#1A365D]/10 text-[#1A365D] shadow-sm border-[#1A365D] dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500'
                        : 'text-slate-650 hover:bg-slate-55 hover:text-[#1A365D] border-transparent dark:text-slate-350 dark:hover:bg-slate-800 dark:hover:text-white'
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon id={String(category.id)} name={category.name} />
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Khoảng giá</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {minPrice > 0 || maxPrice > 0
                  ? `${minPrice ? minPrice.toLocaleString('vi-VN') : '0'} → ${maxPrice ? maxPrice.toLocaleString('vi-VN') : '∞'}`
                  : 'Tất cả'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="sr-only">Giá từ</span>
                <input
                  inputMode="numeric"
                  value={minPrice ? String(minPrice) : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, '')
                    onPriceChange('min', Number(raw || 0))
                  }}
                  placeholder="Từ VNĐ"
                  className="w-full rounded-lg border border-[#E6E6E6] bg-white px-3 py-1.5 text-xs outline-none transition focus:border-[#1A365D] focus:ring-1 focus:ring-[#1A365D] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
              <label className="block">
                <span className="sr-only">Giá đến</span>
                <input
                  inputMode="numeric"
                  value={maxPrice ? String(maxPrice) : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, '')
                    onPriceChange('max', Number(raw || 0))
                  }}
                  placeholder="Đến VNĐ"
                  className="w-full rounded-lg border border-[#E6E6E6] bg-white px-3 py-1.5 text-xs outline-none transition focus:border-[#1A365D] focus:ring-1 focus:ring-[#1A365D] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Sắp xếp theo</div>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
              className="w-full rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 text-xs outline-none transition focus:border-[#1A365D] focus:ring-1 focus:ring-[#1A365D] dark:border-slate-700 dark:bg-slate-955 dark:text-slate-100"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  )
}

function CategoryIcon({ id, name }: { id: string; name: string }) {
  const [error, setError] = useState(false)

  // Mapping from category ID to actual uploaded filename
  const CATEGORY_ICON_MAP: Record<string, string> = {
    fiction: 'book.png',
    kids: 'game.png',
    business: 'financial-profit.png',
    'self-help': 'idea.png',
    tech: 'desktop-computer.png',
  }

  // Default fallback SVGs
  const fallbackSvg = useMemo(() => {
    switch (id) {
      case 'fiction':
        return <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-500 shadow-sm" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5a2.5 2.5 0 0 1-2.5-2.5z"/></svg>;
      case 'kids':
        return <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-500 shadow-sm" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>;
      case 'business':
        return <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-500 shadow-sm" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
      case 'self-help':
        return <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-500 shadow-sm" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
      case 'tech':
        return <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-500 shadow-sm" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
      default:
        return <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500 shadow-sm" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5a2.5 2.5 0 0 1-2.5-2.5z"/></svg>;
    }
  }, [id])

  if (error) {
    return fallbackSvg
  }

  const iconFile = CATEGORY_ICON_MAP[id] || `${id}.png`

  return (
    <img
      src={`/icons/${iconFile}`}
      alt={name}
      onError={() => setError(true)}
      className="h-5 w-5 object-contain shrink-0"
    />
  )
}
