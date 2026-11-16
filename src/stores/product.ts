import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/productService'
import { useToastStore } from './toast'
import type { Product, ProductPayload } from '@/types/product'
import type { ApiErrorResponse } from '@/types/api'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const toastStore = useToastStore()

  // Computed metrics for dashboard and UI
  const totalProducts = computed(() => products.value.length)

  const totalInventoryValue = computed(() => {
    return products.value.reduce((acc, p) => acc + Number(p.price || 0) * Number(p.stock || 0), 0)
  })

  const lowStockCount = computed(() => {
    return products.value.filter((p) => Number(p.stock) <= 10).length
  })

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.getAll()
      products.value = response.data || []
      return products.value
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al obtener los productos'
      error.value = msg
      toastStore.error(msg, 'Error al Cargar Productos')
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.getById(id)
      currentProduct.value = response.data
      return response.data
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al obtener el detalle del producto'
      error.value = msg
      toastStore.error(msg, 'Error')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (payload: ProductPayload) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.create(payload)
      const newProduct = response.data
      products.value.unshift(newProduct)
      toastStore.success(response.message || 'Producto creado correctamente')
      return newProduct
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al crear el producto'
      error.value = msg
      toastStore.error(msg, 'Error de Validación')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: number | string, payload: ProductPayload) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.update(id, payload)
      const updated = response.data
      const index = products.value.findIndex((p) => p.id === Number(id))
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...updated }
      }
      if (currentProduct.value?.id === Number(id)) {
        currentProduct.value = updated
      }
      toastStore.success(response.message || 'Producto actualizado correctamente')
      return updated
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al actualizar el producto'
      error.value = msg
      toastStore.error(msg, 'Error al Actualizar')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.delete(id)
      products.value = products.value.filter((p) => p.id !== Number(id))
      toastStore.success(response.message || 'Producto eliminado correctamente')
      return true
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al eliminar el producto'
      error.value = msg
      toastStore.error(msg, 'Error al Eliminar')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    currentProduct,
    loading,
    error,
    totalProducts,
    totalInventoryValue,
    lowStockCount,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})
