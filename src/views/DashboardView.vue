<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import StatCard from '@/components/common/StatCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import {
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from '@lucide/vue'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const isInitialLoading = ref(true)

const loadDashboardData = async () => {
  isInitialLoading.value = true
  try {
    await Promise.allSettled([
      productStore.fetchProducts(),
      categoryStore.fetchCategories(),
    ])
  } finally {
    isInitialLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(val)
}

const recentProducts = computed(() => {
  return [...productStore.products].slice(0, 5)
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Panel de Control
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Resumen general del catálogo, métricas de inventario y accesos directos.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="loadDashboardData"
          :disabled="isInitialLoading"
          class="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw :class="['w-4 h-4', isInitialLoading ? 'animate-spin' : '']" />
          <span>Sincronizar</span>
        </button>

        <RouterLink
          to="/products/create"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition shadow-indigo-100"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Crear Producto</span>
        </RouterLink>
      </div>
    </div>

    <!-- Stat Cards KPI Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Total Productos"
        :value="productStore.totalProducts"
        subtitle="Registrados en el sistema"
        :icon="Package"
        color="indigo"
        :loading="isInitialLoading"
      />
      <StatCard
        title="Total Categorías"
        :value="categoryStore.totalCategories"
        subtitle="Agrupaciones activas"
        :icon="Layers"
        color="purple"
        :loading="isInitialLoading"
      />
      <StatCard
        title="Valor Inventario"
        :value="formatCurrency(productStore.totalInventoryValue)"
        subtitle="Suma total (precio × stock)"
        :icon="DollarSign"
        color="emerald"
        :loading="isInitialLoading"
      />
      <StatCard
        title="Stock Crítico"
        :value="productStore.lowStockCount"
        subtitle="Productos con 10 o menos unidades"
        :icon="AlertTriangle"
        color="rose"
        :loading="isInitialLoading"
      />
    </div>

    <!-- Quick Shortcuts & Info Banner -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        class="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden"
      >
        <div class="relative z-10 space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <TrendingUp class="w-3.5 h-3.5" />
            <span>Gestión Rápida</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight">
            Catálogo de Productos
          </h2>
          <p class="text-sm text-slate-300 max-w-md leading-relaxed">
            Administra precios, existencias y clasificaciones de tus productos con validaciones en tiempo real y alertas estándar.
          </p>
        </div>
        <div class="pt-6 relative z-10 flex flex-wrap gap-3">
          <RouterLink
            to="/products"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-100 transition shadow-sm"
          >
            <span>Ver Inventario</span>
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
          <RouterLink
            to="/products/create"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition"
          >
            <PlusCircle class="w-4 h-4" />
            <span>Nuevo Producto</span>
          </RouterLink>
        </div>
      </div>

      <div
        class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs"
      >
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
            <Layers class="w-3.5 h-3.5" />
            <span>Estructura de Catálogo</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Categorías
          </h2>
          <p class="text-sm text-slate-600 leading-relaxed">
            Organiza tus productos por departamentos. La eliminación de categorías valida automáticamente la integridad referencial para evitar productos huérfanos.
          </p>
        </div>
        <div class="pt-6">
          <RouterLink
            to="/categories"
            class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition shadow-xs"
          >
            <span>Administrar Categorías</span>
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Recent Products Table Section -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-slate-900">Productos Recientes</h3>
          <p class="text-xs text-slate-500">Últimos artículos registrados en la plataforma</p>
        </div>
        <RouterLink
          to="/products"
          class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
        >
          <span>Ver todos ({{ productStore.totalProducts }})</span>
          <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <div v-if="isInitialLoading" class="p-12 flex justify-center">
        <LoadingSpinner size="lg" text="Cargando productos del catálogo..." />
      </div>

      <div v-else-if="recentProducts.length === 0" class="p-12 text-center">
        <Package class="w-12 h-12 mx-auto text-slate-300" />
        <p class="mt-2 text-sm font-semibold text-slate-700">No hay productos registrados</p>
        <p class="text-xs text-slate-500 mt-1">Crea tu primer producto para comenzar a operar.</p>
        <RouterLink
          to="/products/create"
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
        >
          <PlusCircle class="w-3.5 h-3.5" />
          <span>Crear Primer Producto</span>
        </RouterLink>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Producto</th>
              <th class="py-3.5 px-6">Categoría</th>
              <th class="py-3.5 px-6 text-right">Precio</th>
              <th class="py-3.5 px-6 text-center">Stock</th>
              <th class="py-3.5 px-6 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="product in recentProducts"
              :key="product.id"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-4 px-6 font-mono text-xs text-slate-400">#{{ product.id }}</td>
              <td class="py-4 px-6">
                <span class="font-bold text-slate-900 block">{{ product.name }}</span>
                <span class="text-xs text-slate-500 truncate max-w-xs block">
                  {{ product.description || 'Sin descripción' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {{ product.category?.name || `Cat #${product.category_id}` }}
                </span>
              </td>
              <td class="py-4 px-6 text-right font-bold text-slate-900">
                {{ formatCurrency(Number(product.price)) }}
              </td>
              <td class="py-4 px-6 text-center">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    Number(product.stock) <= 0
                      ? 'bg-rose-100 text-rose-700'
                      : Number(product.stock) <= 10
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700',
                  ]"
                >
                  {{ product.stock }} uds.
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <RouterLink
                  :to="`/products/edit/${product.id}`"
                  class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Editar
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
