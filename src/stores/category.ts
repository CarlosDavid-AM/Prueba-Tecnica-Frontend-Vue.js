import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoryService } from '@/services/categoryService'
import { useToastStore } from './toast'
import type { Category, CategoryPayload } from '@/types/category'
import type { ApiErrorResponse } from '@/types/api'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const toastStore = useToastStore()

  const totalCategories = computed(() => categories.value.length)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await categoryService.getAll()
      categories.value = response.data || []
      return categories.value
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al obtener las categorías'
      error.value = msg
      toastStore.error(msg, 'Error al Cargar Categorías')
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCategoryById = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const response = await categoryService.getById(id)
      currentCategory.value = response.data
      return response.data
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al obtener la categoría'
      error.value = msg
      toastStore.error(msg, 'Error')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (payload: CategoryPayload) => {
    loading.value = true
    error.value = null
    try {
      const response = await categoryService.create(payload)
      const newCategory = response.data
      categories.value.unshift(newCategory)
      toastStore.success(response.message || 'Categoría creada correctamente')
      return newCategory
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al crear la categoría'
      error.value = msg
      toastStore.error(msg, 'Error al Guardar')
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number | string, payload: CategoryPayload) => {
    loading.value = true
    error.value = null
    try {
      const response = await categoryService.update(id, payload)
      const updated = response.data
      const index = categories.value.findIndex((c) => c.id === Number(id))
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...updated }
      }
      if (currentCategory.value?.id === Number(id)) {
        currentCategory.value = updated
      }
      toastStore.success(response.message || 'Categoría actualizada correctamente')
      return updated
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al actualizar la categoría'
      error.value = msg
      toastStore.error(msg, 'Error al Actualizar')
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const response = await categoryService.delete(id)
      categories.value = categories.value.filter((c) => c.id !== Number(id))
      toastStore.success(response.message || 'Categoría eliminada correctamente')
      return true
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse
      const msg = apiErr.message || 'Error al eliminar la categoría'
      error.value = msg
      toastStore.error(msg, 'No se pudo eliminar')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    currentCategory,
    loading,
    error,
    totalCategories,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
