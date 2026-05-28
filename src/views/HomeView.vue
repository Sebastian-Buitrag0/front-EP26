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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { gsap } from 'gsap'
import CandidateCard from '@/components/CandidateCard.vue'
import VoteModal from '@/components/VoteModal.vue'
import type { Candidate } from '@/stores/vote'

const API_URL = import.meta.env.VITE_API_URL ?? ''

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
