import { Link } from 'react-router-dom'
import type { Book, Category } from '../../types/book'
import { formatVND } from '../../utils/format'

export function HomeSidebar({
  categories,
  weeklyRanking,
  news,
}: {
  categories: Category[]
  weeklyRanking: Book[]
  news: { id: string; title: string; date: string; tag: string }[]
}) {
  return (
    <aside className="space-y-4">
      <Box title="Thể loại phổ biến">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={String(c.id)}
              to={`/books?categoryId=${encodeURIComponent(String(c.id))}`}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Box>

      <Box title="Bảng xếp hạng tuần">
        <div className="space-y-3">
          {weeklyRanking.slice(0, 6).map((b, idx) => (
            <Link key={String(b.id)} to={`/books/${b.id}`} className="group flex gap-3">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-slate-100 text-sm font-extrabold text-slate-700">
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover:text-indigo-700">
                  {b.title}
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="truncate">{b.author ?? '—'}</span>
                  <span className="font-semibold text-indigo-700">{formatVND(b.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Box>

      <Box
        title="Thông báo / Tin tức nhà sách"
        action={
          <Link to="/news" className="text-xs font-semibold text-indigo-700 hover:underline">
            Xem thêm
          </Link>
        }
      >
        <div className="space-y-3">
          {news.map((n) => (
            <Link
              key={n.id}
              to={`/news/${n.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {n.tag}
                </span>
                <span className="text-xs text-slate-500">{n.date}</span>
              </div>
              <div className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">{n.title}</div>
            </Link>
          ))}
        </div>
      </Box>
    </aside>
  )
}

function Box({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </div>
  )
}

