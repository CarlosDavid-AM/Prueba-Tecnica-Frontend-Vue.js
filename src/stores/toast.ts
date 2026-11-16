import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast, ToastType } from '@/types/toast'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const duration = toast.duration ?? 4000

    const newToast: Toast = {
      ...toast,
      id,
      duration,
    }

    toasts.value.push(newToast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const success = (message: string, title = 'Operación Exitosa') => {
    return addToast({ type: 'success', title, message })
  }

  const error = (message: string, title = 'Error') => {
    return addToast({ type: 'error', title, message, duration: 5000 })
  }

  const warning = (message: string, title = 'Advertencia') => {
    return addToast({ type: 'warning', title, message })
  }

  const info = (message: string, title = 'Información') => {
    return addToast({ type: 'info', title, message })
  }

  const clearAll = () => {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  }
})
