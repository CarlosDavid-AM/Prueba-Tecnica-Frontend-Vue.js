<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import {
  Package,
  ArrowLeft,
  Save,
  RotateCcw,
  AlertCircle,
  Layers,
  PlusCircle,
} from '@lucide/vue'
import type { ApiErrorResponse } from '@/types/api'
import type { ProductPayload } from '@/types/product'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const isEditMode = computed(() => !!route.params.id)
const productId = computed(() => route.params.id as string)

const isLoadingInitial = ref(false)
const isSubmitting = ref(false)

// Form State
const form = ref<ProductPayload>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: 0,
})

// Validation Errors State
const errors = ref<{
  name?: string
  description?: string
  price?: string
  stock?: string
  category_id?: string
}>({})

// Load initial data (categories and product detail if edit mode)
onMounted(async () => {
  isLoadingInitial.value = true
  try {
    if (categoryStore.categories.length === 0) {
      await categoryStore.fetchCategories()
    }

    if (isEditMode.value) {
      const product = await productStore.fetchProductById(productId.value)
      if (product) {
        form.value = {
          name: product.name,
          description: product.description || '',
          price: Number(product.price),
          stock: Number(product.stock),
          category_id: product.category_id,
        }
      }
    } else {
      // Default category if available
      const firstCategory = categoryStore.categories[0]
      if (firstCategory) {
        form.value.category_id = firstCategory.id
      }
    }
  } catch {
    // Handled in store with toast
  } finally {
    isLoadingInitial.value = false
  }
})

