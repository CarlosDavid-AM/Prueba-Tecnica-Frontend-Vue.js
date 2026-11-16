<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    title: string
    value: string | number
    subtitle?: string
    icon: Component
    color?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose'
    loading?: boolean
  }>(),
  {
    subtitle: '',
    color: 'indigo',
    loading: false,
  },
)

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
  },
}
</script>

<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {{ title }}
        </p>
        <div class="mt-2 flex items-baseline gap-2">
          <div v-if="loading" class="h-8 w-24 bg-slate-200 animate-pulse rounded-md" />
          <span v-else class="text-2xl font-black text-slate-900 tracking-tight">
            {{ value }}
          </span>
        </div>
        <p v-if="subtitle" class="mt-1 text-xs text-slate-500">
          {{ subtitle }}
        </p>
      </div>

      <div
        :class="[
          'p-3.5 rounded-2xl border flex items-center justify-center shrink-0',
          colorMap[color].bg,
          colorMap[color].text,
          colorMap[color].border,
        ]"
      >
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>
