import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import ProductListView from '@/views/products/ProductListView.vue'
import ProductFormView from '@/views/products/ProductFormView.vue'
import CategoryListView from '@/views/categories/CategoryListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: 'Dashboard' },
    },
    {
      path: '/products',
      name: 'products.list',
      component: ProductListView,
      meta: { title: 'Listado de Productos' },
    },
    {
      path: '/products/create',
      name: 'products.create',
      component: ProductFormView,
      meta: { title: 'Nuevo Producto' },
    },
    {
      path: '/products/edit/:id',
      name: 'products.edit',
      component: ProductFormView,
      meta: { title: 'Editar Producto' },
    },
    {
      path: '/categories',
      name: 'categories.list',
      component: CategoryListView,
      meta: { title: 'Listado de Categorías' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const title = (to.meta.title as string) || 'StockMaster'
  document.title = `${title} | Gestor de Productos & Categorías`
  next()
})

export default router
