import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import type { Book } from '../types/book'

type WishlistState = {
  items: Book[]
  count: number
  has: (bookId: string | number) => boolean
}

type WishlistActions = {
  toggle: (book: Book) => void
  remove: (bookId: string | number) => void
  clear: () => void
}

const WishlistContext = createContext<(WishlistState & WishlistActions) | null>(null)
const STORAGE_KEY = 'qls_wishlist'

function safeParse(raw: string | null): Book[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as any
    if (!Array.isArray(parsed)) return []
    return parsed.filter((b) => b && typeof b === 'object' && (b.id !== undefined && b.id !== null)) as Book[]
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Book[]>(() => safeParse(localStorage.getItem(STORAGE_KEY)))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const state = useMemo<WishlistState>(() => {
    const has = (bookId: string | number) => items.some((b) => String(b.id) === String(bookId))
    return { items, count: items.length, has }
  }, [items])

  const actions = useMemo<WishlistActions>(() => {
    return {
      toggle(book) {
        setItems((prev) => {
          const exists = prev.some((b) => String(b.id) === String(book.id))
          if (exists) {
            toast('Đã bỏ khỏi yêu thích')
            return prev.filter((b) => String(b.id) !== String(book.id))
          }
          toast.success('Đã thêm vào yêu thích')
          return [book, ...prev]
        })
      },
      remove(bookId) {
        setItems((prev) => prev.filter((b) => String(b.id) !== String(bookId)))
        toast('Đã xoá khỏi yêu thích')
      },
      clear() {
        setItems([])
        toast('Đã xoá danh sách yêu thích')
      },
    }
  }, [])

  return <WishlistContext.Provider value={{ ...state, ...actions }}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

