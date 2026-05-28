import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const SITE = 'https://encuesta-presidencial-2026.online'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: {
        title: 'Encuesta Presidencial Colombia 2026 | ¿A quién votarías?',
        description:
          'Participa en la encuesta presidencial informal de Colombia 2026. Vota por tu candidato favorito — Claudia López, Sergio Fajardo, Carlos Caicedo y más — y mira los resultados en tiempo real.',
      },
    },
    {
      path: '/resultados',
      component: () => import('@/views/ResultsView.vue'),
      meta: {
        title: 'Resultados en tiempo real | Encuesta Presidencial Colombia 2026',
        description:
          '¿Quién va ganando la encuesta presidencial informal de Colombia 2026? Resultados actualizados en tiempo real. Votos ciudadanos y honorarios por candidato.',
      },
    },
    {
      path: '/privacidad',
      component: () => import('@/views/PrivacyView.vue'),
      meta: {
        title: 'Política de Privacidad | Encuesta Presidencial Colombia 2026',
        description: 'Política de privacidad de la encuesta informal de opinión presidencial Colombia 2026.',
      },
    },
  ],
})

router.afterEach((to) => {
  const { title, description } = to.meta as { title?: string; description?: string }
  const url = `${SITE}${to.path}`

  if (title) document.title = title

  setMeta('name', 'description', description)
  setLink('canonical', url)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', url)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
})

function setMeta(attr: string, key: string, value?: string) {
  if (!value) return
  const el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (el) el.setAttribute('content', value)
}

function setLink(rel: string, value: string) {
  const el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (el) el.setAttribute('href', value)
}

export default router
