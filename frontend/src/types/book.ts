export type Category = {
  id: string | number
  name: string
  slug?: string
}

export type Book = {
  id: string | number
  title: string
  author?: string
  description?: string
  publisher?: string
  year?: number
  pages?: number
  price: number
  originalPrice?: number
  discountPercent?: number
  rating?: number
  ratingCount?: number
  sold?: number
  views?: number
  isNew?: boolean
  coverUrl?: string
  category?: Category
  stock?: number
  createdAt?: string
}

export type PageResult<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
}

