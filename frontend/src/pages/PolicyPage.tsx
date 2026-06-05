export function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="rounded-3xl p-8"
        style={{ background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)' }}>
        <div className="text-4xl mb-3">🔒</div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Chính sách & Bảo mật</h1>
        <p className="text-amber-100 text-sm">Cập nhật lần cuối: 01/06/2026</p>
      </div>

      {/* Privacy Policy */}
      <section id="privacy" className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          🛡️ Chính sách bảo mật
        </h2>
        <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
          <p><strong className="text-stone-800">1. Thông tin thu thập:</strong> SachStore thu thập thông tin cá nhân (họ tên, email, địa chỉ giao hàng) khi bạn đăng ký tài khoản hoặc đặt hàng nhằm phục vụ quá trình mua sắm.</p>
          <p><strong className="text-stone-800">2. Sử dụng thông tin:</strong> Thông tin của bạn được sử dụng để xử lý đơn hàng, giao hàng, hỗ trợ khách hàng và gửi thông báo khuyến mãi (nếu bạn đồng ý).</p>
          <p><strong className="text-stone-800">3. Bảo vệ thông tin:</strong> Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép.</p>
          <p><strong className="text-stone-800">4. Chia sẻ thông tin:</strong> Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn.</p>
        </div>
      </section>

      {/* Return Policy */}
      <section id="return" className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          🔄 Chính sách đổi trả
        </h2>
        <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
          {[
            { title: 'Điều kiện đổi trả', desc: 'Sách lỗi từ nhà xuất bản, giao sai sản phẩm, hoặc hư hỏng trong quá trình vận chuyển.' },
            { title: 'Thời hạn', desc: 'Trong vòng 7 ngày kể từ ngày nhận hàng.' },
            { title: 'Quy trình', desc: 'Liên hệ hotline 1800 1234 hoặc email support@sachstore.vn để được hỗ trợ.' },
            { title: 'Hoàn tiền', desc: 'Hoàn tiền 100% trong vòng 3-5 ngày làm việc qua phương thức thanh toán ban đầu.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <span className="text-amber-600 font-bold text-lg">✓</span>
              <div>
                <div className="font-semibold text-stone-800">{item.title}</div>
                <div className="text-stone-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Terms */}
      <section id="terms" className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          📋 Điều khoản sử dụng
        </h2>
        <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
          <p>Bằng cách sử dụng SachStore, bạn đồng ý tuân thủ các điều khoản sau:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Không sử dụng trang web cho mục đích bất hợp pháp.</li>
            <li>Cung cấp thông tin chính xác khi đặt hàng.</li>
            <li>Không sao chép, phân phối nội dung mà không có sự cho phép.</li>
            <li>Tôn trọng quyền sở hữu trí tuệ của tác giả và nhà xuất bản.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
