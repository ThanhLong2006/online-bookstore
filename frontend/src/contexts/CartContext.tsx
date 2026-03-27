import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Book } from '../types/book'
import toast from 'react-hot-toast'

export type CartItem = {
  book: Book
  quantity: number
}

type CartState = {
  items: CartItem[]
  totalQuantity: number
  subtotal: number
}

type CartActions = {
  addItem: (book: Book, quantity?: number) => void
  removeItem: (bookId: string | number) => void
  setQuantity: (bookId: string | number, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<(CartState & CartActions) | null>(null)

const STORAGE_KEY = 'qls_cart'

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as any
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((x) => {
        const book = x?.book as Book | undefined
        const quantity = Number(x?.quantity ?? 0)
        if (!book || (typeof book !== 'object' && typeof book !== 'function')) return null
        if (book.id === undefined || book.id === null) return null
        if (!Number.isFinite(quantity) || quantity <= 0) return null
        return { book, quantity } as CartItem
      })
      .filter(Boolean) as CartItem[]
  } catch {
    return []
  }
}

function clampQty(q: number) {
  if (!Number.isFinite(q)) return 1
  return Math.max(1, Math.min(99, Math.floor(q)))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => safeParseCart(localStorage.getItem(STORAGE_KEY)))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const state = useMemo<CartState>(() => {
    const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0)
    const subtotal = items.reduce((sum, it) => sum + it.quantity * (it.book.price || 0), 0)
    return { items, totalQuantity, subtotal }
  }, [items])

  const actions = useMemo<CartActions>(() => {
    return {
      addItem(book, quantity = 1) {
        const qty = clampQty(quantity)
        setItems((prev) => {
          const idx = prev.findIndex((x) => String(x.book.id) === String(book.id))
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = { book: next[idx].book, quantity: clampQty(next[idx].quantity + qty) }
            return next
          }
          return [...prev, { book, quantity: qty }]
        })
        toast.success('Đã thêm vào giỏ')
      },
      removeItem(bookId) {
        setItems((prev) => prev.filter((x) => String(x.book.id) !== String(bookId)))
      },
      setQuantity(bookId, quantity) {
        const qty = clampQty(quantity)
        setItems((prev) =>
          prev.map((x) => (String(x.book.id) === String(bookId) ? { ...x, quantity: qty } : x)),
        )
      },
      clear() {
        setItems([])
      },
    }
  }, [])

  return <CartContext.Provider value={{ ...state, ...actions }}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

