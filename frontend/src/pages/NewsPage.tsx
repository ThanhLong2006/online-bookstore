import { Link } from 'react-router-dom'
import { mockGetNews } from '../services/api/mockData'

export function NewsPage() {
  const news = mockGetNews()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tin tức & Thông báo</h1>
        <p className="text-sm text-slate-600">Cập nhật chương trình, khuyến mãi và thông báo từ nhà sách.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {news.map((n) => (
          <Link
            key={n.id}
            to={`/news/${n.id}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="aspect-[16/9] bg-slate-100">
              <img
                src={n.coverUrl}
                alt={n.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {n.tag}
                </span>
                <span className="text-xs text-slate-500">{n.date}</span>
              </div>
              <div className="line-clamp-2 text-base font-semibold text-slate-900">{n.title}</div>
              <p className="line-clamp-2 text-sm text-slate-600">{n.excerpt}</p>
              <div className="text-sm font-semibold text-indigo-700">Xem chi tiết →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

