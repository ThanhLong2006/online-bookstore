import type { Book, PageResult } from '../../types/book'
import { apiRequest } from './http'
import { mockGetBook, mockGetBooks } from './mockData'

export type GetBooksParams = {
  q?: string
  categoryId?: string | number
  minPrice?: number
  maxPrice?: number
  page?: number
  pageSize?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
}

// Expected REST endpoints (you can adjust to your backend):
// - GET /books?q=&categoryId=&page=&pageSize=&sort=
// - GET /books/:id
export function getBooks(params?: GetBooksParams, signal?: AbortSignal) {
  return apiRequest<PageResult<Book>>('/books', { method: 'GET', query: params, signal }).catch(
    (e) => {
      // If user navigates away, keep the abort error behavior.
      if (signal?.aborted) throw e
      // Fallback to mock data when API is unavailable (dev-friendly).
      return mockGetBooks(params)
    },
  )
}

export function getBook(id: string | number, signal?: AbortSignal) {
  return apiRequest<Book>(`/books/${id}`, { method: 'GET', signal }).catch((e) => {
    if (signal?.aborted) throw e
    const b = mockGetBook(id)
    if (!b) throw e
    return b
  })
}

