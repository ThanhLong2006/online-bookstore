import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import { formatVND } from '../../utils/format'

const RANK_COLORS = [
  'from-[#1A365D] to-[#2B6CB0]',
  'from-[#2B6CB0] to-blue-500',
  'from-blue-800 to-blue-600',
  'from-slate-500 to-slate-400',
  'from-slate-500 to-slate-400',
  'from-slate-500 to-slate-400',
]

export function HomeSidebar({
  weeklyRanking,
  news,
}: {
  weeklyRanking: Book[]
  news: { id: string; title: string; date: string; tag: string }[]
}) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-20 h-fit">
      {/* Bảng xếp hạng tuần */}
      <Box title="🏆 Bảng xếp hạng tuần">
        <div className="space-y-3">
          {weeklyRanking?.slice(0, 6).map((b, idx) => (
            <Link key={String(b.id)} to={`/books/${b.id}`} className="group flex items-start gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${RANK_COLORS[idx] ?? 'from-stone-300 to-stone-200'} text-xs font-extrabold text-white shadow-sm`}>
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="line-clamp-2 text-xs font-bold text-slate-805 transition group-hover:text-[#1A365D] dark:text-slate-200 dark:group-hover:text-blue-400 leading-snug">
                  {b.title}
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="truncate">{b.author ?? '—'}</span>
                  <span className="font-extrabold shrink-0 text-[#1A365D] dark:text-blue-400">{formatVND(b.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Box>

      {/* Bảng tin hot / Sự kiện */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Prominent dark header */}
        <div className="bg-gradient-to-r from-[#1A365D] to-[#2D3F59] dark:from-slate-950 dark:to-slate-850 px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-xs font-black uppercase tracking-wider text-white">🔥 BẢNG TIN HOT / SỰ KIỆN</div>
          <Link to="/news" className="text-[11px] font-black uppercase tracking-wider text-amber-300 hover:underline dark:text-amber-400">
            Xem thêm
          </Link>
        </div>

        <div className="p-4 space-y-3">
          {news?.map((n) => (
            <Link
              key={n.id}
              to={`/news/${n.id}`}
              className="group block rounded-lg bg-slate-50/40 hover:bg-slate-50 dark:bg-slate-850/20 dark:hover:bg-slate-850/60 p-3 transition duration-300 border border-slate-100 dark:border-slate-800/50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded px-2 py-0.5 text-[9px] font-bold text-white bg-[#C2410C] dark:bg-orange-650">
                  {n.tag}
                </span>
                <span className="text-[10px] text-slate-450 dark:text-slate-400">{n.date}</span>
              </div>
              <div className="mt-2 line-clamp-2 text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed transform group-hover:translate-x-1.5 transition-transform duration-300">
                {n.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
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
    <div className="rounded-lg border border-[#E6E6E6] bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3.5 flex items-center justify-between gap-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-slate-100">{title}</div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </div>
  )
}