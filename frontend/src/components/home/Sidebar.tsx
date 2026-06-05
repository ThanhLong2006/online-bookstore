import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import { formatVND } from '../../utils/format'

const RANK_COLORS = [
  'from-amber-700 to-amber-600',
  'from-stone-500 to-stone-400',
  'from-amber-600 to-amber-500',
  'from-stone-400 to-stone-300',
  'from-stone-400 to-stone-300',
  'from-stone-400 to-stone-300',
]

export function HomeSidebar({
  weeklyRanking,
  news,
}: {
  weeklyRanking: Book[]
  news: { id: string; title: string; date: string; tag: string }[]
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
      {/* Bảng xếp hạng tuần */}
      <Box title="🏆 Bảng xếp hạng tuần">
        <div className="space-y-2.5">
          {weeklyRanking?.slice(0, 6).map((b, idx) => (
            <Link key={String(b.id)} to={`/books/${b.id}`} className="group flex items-start gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${RANK_COLORS[idx] ?? 'from-stone-300 to-stone-200'} text-xs font-extrabold text-white shadow-sm`}>
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="line-clamp-2 text-sm font-semibold text-stone-800 transition group-hover:text-amber-800 leading-snug">
                  {b.title}
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-stone-500">
                  <span className="truncate">{b.author ?? '—'}</span>
                  <span className="font-bold shrink-0" style={{ color: '#8b4513' }}>{formatVND(b.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Box>

      {/* Thông báo / Tin tức */}
      <Box
        title="📢 Thông báo / Tin tức"
        action={
          <Link to="/news" className="text-xs font-semibold hover:underline" style={{ color: '#8b4513' }}>
            Xem thêm
          </Link>
        }
      >
        <div className="space-y-2">
          {news?.map((n) => (
            <Link
              key={n.id}
              to={`/news/${n.id}`}
              className="block rounded-xl border border-amber-100 bg-amber-50/60 p-3 transition hover:bg-amber-100"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                  style={{ background: '#8b4513' }}>
                  {n.tag}
                </span>
                <span className="text-xs text-stone-400">{n.date}</span>
              </div>
              <div className="mt-1.5 line-clamp-2 text-sm font-semibold text-stone-800">{n.title}</div>
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
    <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-stone-900">{title}</div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </div>
  )
}