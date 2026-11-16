<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCategoryStore } from '@/stores/category'
import CategoryModal from '@/components/categories/CategoryModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import {
  Layers,
  PlusCircle,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
  FolderTree,
} from '@lucide/vue'
import type { Category } from '@/types/category'

const categoryStore = useCategoryStore()

const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedCategory = ref<Category | null>(null)

const isDeleting = ref(false)
const categoryToDelete = ref<Category | null>(null)
const showDeleteModal = ref(false)

const loadCategories = async () => {
  await categoryStore.fetchCategories()
}

onMounted(() => {
  loadCategories()
})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categoryStore.categories
  }
  const q = searchQuery.value.toLowerCase().trim()
  return categoryStore.categories.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)),
  )
})

const openCreateModal = () => {
  selectedCategory.value = null
  isModalOpen.value = true
}

const openEditModal = (cat: Category) => {
  selectedCategory.value = cat
  isModalOpen.value = true
}

const openDeleteModal = (cat: Category) => {
  categoryToDelete.value = cat
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!categoryToDelete.value) return
  isDeleting.value = true
  try {
    await categoryStore.deleteCategory(categoryToDelete.value.id)
    showDeleteModal.value = false
    categoryToDelete.value = null
  } catch {
    // If backend rejects because category has products, the error toast is already shown by categoryStore
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
            Listado de Categorías
          </h1>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700"
          >
            {{ categoryStore.totalCategories }} registradas
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-500">
          Clasifica tus productos por familia o categoría comercial.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="loadCategories"
          :disabled="categoryStore.loading"
          class="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs disabled:opacity-50 cursor-pointer"
          title="Recargar categorías"
        >
          <RefreshCw :class="['w-4 h-4', categoryStore.loading ? 'animate-spin' : '']" />
          <span class="hidden sm:inline">Refrescar</span>
        </button>

        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-xs transition shadow-purple-100 focus:ring-4 focus:ring-purple-100 cursor-pointer"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
      <div class="relative w-full max-w-md">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar categorías por nombre o descripción..."
          class="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-purple-500 focus:ring-3 focus:ring-purple-100 transition"
        />
      </div>
    </div>

    <!-- Error Banner -->
    <div
      v-if="categoryStore.error"
      class="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm"
    >
      <div class="flex items-center gap-3">
        <AlertCircle class="w-5 h-5 text-rose-600 shrink-0" />
        <span>{{ categoryStore.error }}</span>
      </div>
      <button
        type="button"
        @click="loadCategories"
        class="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
      >
        Reintentar
      </button>
    </div>

    <!-- Categories Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden relative min-h-[300px]">
      <!-- Loading Overlay -->
      <div
        v-if="categoryStore.loading"
        class="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 flex items-center justify-center"
      >
        <LoadingSpinner size="lg" text="Cargando categorías..." />
      </div>

      <!-- Empty State -->
      <div
        v-if="!categoryStore.loading && filteredCategories.length === 0"
        class="py-16 px-4 text-center"
      >
        <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <FolderTree class="w-8 h-8" />
        </div>
        <h3 class="text-base font-bold text-slate-900">
          No se encontraron categorías
        </h3>
        <p class="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          {{
            searchQuery
              ? 'No hay categorías que coincidan con tu búsqueda.'
              : 'Aún no se ha registrado ninguna categoría en el sistema.'
          }}
        </p>
        <div class="mt-4 flex justify-center gap-3">
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Limpiar búsqueda
          </button>
          <button
            v-else
            type="button"
            @click="openCreateModal"
            class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 shadow-xs cursor-pointer"
          >
            <PlusCircle class="w-4 h-4" />
            <span>Crear Categoría</span>
          </button>
        </div>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th class="py-4 px-6 w-20">ID</th>
              <th class="py-4 px-6">Nombre de la Categoría</th>
              <th class="py-4 px-6">Descripción</th>
              <th class="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="cat in filteredCategories"
              :key="cat.id"
              class="hover:bg-slate-50/70 transition group"
            >
              <td class="py-4 px-6 font-mono text-xs text-slate-400 font-semibold">
                #{{ cat.id }}
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Layers class="w-4 h-4" />
                  </div>
                  <span class="font-bold text-slate-900 group-hover:text-purple-700 transition">
                    {{ cat.name }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="text-xs text-slate-500 line-clamp-2 max-w-lg">
                  {{ cat.description || 'Sin descripción' }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="inline-flex items-center justify-end gap-1">
                  <button
                    type="button"
                    @click="openEditModal(cat)"
                    class="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                    title="Editar categoría"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    @click="openDeleteModal(cat)"
                    class="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Eliminar categoría"
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

    <!-- Category Modal (Create / Edit) -->
    <CategoryModal
      :show="isModalOpen"
      :category="selectedCategory"
      @close="isModalOpen = false"
      @saved="loadCategories"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      :title="`¿Eliminar categoría '${categoryToDelete?.name}'?`"
      message="El sistema validará que esta categoría no contenga productos asociados antes de proceder."
      confirm-text="Eliminar Categoría"
      cancel-text="Cancelar"
      :loading="isDeleting"
      :danger="true"
      @confirm="confirmDelete"
      @close="showDeleteModal = false"
    />
  </div>
</template>
