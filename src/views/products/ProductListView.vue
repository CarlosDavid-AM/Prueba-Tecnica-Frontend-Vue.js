<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
} from '@lucide/vue'
import type { Product } from '@/types/product'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const isDeleting = ref(false)
const productToDelete = ref<Product | null>(null)
const showDeleteModal = ref(false)

const loadData = async () => {
  await Promise.allSettled([
    productStore.fetchProducts(),
    categoryStore.fetchCategories(),
  ])
}

onMounted(() => {
  loadData()
})

const filteredProducts = computed(() => {
  let list = productStore.products

  if (selectedCategory.value !== 'all') {
    const catId = Number(selectedCategory.value)
    list = list.filter((p) => p.category_id === catId)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)),
    )
  }

  return list
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(val)
}

const openDeleteModal = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!productToDelete.value) return
  isDeleting.value = true
  try {
    await productStore.deleteProduct(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Listado de Productos
          </h1>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700"
          >
            {{ productStore.totalProducts }} items
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-500">
          Consulta, filtra, actualiza y gestiona las existencias del catálogo.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="loadData"
          :disabled="productStore.loading"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs disabled:opacity-50 cursor-pointer"
          title="Recargar productos"
        >
          <RefreshCw :class="['w-4 h-4', productStore.loading ? 'animate-spin' : '']" />
          <span class="hidden sm:inline">Refrescar</span>
        </button>

        <RouterLink
          to="/products/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition shadow-indigo-100 focus:ring-4 focus:ring-indigo-100"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Crear Producto</span>
        </RouterLink>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
      <div class="relative w-full md:w-96">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o descripción..."
          class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <div class="flex items-center gap-2 w-full md:w-auto">
          <Filter class="w-4 h-4 text-slate-400 shrink-0" />
          <select
            v-model="selectedCategory"
            class="w-full md:w-48 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            <option
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Error Banner if any -->
    <div
      v-if="productStore.error"
      class="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm"
    >
      <div class="flex items-center gap-3">
        <AlertCircle class="w-5 h-5 text-rose-600 shrink-0" />
        <span>{{ productStore.error }}</span>
      </div>
      <button
        type="button"
        @click="loadData"
        class="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
      >
        Reintentar
      </button>
    </div>

    <!-- Products Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden relative min-h-[300px]">
      <!-- Loading Overlay -->
      <div
        v-if="productStore.loading"
        class="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 flex items-center justify-center"
      >
        <LoadingSpinner size="lg" text="Cargando catálogo..." />
      </div>

      <!-- Empty State -->
      <div
        v-if="!productStore.loading && filteredProducts.length === 0"
        class="py-16 px-4 text-center"
      >
        <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Package class="w-8 h-8" />
        </div>
        <h3 class="text-base font-bold text-slate-900">
          No se encontraron productos
        </h3>
        <p class="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          {{
            searchQuery || selectedCategory !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda o categoría.'
              : 'Empieza registrando tu primer producto en la plataforma.'
          }}
        </p>
        <div class="mt-4 flex justify-center gap-3">
          <button
            v-if="searchQuery || selectedCategory !== 'all'"
            type="button"
            @click="searchQuery = ''; selectedCategory = 'all'"
            class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Limpiar filtros
          </button>
          <RouterLink
            v-else
            to="/products/create"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs"
          >
            <PlusCircle class="w-4 h-4" />
            <span>Crear Producto</span>
          </RouterLink>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th class="py-4 px-6">ID</th>
              <th class="py-4 px-6">Nombre & Descripción</th>
              <th class="py-4 px-6">Categoría</th>
              <th class="py-4 px-6 text-right">Precio</th>
              <th class="py-4 px-6 text-center">Stock</th>
              <th class="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-slate-50/70 transition group"
            >
              <td class="py-4 px-6 font-mono text-xs text-slate-400 font-semibold">
                #{{ product.id }}
              </td>
              <td class="py-4 px-6">
                <span class="font-bold text-slate-900 block group-hover:text-indigo-600 transition">
                  {{ product.name }}
                </span>
                <span class="text-xs text-slate-500 block line-clamp-1 max-w-sm mt-0.5">
                  {{ product.description || 'Sin descripción' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100"
                >
                  {{ product.category?.name || `ID #${product.category_id}` }}
                </span>
              </td>
              <td class="py-4 px-6 text-right font-black text-slate-900">
                {{ formatCurrency(Number(product.price)) }}
              </td>
              <td class="py-4 px-6 text-center">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold',
                    Number(product.stock) <= 0
                      ? 'bg-rose-100 text-rose-800'
                      : Number(product.stock) <= 10
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800',
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full mr-1.5',
                      Number(product.stock) <= 0
                        ? 'bg-rose-500'
                        : Number(product.stock) <= 10
                        ? 'bg-amber-500'
                        : 'bg-emerald-500',
                    ]"
                  ></span>
                  {{ product.stock }} uds.
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="inline-flex items-center justify-end gap-1">
                  <RouterLink
                    :to="`/products/edit/${product.id}`"
                    class="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Editar producto"
                  >
                    <Pencil class="w-4 h-4" />
                  </RouterLink>
                  <button
                    type="button"
                    @click="openDeleteModal(product)"
                    class="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Eliminar producto"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      :title="`¿Eliminar '${productToDelete?.name}'?`"
      message="Esta acción eliminará permanentemente el producto del inventario. Esta operación no se puede deshacer."
      confirm-text="Eliminar Producto"
      cancel-text="Cancelar"
      :loading="isDeleting"
      :danger="true"
      @confirm="confirmDelete"
      @close="showDeleteModal = false"
    />
  </div>
</template>
