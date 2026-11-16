<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Package,
  Layers,
  PlusCircle,
  Menu,
  X,
  Database,
} from '@lucide/vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Productos', path: '/products', icon: Package },
  { name: 'Categorías', path: '/categories', icon: Layers },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-8">
          <RouterLink to="/" class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition"
            >
              <Package class="w-5 h-5" />
            </div>
            <div>
              <span class="font-extrabold text-slate-900 tracking-tight text-lg block leading-none">
                Stock<span class="text-indigo-600">Master</span>
              </span>
              <span class="text-[11px] text-slate-600 font-medium tracking-wide">
                Gestor Productos & Categorías
              </span>
            </div>
          </RouterLink>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center gap-1">
            <RouterLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              :class="[
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition',
                isActive(link.path)
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
              ]"
            >
              <component :is="link.icon" class="w-4 h-4" />
              <span>{{ link.name }}</span>
            </RouterLink>
          </nav>
        </div>

        <!-- Right Side: API Status Badge & CTA -->
        <div class="hidden sm:flex items-center gap-3">
          <div
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600"
            title="Base API: http://localhost:8000"
          >
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Database class="w-3.5 h-3.5 text-slate-500" />
            <span class="font-medium text-slate-700">API: localhost:8000</span>
          </div>

          <RouterLink
            to="/products/create"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition focus:ring-4 focus:ring-indigo-100 active:scale-95"
          >
            <PlusCircle class="w-4 h-4" />
            <span>Nuevo Producto</span>
          </RouterLink>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="flex sm:hidden">
          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Abrir menú"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown -->
    <div v-if="mobileMenuOpen" class="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        @click="mobileMenuOpen = false"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium',
          isActive(link.path)
            ? 'bg-indigo-50 text-indigo-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-50',
        ]"
      >
        <component :is="link.icon" class="w-5 h-5" />
        <span>{{ link.name }}</span>
      </RouterLink>

      <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
        <RouterLink
          to="/products/create"
          @click="mobileMenuOpen = false"
          class="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-sm"
        >
          <PlusCircle class="w-5 h-5" />
          <span>Nuevo Producto</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
