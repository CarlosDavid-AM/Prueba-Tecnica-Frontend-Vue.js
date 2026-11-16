<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from '@lucide/vue'

const toastStore = useToastStore()

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircle2
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    default:
      return Info
  }
}

const getStyles = (type: string) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
        icon: 'text-emerald-600',
        bar: 'bg-emerald-500',
      }
    case 'error':
      return {
        bg: 'bg-rose-50 border-rose-300 text-rose-900',
        icon: 'text-rose-600',
        bar: 'bg-rose-500',
      }
    case 'warning':
      return {
        bg: 'bg-amber-50 border-amber-300 text-amber-900',
        icon: 'text-amber-600',
        bar: 'bg-amber-500',
      }
    default:
      return {
        bg: 'bg-sky-50 border-sky-300 text-sky-900',
        icon: 'text-sky-600',
        bar: 'bg-sky-500',
      }
  }
}
</script>

<template>
  <div
    class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none sm:max-w-md"
    aria-live="assertive"
  >
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm transition-all"
        :class="getStyles(toast.type).bg"
      >
        <div class="p-4 flex items-start gap-3">
          <component
            :is="getIcon(toast.type)"
            class="w-5 h-5 mt-0.5 shrink-0"
            :class="getStyles(toast.type).icon"
          />
          <div class="flex-1 min-w-0">
            <h4 v-if="toast.title" class="text-sm font-semibold tracking-tight">
              {{ toast.title }}
            </h4>
            <p class="text-sm mt-0.5 break-words opacity-90 leading-snug">
              {{ toast.message }}
            </p>
          </div>
          <button
            type="button"
            @click="toastStore.removeToast(toast.id)"
            class="text-slate-400 hover:text-slate-700 transition p-1 rounded-lg hover:bg-black/5"
            aria-label="Cerrar notificación"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
