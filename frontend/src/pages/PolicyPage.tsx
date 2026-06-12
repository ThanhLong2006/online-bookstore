import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function PolicyPage() {
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        // Scroll with a slight delay to ensure the page has rendered completely
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Add a premium highlighting outline
          element.classList.add('ring-4', 'ring-blue-500/30', 'border-blue-400')
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-blue-500/30', 'border-blue-400')
          }, 2500)
        }, 150)
        return () => clearTimeout(timer)
      }
    }
  }, [location.hash])

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left pb-12">
      {/* Header */}
      <div className="rounded-3xl p-8 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A365D 0%, #2B6CB0 100%)' }}>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="text-4xl mb-3">🛡️</div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Chính sách & Bảo mật SachStore</h1>
        <p className="text-amber-350 text-xs sm:text-sm font-semibold">Cập nhật lần cuối: 12/06/2026 • Đảm bảo quyền lợi khách hàng 100%</p>
      </div>

      {/* 1. CAM KẾT CHÍNH HÃNG 100% */}
      <section id="genuine" className="rounded-2xl border border-[#E6E6E6] bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          🛡️ Cam kết chính hãng 100%
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">
          <p>
            Tất cả các sản phẩm sách được bán tại <strong>SachStore</strong> đều là sách in chính hãng 100%, có bản quyền đầy đủ từ các Nhà xuất bản uy tín trong và ngoài nước (NXB Trẻ, Kim Đồng, Nhã Nam, Đông A, Alphabooks, HarperCollins, Oxford,...).
          </p>
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 space-y-2">
            <h4 className="font-extrabold text-blue-900 dark:text-blue-300 text-sm">Chính sách đền bù 1000% (Gấp 10 lần giá trị):</h4>
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-400">
              Nếu quý khách phát hiện bất kỳ cuốn sách nào mua tại SachStore là sách lậu, sách nhái hoặc sách không có bản quyền hợp pháp, chúng tôi cam kết hoàn tiền gấp 10 lần giá trị đơn hàng ngay lập tức mà không cần thủ tục rườm rà.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Chúng tôi kiên quyết nói KHÔNG với sách giả để bảo vệ chất lượng in ấn, bảo vệ quyền lợi tinh thần của độc giả và tôn trọng thành quả lao động của tác giả cùng dịch giả.
          </p>
        </div>
      </section>

      {/* 2. CHÍNH SÁCH VẬN CHUYỂN HỎA TỐC */}
      <section id="shipping" className="rounded-2xl border border-[#E6E6E6] bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          🚚 Chính sách giao hàng hỏa tốc
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">
          <p>
            SachStore hợp tác với các đơn vị vận chuyển hàng đầu để mang sách đến tay bạn trong tình trạng hoàn hảo nhất và tốc độ nhanh nhất có thể.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
              <h4 className="font-extrabold text-orange-950 dark:text-orange-300 text-sm mb-1">⚡ Giao Hỏa Tốc 2H:</h4>
              <p className="text-xs sm:text-sm text-orange-900 dark:text-orange-400">
                Áp dụng cho đơn hàng nội thành Hà Nội & TP. Hồ Chí Minh. Đặt trước 19h00 hàng ngày để nhận sách ngay trong vòng 2 tiếng.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
              <h4 className="font-extrabold text-emerald-950 dark:text-emerald-300 text-sm mb-1">📦 Đóng Gói Chống Va Đập:</h4>
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-450">
                Mọi cuốn sách đều được bọc màng co nilon chống ẩm, chèn bóng khí chống sốc và đóng hộp carton cứng cáp để bảo vệ nguyên vẹn các góc mép sách.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm">
            <strong>Miễn phí vận chuyển:</strong> Áp dụng Freeship toàn quốc cho các đơn hàng từ 250.000đ trở lên (sử dụng mã <strong>FREESHIP30</strong>).
          </p>
        </div>
      </section>

      {/* 3. CHÍNH SÁCH BẢO MẬT THANH TOÁN */}
      <section id="payment" className="rounded-2xl border border-[#E6E6E6] bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          💳 Bảo mật thanh toán an toàn
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">
          <p>
            SachStore cam kết mang lại trải nghiệm thanh toán tiện lợi và an toàn tuyệt đối. Chúng tôi không bao giờ lưu trữ thông tin thẻ tín dụng của bạn trên máy chủ của mình.
          </p>
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 space-y-2.5">
            <h4 className="font-extrabold text-blue-950 dark:text-blue-300 text-sm">Cổng thanh toán tích hợp chuẩn PCI-DSS:</h4>
            <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-400">
              Tất cả các giao dịch qua ví MoMo, ZaloPay, cổng thẻ ATM nội địa hoặc thẻ Visa/Mastercard đều được mã hóa SSL/TLS 256-bit cao cấp nhất và được xử lý trực tiếp bởi các đối tác cổng thanh toán được cấp phép chính thức từ Ngân hàng Nhà nước.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Hỗ trợ hoàn trả tiền (Refund) trực tiếp vào tài khoản ngân hàng hoặc ví điện tử của khách hàng trong vòng 3-5 ngày làm việc nếu đơn hàng gặp sự cố hủy bỏ hoặc đổi trả hợp lệ.
          </p>
        </div>
      </section>

      {/* 4. CHÍNH SÁCH ĐỔI TRẢ */}
      <section id="return" className="rounded-2xl border border-[#E6E6E6] bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          🔄 Chính sách đổi trả sách
        </h2>
        <div className="space-y-3 text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
          {[
            { title: 'Điều kiện đổi trả', desc: 'Sách bị lỗi in ấn (mất trang, ngược trang, mờ chữ), giao sai tựa sách, hoặc hư hại móp méo nặng trong quá trình vận chuyển.' },
            { title: 'Thời hạn hỗ trợ', desc: 'Trong vòng 7 ngày làm việc kể từ ngày nhận hàng thành công.' },
            { title: 'Quy trình xử lý', desc: 'Quý khách vui lòng liên hệ hotline 1800 1234 hoặc email support@sachstore.vn kèm ảnh chụp/video mở hộp để được hỗ trợ đổi trả miễn phí tận nơi.' },
            { title: 'Chính sách hoàn tiền', desc: 'Hoàn lại 100% tiền qua tài khoản ban đầu nếu sản phẩm thay thế đã hết hàng trong kho.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
              <span className="text-amber-600 font-bold text-lg">✓</span>
              <div>
                <div className="font-extrabold text-slate-900 dark:text-slate-200 text-xs sm:text-sm">{item.title}</div>
                <div className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs sm:text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CHÍNH SÁCH BẢO MẬT THÔNG TIN */}
      <section id="privacy" className="rounded-2xl border border-[#E6E6E6] bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          🔒 Bảo vệ thông tin cá nhân
        </h2>
        <div className="space-y-4 text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
          <p><strong className="text-slate-900 dark:text-white">1. Thu thập thông tin:</strong> Chúng tôi chỉ thu thập các thông tin cơ bản phục vụ giao nhận đơn hàng (Họ tên, số điện thoại, email, địa chỉ giao hàng) khi khách hàng tự đặt hàng.</p>
          <p><strong className="text-slate-900 dark:text-white">2. Cam kết bảo mật:</strong> SachStore cam kết không bán, không chuyển nhượng hoặc chia sẻ thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào ngoài đơn vị vận chuyển chịu trách nhiệm giao đơn hàng của bạn.</p>
          <p><strong className="text-slate-900 dark:text-white">3. Quyền hạn của khách hàng:</strong> Quý khách có quyền yêu cầu chỉnh sửa, cập nhật hoặc xóa vĩnh viễn thông tin tài khoản cá nhân của mình ra khỏi hệ thống bất cứ lúc nào.</p>
        </div>
      </section>

      {/* 6. ĐIỀU KHOẢN SỬ DỤNG */}
      <section id="terms" className="rounded-2xl border border-[#E6E6E6] bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          📄 Điều khoản sử dụng dịch vụ
        </h2>
        <div className="space-y-4 text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
          <p>Khi mua sắm và sử dụng dịch vụ tại SachStore, quý khách đồng ý tuân thủ các quy định sau:</p>
          <p><strong className="text-slate-900 dark:text-white">1. Tài khoản thành viên:</strong> Quý khách có trách nhiệm tự bảo mật thông tin tài khoản đăng nhập của mình và chịu mọi trách nhiệm liên quan đến các giao dịch được thực hiện qua tài khoản đó.</p>
          <p><strong className="text-slate-900 dark:text-white">2. Thông tin sản phẩm:</strong> Chúng tôi nỗ lực cung cấp thông tin hình ảnh, giá cả chính xác nhất. Trường hợp hiếm hoi xảy ra lỗi hiển thị giá sai lệch lớn so với thực tế, chúng tôi bảo lưu quyền hủy đơn hàng và hoàn tiền 100% cho quý khách.</p>
          <p><strong className="text-slate-900 dark:text-white">3. Bản quyền nội dung:</strong> Toàn bộ hình ảnh, mô tả sản phẩm, và thiết kế trên hệ thống đều thuộc quyền sở hữu trí tuệ của SachStore, mọi hành vi sao chép không được cho phép đều vi phạm pháp luật.</p>
        </div>
      </section>
    </div>
  )
}
