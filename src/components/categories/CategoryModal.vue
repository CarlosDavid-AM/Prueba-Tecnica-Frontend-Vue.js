<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCategoryStore } from '@/stores/category'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { Layers, X } from '@lucide/vue'
import type { Category } from '@/types/category'
import type { ApiErrorResponse } from '@/types/api'

const props = defineProps<{
  show: boolean
  category?: Category | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', category: Category): void
}>()

const categoryStore = useCategoryStore()

const formData = ref({
  name: '',
  description: '',
})

const errors = ref<{
  name?: string
  description?: string
}>({})

const isSubmitting = ref(false)

// Populate form when modal opens or category prop changes
watch(
  () => props.category,
  (newVal) => {
    if (newVal) {
      formData.value = {
        name: newVal.name || '',
        description: newVal.description || '',
      }
    } else {
      formData.value = {
        name: '',
        description: '',
      }
    }
    errors.value = {}
  },
  { immediate: true },
)

watch(
  () => props.show,
  (show) => {
    if (show && !props.category) {
      formData.value = { name: '', description: '' }
      errors.value = {}
    }
  },
)

const validate = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.name.trim()) {
    errors.value.name = 'El nombre de la categoría es obligatorio.'
    isValid = false
  } else if (formData.value.name.trim().length < 2) {
    errors.value.name = 'El nombre debe tener al menos 2 caracteres.'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  errors.value = {}

  try {
    let result: Category
    if (props.category?.id) {
      result = await categoryStore.updateCategory(props.category.id, {
        name: formData.value.name.trim(),
        description: formData.value.description.trim() || undefined,
      })
    } else {
      result = await categoryStore.createCategory({
        name: formData.value.name.trim(),
        description: formData.value.description.trim() || undefined,
      })
    }
    emit('saved', result)
    emit('close')
  } catch (err: any) {
    const apiErr = err as ApiErrorResponse
    if (apiErr?.errors) {
      if (apiErr.errors.name) errors.value.name = apiErr.errors.name[0]
      if (apiErr.errors.description) errors.value.description = apiErr.errors.description[0]
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
      >
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Layers class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ category ? 'Editar Categoría' : 'Nueva Categoría' }}
              </h3>
              <p class="text-xs text-slate-500">
                {{ category ? `Modificando ID #${category.id}` : 'Registra una categoría para agrupar productos' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="emit('close')"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Campo Nombre -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">
              Nombre de la Categoría <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Ej: Ropa Urbana, Tecnología, Calzado"
              :class="[
                'w-full px-3.5 py-2.5 rounded-xl border text-sm transition focus:outline-hidden',
                errors.name
                  ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-3 focus:ring-rose-100'
                  : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100',
              ]"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs text-rose-600 font-medium">
              {{ errors.name }}
            </p>
          </div>

          <!-- Campo Descripción -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Breve descripción o alcance de esta categoría..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition resize-none"
            />
            <p v-if="errors.description" class="mt-1.5 text-xs text-rose-600 font-medium">
              {{ errors.description }}
            </p>
          </div>

          <!-- Footer Actions -->
          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              :disabled="isSubmitting"
              @click="emit('close')"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition focus:ring-4 focus:ring-indigo-100 cursor-pointer disabled:opacity-50"
            >
              <LoadingSpinner v-if="isSubmitting" size="sm" color="white" />
              <span>{{ category ? 'Guardar Cambios' : 'Crear Categoría' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
