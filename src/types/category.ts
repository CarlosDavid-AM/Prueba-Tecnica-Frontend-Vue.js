export interface Category {
  id: number
  name: string
  description?: string | null
  created_at?: string
  updated_at?: string
  products_count?: number
}

export interface CategoryPayload {
  name: string
  description?: string
}
