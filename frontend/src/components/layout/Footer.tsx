import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                S
              </span>
              <div>
                <div className="text-base font-semibold text-slate-900">SachStore</div>
                <div className="text-xs text-slate-500">Sách hay mỗi ngày</div>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Cửa hàng sách demo cho dự án <span className="font-semibold text-slate-900">quanlysach</span>
              . Giao diện production-feel, tối ưu trải nghiệm mua sắm và quản trị.
            </p>
            <div className="space-y-1 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-400" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5A2.5 2.5 0 1 0 12 6.5a2.5 2.5 0 0 0 0 5Z"
                    />
                  </svg>
                </span>
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-400" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
                    />
                  </svg>
                </span>
                <span>support@sachstore.local</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Liên kết nhanh</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-slate-600 transition hover:text-indigo-700 hover:underline"
                  to="/"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 transition hover:text-indigo-700 hover:underline"
                  to="/books"
                >
                  Danh sách sách
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 transition hover:text-indigo-700 hover:underline"
                  to="/cart"
                >
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 transition hover:text-indigo-700 hover:underline"
                  to="/auth"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 transition hover:text-indigo-700 hover:underline"
                  to="/auth"
                >
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link
                  className="text-slate-600 transition hover:text-indigo-700 hover:underline"
                  to="/admin"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Đăng ký nhận bản tin</div>
            <p className="text-sm text-slate-600">
              Nhận thông tin sách mới và ưu đãi (demo UI).
            </p>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const input = form.querySelector('input[name="email"]') as HTMLInputElement | null
                if (input) input.value = ''
                toast.success('Đăng ký nhận tin thành công')
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Email của bạn"
                className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Đăng ký
              </button>
            </form>
            <p className="text-xs text-slate-500">
              Bằng cách đăng ký, bạn đồng ý nhận email từ SachStore (demo).
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-slate-900">Đối tác thanh toán</div>
            <div className="flex flex-wrap items-center gap-2">
              <LogoBadge label="VISA" />
              <LogoBadge label="MoMo" tone="rose" />
              <LogoBadge label="ZaloPay" tone="indigo" />
              <LogoBadge label="ATM" tone="slate" />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-slate-900">Chứng nhận</div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <CertBadge label="SSL Secure" />
              <CertBadge label="Hoàn tiền 7 ngày" />
              <CertBadge label="Giao nhanh" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:items-center">
            <div className="text-sm text-slate-600">
              <div className="font-semibold text-slate-900">Mạng xã hội</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => toast('Đang mở Facebook…')}
                >
                  Facebook
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => toast('Đang mở Zalo…')}
                >
                  Zalo
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <div className="font-semibold text-slate-900">Cam kết bảo mật</div>
              <p className="mt-1">
                Chúng tôi tôn trọng dữ liệu người dùng, không chia sẻ thông tin cá nhân cho bên thứ ba (demo UI).
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} SachStore</p>
            <p className="text-slate-500">Production-ready frontend • React + TypeScript + Tailwind</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function LogoBadge({ label, tone }: { label: string; tone?: 'slate' | 'indigo' | 'rose' }) {
  const cls =
    tone === 'rose'
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : tone === 'indigo'
        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
        : 'border-slate-200 bg-slate-50 text-slate-700'
  return (
    <span
      className={[
        'inline-flex items-center rounded-xl border px-3 py-2 text-xs font-extrabold tracking-wide',
        cls,
      ].join(' ')}
    >
      {label}
    </span>
  )
}

function CertBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" aria-hidden="true">
        <path
          fill="currentColor"
          d="m9 16.17-3.88-3.88L3.71 13.7 9 19l12-12-1.41-1.41L9 16.17Z"
        />
      </svg>
      {label}
    </span>
  )
}

