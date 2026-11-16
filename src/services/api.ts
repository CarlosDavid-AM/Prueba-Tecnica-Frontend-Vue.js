import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios'
import type { ApiResponse, ApiErrorResponse } from '@/types/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
})

// Response interceptor to normalize error responses
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data) {
      // Backend returned standard error response
      return Promise.reject(error.response.data)
    }

    if (error.request) {
      // Network error or server not responding
      const networkError: ApiErrorResponse = {
        success: false,
        message:
          'No se pudo conectar con el servidor backend (http://localhost:8000). Asegúrate de que la API esté iniciada.',
      }
      return Promise.reject(networkError)
    }

    const genericError: ApiErrorResponse = {
      success: false,
      message: error.message || 'Ocurrió un error inesperado en la solicitud',
    }
    return Promise.reject(genericError)
  },
)

export default apiClient