// Client-side validations
const validate = (): boolean => {
  errors.value = {}
  let valid = true

  // Nombre requerido
  if (!form.value.name || !form.value.name.trim()) {
    errors.value.name = 'El campo nombre es requerido.'
    valid = false
  } else if (form.value.name.trim().length < 2) {
    errors.value.name = 'El nombre debe tener al menos 2 caracteres.'
    valid = false
  }

  // Precio numérico y > 0
  if (
    form.value.price === null ||
    form.value.price === undefined ||
    isNaN(Number(form.value.price))
  ) {
    errors.value.price = 'El precio debe ser un valor numérico.'
    valid = false
  } else if (Number(form.value.price) <= 0) {
    errors.value.price = 'El precio debe ser un valor numérico mayor que 0.'
    valid = false
  }

  // Stock numérico y >= 0
  if (
    form.value.stock === null ||
    form.value.stock === undefined ||
    isNaN(Number(form.value.stock))
  ) {
    errors.value.stock = 'El stock debe ser un valor numérico.'
    valid = false
  } else if (Number(form.value.stock) < 0) {
    errors.value.stock = 'El stock no puede ser un número negativo.'
    valid = false
  }

  // Categoría requerida
  if (!form.value.category_id || Number(form.value.category_id) <= 0) {
    errors.value.category_id = 'Debes seleccionar una categoría válida.'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  errors.value = {}

  const payload: ProductPayload = {
    name: form.value.name.trim(),
    description: form.value.description ? form.value.description.trim() : '',
    price: Number(form.value.price),
    stock: Number(form.value.stock),
    category_id: Number(form.value.category_id),
  }

  try {
    if (isEditMode.value) {
      await productStore.updateProduct(productId.value, payload)
    } else {
      await productStore.createProduct(payload)
    }

    router.push('/products')
  } catch (err: any) {
    const apiErr = err as ApiErrorResponse
    if (apiErr?.errors) {
      if (apiErr.errors.name) errors.value.name = apiErr.errors.name[0]
      if (apiErr.errors.description) errors.value.description = apiErr.errors.description[0]
      if (apiErr.errors.price) errors.value.price = apiErr.errors.price[0]
      if (apiErr.errors.stock) errors.value.stock = apiErr.errors.stock[0]
      if (apiErr.errors.category_id) errors.value.category_id = apiErr.errors.category_id[0]
    }
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  if (isEditMode.value && productStore.currentProduct) {
    const p = productStore.currentProduct
    form.value = {
      name: p.name,
      description: p.description || '',
      price: Number(p.price),
      stock: Number(p.stock),
      category_id: p.category_id,
    }
  } else {
    const firstCategory = categoryStore.categories[0]
    form.value = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: firstCategory ? firstCategory.id : 0,
    }
  }
  errors.value = {}
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Breadcrumb & Top Bar -->
    <div class="flex items-center justify-between">
      <RouterLink
        to="/products"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Volver al listado de productos</span>
      </RouterLink>

      <span
        v-if="isEditMode"
        class="text-xs font-mono font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"
      >
        ID #{{ productId }}
      </span>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Card Header -->
      <div class="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
          <Package class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {{ isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
            {{
              isEditMode
                ? 'Actualiza los datos del producto en el inventario.'
                : 'Completa los campos requeridos para dar de alta un producto en el sistema.'
            }}
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingInitial" class="p-16 flex justify-center">
        <LoadingSpinner size="lg" text="Cargando información del producto..." />
      </div>

      <!-- Form Body -->
      <form v-else @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-6">
        <!-- Backend General Error Banner -->
        <div
          v-if="productStore.error"
          class="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm"
        >
          <AlertCircle class="w-5 h-5 text-rose-600 shrink-0" />
          <span>{{ productStore.error }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Campo: Nombre -->
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-slate-800 mb-1.5">
              Nombre del Producto <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Ej: Camiseta Overskull"
              :class="[
                'w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-hidden',
                errors.name
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-3 focus:ring-rose-100'
                  : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100',
              ]"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle class="w-3.5 h-3.5" />
              <span>{{ errors.name }}</span>
            </p>
          </div>

          <!-- Campo: Categoría -->
          <div class="md:col-span-2">
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-sm font-bold text-slate-800">
                Categoría <span class="text-rose-500">*</span>
              </label>
              <RouterLink
                to="/categories"
                class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <PlusCircle class="w-3.5 h-3.5" />
                <span>Gestionar Categorías</span>
              </RouterLink>
            </div>
            <div class="relative">
              <select
                v-model="form.category_id"
                :class="[
                  'w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-hidden appearance-none bg-white cursor-pointer',
                  errors.category_id
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-3 focus:ring-rose-100'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100',
                ]"
              >
                <option value="0" disabled>Selecciona una categoría...</option>
                <option
                  v-for="cat in categoryStore.categories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.name }} (ID #{{ cat.id }})
                </option>
              </select>
              <Layers class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p v-if="errors.category_id" class="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle class="w-3.5 h-3.5" />
              <span>{{ errors.category_id }}</span>
            </p>
          </div>

          <!-- Campo: Precio -->
          <div>
            <label class="block text-sm font-bold text-slate-800 mb-1.5">
              Precio (S/) <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                S/
              </span>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="89.90"
                :class="[
                  'w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition focus:outline-hidden',
                  errors.price
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-3 focus:ring-rose-100'
                    : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100',
                ]"
              />
            </div>
            <p class="text-[11px] text-slate-500 mt-1">Debe ser un valor numérico mayor a 0.</p>
            <p v-if="errors.price" class="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle class="w-3.5 h-3.5" />
              <span>{{ errors.price }}</span>
            </p>
          </div>

          <!-- Campo: Stock -->
          <div>
            <label class="block text-sm font-bold text-slate-800 mb-1.5">
              Stock (Unidades) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              step="1"
              min="0"
              placeholder="50"
              :class="[
                'w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-hidden',
                errors.stock
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-3 focus:ring-rose-100'
                  : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100',
              ]"
            />
            <p class="text-[11px] text-slate-500 mt-1">Cantidad disponible en inventario (≥ 0).</p>
            <p v-if="errors.stock" class="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle class="w-3.5 h-3.5" />
              <span>{{ errors.stock }}</span>
            </p>
          </div>

          <!-- Campo: Descripción -->
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-slate-800 mb-1.5">
              Descripción del Producto
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Ej: Camiseta negra edición limitada 100% algodón orgánico..."
              class="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition resize-none"
            />
            <p v-if="errors.description" class="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle class="w-3.5 h-3.5" />
              <span>{{ errors.description }}</span>
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            @click="resetForm"
            :disabled="isSubmitting"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <RotateCcw class="w-4 h-4" />
            <span>Restablecer</span>
          </button>

          <div class="w-full sm:w-auto flex items-center gap-3">
            <RouterLink
              to="/products"
              class="w-full sm:w-auto text-center px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs"
            >
              Cancelar
            </RouterLink>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 transition focus:ring-4 focus:ring-indigo-100 cursor-pointer disabled:opacity-50"
            >
              <LoadingSpinner v-if="isSubmitting" size="sm" color="white" />
              <Save v-else class="w-4 h-4" />
              <span>{{ isEditMode ? 'Actualizar Producto' : 'Guardar Producto' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
