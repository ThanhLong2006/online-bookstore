import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import toast from 'react-hot-toast'
import type { Book } from '../types/book'

type CompareState = {
  items: Book[]
  count: number
  has: (bookId: string | number) => boolean
}

type CompareActions = {
  toggle: (book: Book) => void
  remove: (bookId: string | number) => void
  clear: () => void
}

const CompareContext = createContext<(CompareState & CompareActions) | null>(null)
const STORAGE_KEY = 'qls_compare'
const MAX_ITEMS = 4

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

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Book[]>(() => safeParse(localStorage.getItem(STORAGE_KEY)))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const state = useMemo<CompareState>(() => {
    const has = (bookId: string | number) => items.some((b) => String(b.id) === String(bookId))
    return { items, count: items.length, has }
  }, [items])

  const actions = useMemo<CompareActions>(() => {
    return {
      toggle(book) {
        setItems((prev) => {
          const exists = prev.some((b) => String(b.id) === String(book.id))
          if (exists) {
            toast('Đã bỏ khỏi danh sách so sánh')
            return prev.filter((b) => String(b.id) !== String(book.id))
          }
          if (prev.length >= MAX_ITEMS) {
            toast.error(`Chỉ so sánh tối đa ${MAX_ITEMS} sách`)
            return prev
          }
          toast.success('Đã thêm vào danh sách so sánh')
          return [book, ...prev]
        })
      },
      remove(bookId) {
        setItems((prev) => prev.filter((b) => String(b.id) !== String(bookId)))
        toast('Đã xoá khỏi so sánh')
      },
      clear() {
        setItems([])
        toast('Đã xoá danh sách so sánh')
      },
    }
  }, [])

  return <CompareContext.Provider value={{ ...state, ...actions }}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}

