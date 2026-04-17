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
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="radio"
                  name="category"
                  checked={!selectedCategory}
                  onChange={() => onCategoryChange('')}
                  className="h-4 w-4 accent-indigo-600"
                />
                <span className="text-slate-700 dark:text-slate-200">Tất cả</span>
              </label>
              {categories.map((category) => (
                <label
                  key={String(category.id)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={String(selectedCategory) === String(category.id)}
                    onChange={() => onCategoryChange(String(category.id))}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className="text-slate-700 dark:text-slate-200">{category.name}</span>
                </label>
              ))}
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sắp xếp</div>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
