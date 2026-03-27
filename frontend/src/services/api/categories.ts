import type { Category } from '../../types/book'
import { apiRequest } from './http'
import { mockGetCategories } from './mockData'

export function getCategories(signal?: AbortSignal) {
  return apiRequest<Category[]>('/categories', { method: 'GET', signal }).catch((e) => {
    if (signal?.aborted) throw e
    return mockGetCategories()
  })
}

