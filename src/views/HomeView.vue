<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10">
    <div ref="heroRef" class="text-center mb-10">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style="color: var(--c-text)">
        ¿Por quién votarías en 2026?
      </h1>
      <p class="text-sm sm:text-base" style="color: var(--c-text-muted)">
        Selecciona tu candidato. Un voto por persona, resultados en tiempo real.
      </p>
    </div>

    <!-- Banner ya votó -->
    <div
      v-if="voteStore.hasVoted"
      class="rounded-2xl px-5 py-4 mb-8 text-center"
      style="background: oklch(96% 0.02 150)"
      role="status"
    >
      <p class="font-bold text-base" style="color: oklch(30% 0.08 150)">Ya registraste tu voto</p>
      <p class="text-sm mt-1" style="color: oklch(42% 0.06 150)">
        Solo se permite un voto por persona.
        <RouterLink to="/resultados" class="underline underline-offset-2 font-medium" style="color: var(--c-blue)">
          Ver resultados →
        </RouterLink>
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-24" aria-label="Cargando candidatos">
      <div
        class="rounded-full h-10 w-10 border-[3px] border-colombia-blue border-t-transparent animate-spin"
        role="status"
      />
    </div>

    <p v-else-if="error" class="text-center py-10 text-sm" style="color: var(--c-red)">
      {{ error }}
    </p>

    <div v-else ref="gridRef" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      <CandidateCard
        v-for="c in candidates"
        :key="c.id"
        :candidate="c"
        @vote="openModal"
      />
    </div>

    <VoteModal
      v-if="modalCandidate"
      :candidate="modalCandidate"
      @close="modalCandidate = null"
      @voted="modalCandidate = null"
    />

    <!-- Contexto electoral: visible para Google y usuarios -->
    <section class="mt-14 pt-10 border-t" style="border-color: var(--c-border)">
      <h2 class="text-lg font-bold mb-3" style="color: var(--c-text)">
        Elecciones presidenciales Colombia 2026
      </h2>
      <p class="text-sm leading-relaxed mb-4" style="color: var(--c-text-muted)">
        La primera vuelta de las elecciones presidenciales de Colombia 2026 se realizará el
        <strong>31 de mayo de 2026</strong>. Si ningún candidato supera el 50 % de los votos,
        habrá segunda vuelta el <strong>28 de junio de 2026</strong>.
      </p>
      <p class="text-sm leading-relaxed mb-4" style="color: var(--c-text-muted)">
        Esta encuesta informal de opinión ciudadana te permite votar por tu candidato presidencial
        favorito y ver los resultados en tiempo real. Participan candidatos como
        <strong>Claudia López</strong>, <strong>Sergio Fajardo</strong>,
        <strong>Carlos Caicedo</strong> y otros aspirantes a la presidencia de Colombia.
      </p>
      <p class="text-xs" style="color: var(--c-text-muted); opacity: 0.6">
        Encuesta informal · No es una votación oficial · No está registrada ante el CNE
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { gsap } from 'gsap'
import CandidateCard from '@/components/CandidateCard.vue'
import VoteModal from '@/components/VoteModal.vue'
import { useVoteStore } from '@/stores/vote'
import type { Candidate } from '@/stores/vote'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const voteStore = useVoteStore()
const candidates = ref<Candidate[]>([])
const modalCandidate = ref<Candidate | null>(null)
const loading = ref(true)
const error = ref('')

const heroRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(async () => {
  if (!reduced && heroRef.value) {
    gsap.from(heroRef.value, { y: 16, opacity: 0, duration: 0.55, ease: 'power3.out' })
  }

  try {
    const { data } = await axios.get<Candidate[]>(`${API_URL}/api/candidates`)
    candidates.value = data
  } catch {
    error.value = 'No se pudieron cargar los candidatos. Intenta más tarde.'
  } finally {
    loading.value = false
  }

  await nextTick()

  if (!reduced && gridRef.value?.children.length) {
    gsap.from(Array.from(gridRef.value.children), {
      y: 28,
      opacity: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: 'power3.out',
    })
  }
})

function openModal(candidate: Candidate) {
  modalCandidate.value = candidate
}
</script>
