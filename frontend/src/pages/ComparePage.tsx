import { Link } from 'react-router-dom'
import { useCompare } from '../contexts/CompareContext'
import { formatVND } from '../utils/format'

export function ComparePage() {
  const { items, count, clear, remove } = useCompare()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">So sánh</h1>
          <p className="text-sm text-slate-600">Đã chọn {count} sách (tối đa 4).</p>
        </div>
        {count ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Xoá danh sách
          </button>
        ) : null}
      </div>

      {count === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-lg font-semibold text-slate-900">Chưa có sách để so sánh</div>
          <p className="mt-1 text-sm text-slate-600">Bấm icon so sánh trên BookCard để thêm.</p>
          <Link
            to="/books"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Khám phá sách
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Thuộc tính</th>
                  {items.map((b) => (
                    <th key={String(b.id)} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/books/${b.id}`} className="line-clamp-2 font-semibold text-slate-900 hover:underline">
                          {b.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(b.id)}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                        >
                          Xoá
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <img
                          src={b.coverUrl || 'https://covers.openlibrary.org/b/id/8225266-S.jpg'}
                          alt={b.title}
                          className="h-14 w-11 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="text-xs text-slate-500">{b.author ?? '—'}</div>
                          <div className="text-sm font-extrabold text-indigo-700">{formatVND(b.price)}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <Row label="Giá" values={items.map((b) => formatVND(b.price))} />
                <Row label="Tác giả" values={items.map((b) => b.author ?? '—')} />
                <Row label="Thể loại" values={items.map((b) => b.category?.name ?? '—')} />
                <Row label="Số trang" values={items.map((b) => (typeof b.pages === 'number' ? String(b.pages) : '—'))} />
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="align-top">
      <td className="px-4 py-3 font-semibold text-slate-700">{label}</td>
      {values.map((v, idx) => (
        <td key={idx} className="px-4 py-3 text-slate-700">
          {v}
        </td>
      ))}
    </tr>
  )
}

