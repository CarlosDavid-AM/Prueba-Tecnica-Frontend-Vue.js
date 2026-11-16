import apiClient from './api'
import type { ApiResponse } from '@/types/api'
import type { Category, CategoryPayload } from '@/types/category'

export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/categories')
    return response.data
  },

  async getById(id: number | string): Promise<ApiResponse<Category>> {
    const response = await apiClient.get<ApiResponse<Category>>(`/api/categories/${id}`)
    return response.data
  },

  async create(payload: CategoryPayload): Promise<ApiResponse<Category>> {
    const response = await apiClient.post<ApiResponse<Category>>('/api/categories', payload)
    return response.data
  },

  async update(id: number | string, payload: CategoryPayload): Promise<ApiResponse<Category>> {
    const response = await apiClient.put<ApiResponse<Category>>(`/api/categories/${id}`, payload)
    return response.data
  },

  async delete(id: number | string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/categories/${id}`)
    return response.data
  },
}
