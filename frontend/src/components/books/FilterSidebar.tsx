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
    <aside className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Bộ lọc</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Thể loại & giá</div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Xoá lọc
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Thể loại</div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onCategoryChange('')}
                className={[
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200',
                  !selectedCategory
                    ? 'bg-amber-100/80 text-amber-900 shadow-sm border-l-4 border-amber-800'
                    : 'text-stone-700 hover:bg-amber-50/50 hover:text-amber-900 border-l-4 border-transparent'
                ].join(' ')}
              >
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                  Tất cả danh mục
                </span>
              </button>
              
              {categories.map((category) => {
                const isActive = String(selectedCategory) === String(category.id);
                let icon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5a2.5 2.5 0 0 1-2.5-2.5z"/></svg>;
                if (category.id === 'fiction') {
                  icon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5a2.5 2.5 0 0 1-2.5-2.5z"/></svg>;
                } else if (category.id === 'kids') {
                  icon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>;
                } else if (category.id === 'business') {
                  icon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
                } else if (category.id === 'self-help') {
                  icon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
                } else if (category.id === 'tech') {
                  icon = <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
                }

                return (
                  <button
                    key={String(category.id)}
                    type="button"
                    onClick={() => onCategoryChange(String(category.id))}
                    className={[
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-amber-100/80 text-amber-900 shadow-sm border-l-4 border-amber-800'
                        : 'text-stone-700 hover:bg-amber-50/50 hover:text-amber-900 border-l-4 border-transparent'
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2">
                      {icon}
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Giá</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
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
                  placeholder="Từ"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
                  placeholder="Đến"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sắp xếp</div>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
