import { useEffect, useState, useRef } from 'react'

export function MockChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatType, setChatType] = useState<'zalo' | 'facebook'>('zalo')
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot' | 'system'; text: string; time: string }[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleOpenChat(e: Event) {
      const customEvent = e as CustomEvent<{ type: 'zalo' | 'facebook' }>
      const type = customEvent.detail?.type ?? 'zalo'
      setChatType(type)
      setIsOpen(true)
      
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      setMessages([
        { sender: 'system', text: `Hộp thoại hỗ trợ trực tuyến ${type === 'zalo' ? 'Zalo' : 'Messenger'} đã mở.`, time: now },
        { 
          sender: 'bot', 
          text: `Xin chào! Cảm ơn bạn đã liên hệ với hỗ trợ trực tuyến của SachStore qua kênh ${type === 'zalo' ? 'Zalo' : 'Facebook'}. Mình có thể giúp gì cho bạn hôm nay?`, 
          time: now 
        }
      ])
    }

    window.addEventListener('open-mock-chat', handleOpenChat)
    return () => window.removeEventListener('open-mock-chat', handleOpenChat)
  }, [])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isTyping])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = inputText.trim()
    if (!text) return

    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    const userMsg = { sender: 'user' as const, text, time: now }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const botTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      let replyText = 'Cảm ơn phản hồi của bạn! Nhân viên tư vấn của SachStore sẽ liên hệ lại ngay lập tức qua số Zalo/điện thoại của bạn trong vài phút nữa ạ.'
      
      const lowerText = text.toLowerCase()
      if (lowerText.includes('đơn') || lowerText.includes('hóa đơn') || lowerText.includes('order')) {
        replyText = 'Để tra cứu tình trạng đơn hàng nhanh nhất, bạn vui lòng nhắn giúp mã hóa đơn (VD: INV-xxxx) hoặc số điện thoại đặt hàng để hệ thống tự động kiểm tra nhé!'
      } else if (lowerText.includes('ship') || lowerText.includes('phí') || lowerText.includes('giao hàng') || lowerText.includes('bao lâu')) {
        replyText = 'Dạ! SachStore giao nhanh nội thành Hà Nội & TP.HCM trong 2-4 tiếng. Các khu vực khác thường nhận được từ 2-5 ngày làm việc ạ. Phí ship đồng giá 25k hoặc Freeship cho đơn hàng từ 300k!'
      } else if (lowerText.includes('sách') || lowerText.includes('tìm') || lowerText.includes('có sách')) {
        replyText = 'Dạ, cửa hàng có hàng ngàn đầu sách chính hãng thuộc nhiều thể loại khác nhau. Bạn có thể sử dụng thanh Tìm kiếm ở góc trên cùng trang web hoặc cho mình xin tên sách bạn đang tìm để mình kiểm tra kho giúp bạn ạ!'
      } else if (lowerText.includes('đổi trả') || lowerText.includes('lỗi') || lowerText.includes('trả sách')) {
        replyText = 'Dạ! SachStore cam kết đổi trả sách miễn phí trong vòng 7 ngày kể từ khi nhận hàng nếu có lỗi in ấn của nhà xuất bản hoặc lỗi móp méo do vận chuyển ạ. Bạn cứ yên tâm mua sắm nhé!'
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: replyText, time: botTime }])
    }, 1200)
  }

  if (!isOpen) return null

  const themeColor = chatType === 'zalo' ? '#0068ff' : '#0084ff'
  const brandName = chatType === 'zalo' ? 'Zalo SachStore' : 'Messenger SachStore'

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex w-80 sm:w-96 flex-col overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl animate-fade-in animate-slide-up duration-300 dark:border-stone-800 dark:bg-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white shadow" style={{ background: themeColor }}>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-extrabold" style={{ color: themeColor }}>
              {chatType === 'zalo' ? 'Z' : 'F'}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <div className="text-sm font-bold">{brandName}</div>
            <div className="text-[10px] text-white/85">Chúng tôi thường trả lời ngay lập tức</div>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          type="button" 
          className="rounded-full p-1 hover:bg-white/15 active:scale-95 transition"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>

      {/* Messages list */}
      <div ref={listRef} className="flex-1 max-h-[300px] min-h-[240px] overflow-y-auto bg-amber-50/15 p-4 space-y-3 dark:bg-stone-950/20">
        {messages.map((m, idx) => {
          if (m.sender === 'system') {
            return (
              <div key={idx} className="text-center text-[10px] text-stone-400 font-medium my-2">
                {m.text}
              </div>
            )
          }

          const isUser = m.sender === 'user'
          return (
            <div key={idx} className={['flex gap-2.5 max-w-[85%]', isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'].join(' ')}>
              {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold shadow-sm"
                  style={{ background: themeColor }}>
                  {chatType === 'zalo' ? 'Z' : 'F'}
                </div>
              )}
              <div className="space-y-0.5">
                <div className={[
                  'rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm break-words',
                  isUser 
                    ? 'bg-amber-800 text-white rounded-tr-none' 
                    : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none dark:bg-stone-800 dark:text-stone-100 dark:border-stone-750'
                ].join(' ')}>
                  {m.text}
                </div>
                <div className={['text-[9px] text-stone-400', isUser ? 'text-right' : ''].join(' ')}>{m.time}</div>
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold shadow-sm"
              style={{ background: themeColor }}>
              {chatType === 'zalo' ? 'Z' : 'F'}
            </div>
            <div className="rounded-2xl px-3.5 py-2.5 bg-white border border-stone-100 rounded-tl-none dark:bg-stone-800 dark:border-stone-750">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-amber-100 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs outline-none focus:border-amber-400 focus:bg-white transition-all dark:border-stone-850 dark:bg-stone-950 dark:text-stone-100"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-95"
          style={{ background: themeColor }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </div>
  )
}
