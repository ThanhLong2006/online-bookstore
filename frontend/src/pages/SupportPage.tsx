import { Link } from 'react-router-dom'

const faqs = [
  { q: 'Làm thế nào để đặt hàng?', a: 'Chọn sách bạn muốn mua, thêm vào giỏ hàng, rồi tiến hành thanh toán. Chúng tôi hỗ trợ nhiều phương thức thanh toán.' },
  { q: 'Thời gian giao hàng là bao lâu?', a: 'Nội thành TP.HCM và Hà Nội: 2-4 tiếng. Các tỉnh thành khác: 2-5 ngày làm việc.' },
  { q: 'Tôi có thể đổi trả sách không?', a: 'Có! Chúng tôi chấp nhận đổi trả trong vòng 7 ngày nếu sách có lỗi từ nhà xuất bản hoặc giao sai sản phẩm.' },
  { q: 'Làm sao để theo dõi đơn hàng?', a: 'Sau khi đặt hàng, bạn sẽ nhận email xác nhận có mã theo dõi. Bạn cũng có thể xem trong trang Thông tin tài khoản.' },
  { q: 'SachStore có ship COD không?', a: 'Có! Chúng tôi hỗ trợ thanh toán khi nhận hàng (COD) cho tất cả đơn hàng nội địa.' },
]

export function SupportPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl p-8 text-center"
        style={{ background: 'linear-gradient(135deg, #1A365D 0%, #2B6CB0 100%)' }}>
        <div className="text-4xl mb-3">📞</div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Hỗ trợ khách hàng</h1>
        <p className="text-amber-100 text-sm max-w-md mx-auto">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Dưới đây là các câu hỏi thường gặp và kênh liên hệ nhanh.
        </p>
      </div>

      {/* Quick contact cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: '📧', title: 'Email', desc: 'support@sachstore.vn', sub: 'Phản hồi trong 2-4 giờ', action: () => { window.location.href = 'mailto:support@sachstore.vn' } },
          { icon: '📱', title: 'Hotline', desc: '1800 1234', sub: 'Miễn phí • 8:00 – 21:00', action: () => { window.location.href = 'tel:18001234' } },
          { icon: '💬', title: 'Chat trực tiếp', desc: 'Chat ngay trên Zalo', sub: 'Trả lời trong 5 phút', action: () => { window.dispatchEvent(new CustomEvent('open-mock-chat', { detail: { type: 'zalo' } })) } },
        ].map((c) => (
          <button
            key={c.title}
            onClick={c.action}
            type="button"
            className="rounded-2xl border border-amber-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition active:scale-95 w-full flex flex-col items-center justify-center focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
          >
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="font-bold text-stone-900">{c.title}</div>
            <div className="text-sm font-semibold mt-1" style={{ color: '#1A365D' }}>{c.desc}</div>
            <div className="text-xs text-stone-400 mt-0.5">{c.sub}</div>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-stone-900 mb-5">❓ Câu hỏi thường gặp</h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <details key={i} className="group rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 cursor-pointer">
              <summary className="font-semibold text-stone-800 list-none flex items-center justify-between">
                {item.q}
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-600 transition group-open:rotate-180" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 transition"
          style={{ background: 'linear-gradient(135deg, #1A365D, #2B6CB0)' }}>
          📮 Gửi yêu cầu hỗ trợ →
        </Link>
      </div>
    </div>
  )
}
