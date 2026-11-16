<script setup lang="ts">
import { AlertTriangle, X } from '@lucide/vue'
import LoadingSpinner from './LoadingSpinner.vue'

withDefaults(
  defineProps<{
    show: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    danger?: boolean
  }>(),
  {
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    loading: false,
    danger: true,
  },
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
      >
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div
              :class="[
                'p-3 rounded-xl shrink-0',
                danger ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600',
              ]"
            >
              <AlertTriangle class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900">
                {{ title }}
              </h3>
              <p class="mt-2 text-sm text-slate-600 leading-relaxed">
                {{ message }}
              </p>
            </div>
            <button
              type="button"
              @click="emit('close')"
              class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Cerrar modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            :disabled="loading"
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            :disabled="loading"
            @click="emit('confirm')"
            :class="[
              'inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition shadow-sm cursor-pointer disabled:opacity-50',
              danger
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:ring-rose-100'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100',
            ]"
          >
            <LoadingSpinner v-if="loading" size="sm" color="white" />
            <span>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
