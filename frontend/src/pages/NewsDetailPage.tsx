import { Link, useParams } from 'react-router-dom'
import { mockGetNewsById, mockGetNews } from '../services/api/mockData'

export function NewsDetailPage() {
  const { id } = useParams()
  const item = id ? mockGetNewsById(id) : undefined

  if (!item) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
        Không tìm thấy bài viết.
        <div className="mt-2">
          <Link to="/news" className="font-semibold text-indigo-700 hover:underline">
            ← Quay lại danh sách tin
          </Link>
        </div>
      </div>
    )
  }

  const related = mockGetNews().filter((n) => n.id !== item.id).slice(0, 2)

  return (
    <div className="space-y-6">
      <div className="text-sm">
        <Link to="/news" className="font-semibold text-indigo-700 hover:underline">
          ← Quay lại danh sách tin
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="aspect-[16/8] bg-slate-100">
          <img
            src={item.coverUrl}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-3 p-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              {item.tag}
            </span>
            <span className="text-xs text-slate-500">{item.date}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{item.title}</h1>
          <p className="text-slate-600">{item.excerpt}</p>

          <div className="prose prose-slate max-w-none">
            {item.content.split('\n').map((p, idx) =>
              p.trim() ? (
                <p key={idx} className="leading-relaxed text-slate-700">
                  {p}
                </p>
              ) : null,
            )}
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="space-y-3">
          <div className="text-lg font-bold tracking-tight text-slate-900">Bài viết khác</div>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((n) => (
              <Link
                key={n.id}
                to={`/news/${n.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="text-xs text-slate-500">{n.tag} • {n.date}</div>
                <div className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{n.title}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

