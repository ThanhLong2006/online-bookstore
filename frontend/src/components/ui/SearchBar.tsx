import type { ChangeEvent, FormEvent } from 'react'

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Tìm kiếm sách...',
}: {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  placeholder?: string
}) {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <label className="relative block">
        <span className="sr-only">Search</span>
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              fill="currentColor"
              d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0-4.243-1.757A5.98 5.98 0 0 0 10 16Zm9.707 5.293-4.256-4.256 1.414-1.414 4.256 4.256-1.414 1.414Z"
            />
          </svg>
        </span>
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        />
      </label>
    </form>
  )
}
