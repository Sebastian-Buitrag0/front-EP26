import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/resultados', component: () => import('@/views/ResultsView.vue') },
    { path: '/privacidad', component: () => import('@/views/PrivacyView.vue') }
  ]
})

export default router
