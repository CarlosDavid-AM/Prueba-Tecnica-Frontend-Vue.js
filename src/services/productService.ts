import apiClient from './api'
import type { ApiResponse } from '@/types/api'
import type { Product, ProductPayload } from '@/types/product'

export const productService = {
  async getAll(): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/api/products')
    return response.data
  },

  async getById(id: number | string): Promise<ApiResponse<Product>> {
    const response = await apiClient.get<ApiResponse<Product>>(`/api/products/${id}`)
    return response.data
  },

  async create(payload: ProductPayload): Promise<ApiResponse<Product>> {
    const response = await apiClient.post<ApiResponse<Product>>('/api/products', payload)
    return response.data
  },

  async update(id: number | string, payload: ProductPayload): Promise<ApiResponse<Product>> {
    const response = await apiClient.put<ApiResponse<Product>>(`/api/products/${id}`, payload)
    return response.data
  },

  async delete(id: number | string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/products/${id}`)
    return response.data
  },
}
