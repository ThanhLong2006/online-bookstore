import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #fdf6ec 0%, #fbeeda 100%)', borderTop: '1px solid #e8d5bf' }}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-12">

          {/* Cột 1: Thương hiệu + Thông tin Doanh nghiệp (col-span-5) */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
                S
              </span>
              <span className="text-lg font-extrabold tracking-tight text-stone-900">SachStore</span>
            </div>
            <p className="text-xs font-bold text-stone-700 uppercase tracking-wide">
              Công ty Cổ phần Sách và Thiết bị Giáo dục SachStore
            </p>
            <div className="text-xs text-stone-500 space-y-1.5 leading-relaxed font-normal">
              <div><strong>Trụ sở chính:</strong> 123 Đường Sách, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</div>
              <div><strong>Giấy CNĐKDN số:</strong> 0109876543 do Sở KH&ĐT TP.HCM cấp ngày 10/10/2022</div>
              <div><strong>Người đại diện pháp luật:</strong> Nguyễn Văn A</div>
              <div><strong>Email liên hệ:</strong> support@sachstore.vn • <strong>Hotline:</strong> 1800 1234</div>
            </div>
            <div className="flex gap-3">
              {/* Facebook icon */}
              <a href="#facebook-chat"
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new CustomEvent('open-mock-chat', { detail: { type: 'facebook' } }))
                }}
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white shadow-sm transition hover:bg-blue-600 hover:border-blue-600"
                title="Facebook SachStore">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-blue-600 group-hover:text-white transition" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Zalo icon */}
              <a href="#zalo-chat"
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new CustomEvent('open-mock-chat', { detail: { type: 'zalo' } }))
                }}
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white shadow-sm transition hover:bg-blue-500 hover:border-blue-500"
                title="Zalo SachStore">
                <svg viewBox="0 0 50 50" className="h-5 w-5 text-blue-500 group-hover:text-white transition" fill="currentColor">
                  <path d="M25 2C12.318 2 2 12.318 2 25c0 3.96 1.023 7.854 2.963 11.29L2.037 46.73c-.096.343.003.711.27.953A.999.999 0 0 0 3 48c.056 0 .112-.007.166-.021l10.849-2.928C17.45 46.99 21.21 48 25 48c12.682 0 23-10.318 23-23S37.682 2 25 2zM14 28h-2v-8h2v8zm4 0h-2v-8h2v8zm5 0h-2l-3-5v5h-2v-8h2l3 5v-5h2v8zm6-6h-4v1h4v2h-4v1h4v2h-6v-8h6v2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Cột 2: Khám phá (col-span-2) */}
          <div className="md:col-span-2 md:pl-4">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-amber-800" style={{ color: '#8b4513' }}>Khám phá</h3>
            <ul className="space-y-2.5 text-xs">
              <FooterLink to="/">Trang chủ</FooterLink>
              <FooterLink to="/books">Danh sách sách</FooterLink>
              <FooterLink to="/news">Tin tức</FooterLink>
              <FooterLink to="/notifications">Thông báo</FooterLink>
              <FooterLink to="/wishlist">Sách yêu thích</FooterLink>
              <FooterLink to="/cart">Giỏ hàng</FooterLink>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ (col-span-2) */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-amber-800" style={{ color: '#8b4513' }}>Hỗ trợ</h3>
            <ul className="space-y-2.5 text-xs">
              <FooterLink to="/support">Hỗ trợ khách hàng</FooterLink>
              <FooterLink to="/contact">Liên hệ trực tiếp</FooterLink>
              <FooterLink to="/policy">Chính sách bảo mật</FooterLink>
              <FooterLink to="/policy#return">Chính sách đổi trả</FooterLink>
              <FooterLink to="/profile">Thông tin tài khoản</FooterLink>
            </ul>
          </div>

          {/* Cột 4: Thanh toán & Giấy phép (col-span-3) */}
          <div className="space-y-4 md:col-span-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-800" style={{ color: '#8b4513' }}>Thanh toán</h3>
            <div className="flex flex-wrap gap-2.5">
              {/* Visa */}
              <div className="flex h-8 w-11 items-center justify-center rounded-lg bg-white shadow-sm border border-stone-100 p-1" title="Visa / Mastercard">
                <svg viewBox="0 0 48 48" className="h-4 w-7" fill="currentColor">
                  <path d="M18.8 28.5L21.3 15h-3.9l-2.5 10.1L13 16.5A5.6 5.6 0 007.8 15H2L1.8 16c2.4.6 4.7 1.6 6.2 3.1L9 28.5h4.1l6.2-13.5z" fill="#1A1F71"/>
                  <path d="M29.5 19.4c0-2.3-3.2-2.5-4.4-3.1-.9-.4-1.7-.8-1.7-1.4 0-.6.7-1.2 2.1-1.2a7.1 7.1 0 013.9 1.1l.5-3.3a10 10 0 00-4.3-.8c-3.8 0-6.5 2.1-6.5 5.2 0 3.7 5.1 4 5.1 5.8 0 .6-.7 1.2-2.2 1.2a8.7 8.7 0 01-5-1.5l-.5 3.3a11.8 11.8 0 005.4 1.1c4 0 6.6-2 6.6-4.9z" fill="#1A1F71"/>
                  <path d="M37.6 15h-3.2a1.8 1.8 0 00-1.8 1.2l-5.6 12.3h4.2l.8-2.3h5.1l.5 2.3h3.7L37.6 15zm-4.7 8.3l1.8-5 1 5h-2.8z" fill="#1A1F71"/>
                  <path d="M46.2 15h-3.2l-3.3 13.5h4.1L46.2 15z" fill="#F7B600"/>
                </svg>
              </div>
              {/* MoMo */}
              <div className="flex h-8 w-11 items-center justify-center rounded-lg bg-white shadow-sm border border-stone-100 p-1" title="Ví MoMo">
                <svg viewBox="0 0 40 40" className="h-6 w-6 rounded" fill="currentColor">
                  <rect width="40" height="40" rx="6" fill="#b0006d" />
                  <path d="M10 24h3.5v-8H10v8zm10.5-8c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm0 5.2c-.9 0-1.7-.7-1.7-1.7s.7-1.7 1.7-1.7 1.7.7 1.7 1.7-.7 1.7-1.7 1.7zm8.5-5.2c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm0 5.2c-.9 0-1.7-.7-1.7-1.7s.7-1.7 1.7-1.7 1.7.7 1.7 1.7-.7 1.7-1.7 1.7z" fill="#ffffff"/>
                  <path d="M15.5 16h3v8h-3v-8z" fill="#ffffff"/>
                </svg>
              </div>
              {/* ZaloPay */}
              <div className="flex h-8 w-11 items-center justify-center rounded-lg bg-white shadow-sm border border-stone-100 p-1" title="Ví ZaloPay">
                <svg viewBox="0 0 40 40" className="h-6 w-6 rounded" fill="currentColor">
                  <rect width="40" height="40" rx="6" fill="#0068ff" />
                  <path d="M26 12H14c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V14c0-1.1-.9-2-2-2zm-5 11.8c-.8.8-2 .8-2.8 0l-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4-3.5 6.3z" fill="#00c224" />
                  <text x="20" y="27" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">ZaloPay</text>
                </svg>
              </div>
              {/* ATM */}
              <div className="flex h-8 w-11 items-center justify-center rounded-lg bg-white shadow-sm border border-stone-100 p-1" title="Thẻ ATM Nội Địa">
                <svg viewBox="0 0 24 24" className="h-5 w-7 text-amber-800" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                  <rect x="5" y="14" width="3" height="2" rx="0.5"/>
                </svg>
              </div>
            </div>

            {/* Bộ Công Thương Badge */}
            <div className="pt-2">
              <a href="#bo-cong-thuong" className="inline-block transition hover:opacity-95" title="Đã đăng ký Bộ Công Thương"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Website đang hoạt động thử nghiệm phục vụ đồ án học tập - Đã mô phỏng đăng ký với Bộ Công Thương.')
                }}>
                <svg viewBox="0 0 120 45" className="h-9 w-24" fill="none">
                  <rect width="120" height="45" rx="6" fill="#0066b3" />
                  <circle cx="22" cy="22" r="14" fill="#fff" opacity="0.2" />
                  <path d="M22 13l7 3v6c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10v-6l7-3z" fill="#fff" />
                  <path d="M22 15.5l5 2v4.5c0 3.3-2.2 6.2-5 7.3-2.8-1.1-5-4-5-7.3v-4.5l5-2z" fill="#0066b3" />
                  <path d="M22 18l3 1.2v2.8c0 2-1.3 3.8-3 4.5-1.7-.7-3-2.5-3-4.5v-2.8l3-1.2z" fill="#fff" />
                  <text x="44" y="20" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ĐÃ ĐĂNG KÝ</text>
                  <text x="44" y="32" fill="#fff" fontSize="8" fontFamily="sans-serif">BỘ CÔNG THƯƠNG</text>
                </svg>
              </a>
            </div>

            {/* Hoạt động */}
            <div className="rounded-xl border border-amber-200 bg-white p-3 text-[11px] text-stone-500 space-y-1">
              <div className="font-bold text-stone-750 uppercase tracking-wide">Giờ phục vụ</div>
              <div>Thứ 2 – Thứ 6: <span className="font-semibold text-stone-750">8:00 – 21:00</span></div>
              <div>Thứ 7 – Chủ Nhật: <span className="font-semibold text-stone-750">9:00 – 18:00</span></div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-amber-200 pt-6 text-xs text-stone-400 sm:flex-row">
          <p>© {new Date().getFullYear()} SachStore. Cửa hàng hoạt động thử nghiệm. Phát triển bởi nhóm sinh viên.</p>
          <div className="flex items-center gap-6">
            <Link to="/policy" className="hover:text-stone-600 transition">Chính sách bảo mật</Link>
            <Link to="/policy#terms" className="hover:text-stone-600 transition">Điều khoản sử dụng</Link>
            <span className="hidden sm:block">Visa / MoMo / ZaloPay / ATM</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to}
        className="text-stone-500 transition hover:text-amber-800 hover:underline underline-offset-4">
        {children}
      </Link>
    </li>
  )
}