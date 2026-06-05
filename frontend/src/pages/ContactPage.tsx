import { useState } from 'react'
import type { FormEvent } from 'react'
import toast from 'react-hot-toast'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast.success('Cảm ơn bạn! Chúng tôi sẽ phản hồi trong 2-4 giờ.')
      setName(''); setEmail(''); setSubject(''); setMessage('')
      setSubmitting(false)
    }, 800)
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-4xl">📮</div>
        <h1 className="text-3xl font-extrabold text-stone-900">Liên hệ với chúng tôi</h1>
        <p className="text-stone-500 text-sm">Có thắc mắc hoặc góp ý? Hãy điền form dưới đây, chúng tôi sẽ liên hệ lại sớm nhất.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_240px]">
        {/* Form */}
        <form onSubmit={onSubmit} className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-stone-800">Họ tên *</div>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white transition"
                placeholder="Nguyễn Văn A" />
            </label>
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-stone-800">Email *</div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white transition"
                placeholder="you@example.com" />
            </label>
          </div>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-stone-800">Chủ đề</div>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white transition">
              <option value="">-- Chọn chủ đề --</option>
              <option value="order">Vấn đề đơn hàng</option>
              <option value="return">Đổi trả sách</option>
              <option value="payment">Thanh toán</option>
              <option value="suggest">Góp ý / Đề xuất</option>
              <option value="other">Khác</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-stone-800">Nội dung *</div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5}
              className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white transition resize-none"
              placeholder="Mô tả chi tiết vấn đề của bạn..." />
          </label>

          <button type="submit" disabled={submitting}
            className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}>
            {submitting ? '⏳ Đang gửi...' : '📤 Gửi liên hệ'}
          </button>
        </form>

        {/* Sidebar info */}
        <div className="space-y-4">
          {[
            { icon: '📍', title: 'Địa chỉ', desc: '123 Nguyễn Huệ, Q.1, TP.HCM' },
            { icon: '📱', title: 'Hotline', desc: '1800 1234' },
            { icon: '📧', title: 'Email', desc: 'support@sachstore.vn' },
            { icon: '🕐', title: 'Giờ làm việc', desc: 'T2-T6: 8:00–21:00\nT7-CN: 9:00–18:00' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-amber-200 bg-white p-3 shadow-sm">
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">{item.title}</div>
              <div className="text-sm font-medium text-stone-800 mt-0.5 whitespace-pre-line">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
