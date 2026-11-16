<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/common/AppNavbar.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <!-- Main Top Navigation -->
    <AppNavbar />

    <!-- Application Body Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <RouterView />
    </main>

    <!-- Global Floating Toast Notification System -->
    <ToastContainer />

    <!-- Application Footer -->
    <footer class="bg-white border-t border-slate-200 mt-auto py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span class="font-bold text-slate-700">StockMaster</span> — Sistema de Gestión de Productos y Categorías
        </div>
        <div class="flex items-center gap-4">
          <span>Vue 3 Composition API</span>
          <span>•</span>
          <span>Pinia Store</span>
          <span>•</span>
          <span>Axios REST Client</span>
          <span>•</span>
          <span>Tailwind CSS</span>
        </div>
      </div>
    </footer>
  </div>
</template>
