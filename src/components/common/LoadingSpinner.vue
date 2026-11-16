<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'white' | 'slate'
    text?: string
  }>(),
  {
    size: 'md',
    color: 'primary',
    text: '',
  },
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4 border-2'
    case 'lg':
      return 'w-10 h-10 border-4'
    default:
      return 'w-6 h-6 border-3'
  }
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'white':
      return 'border-white/30 border-t-white'
    case 'slate':
      return 'border-slate-300 border-t-slate-600'
    default:
      return 'border-indigo-200 border-t-indigo-600'
  }
})
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <div
      :class="[
        'rounded-full animate-spin',
        sizeClasses,
        colorClasses,
      ]"
      role="status"
      aria-label="Cargando"
    />
    <span v-if="text" class="text-sm font-medium text-slate-600">{{ text }}</span>
  </div>
</template>
