import type { Category } from './category'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category_id: number
  category?: Category
  created_at?: string
  updated_at?: string
}

export interface ProductPayload {
  name: string
  description: string
  price: number
  stock: number
  category_id: number
}
