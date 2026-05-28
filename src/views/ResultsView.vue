<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-10">

    <!-- Banner voto honorario -->
    <div
      v-if="justVotedHonorary"
      class="rounded-2xl px-5 py-4 mb-8 text-center"
      style="background: var(--c-yellow-bg)"
      role="status"
    >
      <p class="font-bold text-base" style="color: oklch(35% 0.1 80)">
        Tu voto honorario fue registrado
      </p>
      <p class="text-sm mt-1" style="color: oklch(42% 0.08 80)">
        Aunque no puedas votar oficialmente aún, tu opinión también importa.
      </p>
    </div>

    <div class="text-center mb-10">
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1" style="color: var(--c-text)">
        Resultados en tiempo real
      </h1>
      <p class="text-sm" style="color: var(--c-text-muted)">
        Actualización automática cada 10 segundos
      </p>
    </div>

    <div v-if="loading && !summary" class="flex justify-center py-20" aria-label="Cargando resultados">
      <div class="rounded-full h-10 w-10 border-[3px] border-colombia-blue border-t-transparent animate-spin" role="status" />
    </div>

    <template v-else-if="summary">

      <!-- Votos ciudadanos -->
      <section class="mb-10" aria-labelledby="votos-ciudadanos">
        <div class="flex items-center gap-3 mb-5">
          <h2 id="votos-ciudadanos" class="text-base font-bold" style="color: var(--c-text)">
            Votos ciudadanos
          </h2>
          <span
            class="text-xs font-bold px-2.5 py-1 rounded-full text-white"
            style="background: var(--c-blue)"
          >
            {{ summary.totalVotes.toLocaleString('es-CO') }}
          </span>
        </div>

        <p v-if="summary.totalVotes === 0" class="text-sm text-center py-8" style="color: var(--c-text-muted)">
          Aún no hay votos registrados.
        </p>
        <div v-else class="space-y-5">
          <ResultsBar
            v-for="r in summary.results"
            :key="r.candidateId"
            :name="r.candidateName"
            :votes="r.votes"
            :pct="r.percentage"
            color="blue"
          />
        </div>
      </section>

      <!-- Divisor -->
      <div class="my-8" style="border-top: 1px dashed var(--c-border)" />

      <!-- Votos honorarios -->
      <section aria-labelledby="votos-honorarios">
        <div class="flex items-center gap-3 mb-5">
          <h2 id="votos-honorarios" class="text-base font-bold" style="color: var(--c-text)">
            Votos honorarios
          </h2>
          <span
            class="text-xs font-bold px-2.5 py-1 rounded-full"
            style="background: var(--c-yellow); color: oklch(30% 0.08 80)"
          >
            {{ summary.totalHonoraryVotes.toLocaleString('es-CO') }}
          </span>
          <span class="text-xs" style="color: var(--c-text-muted)">(menores de 18 años)</span>
        </div>

        <p v-if="summary.totalHonoraryVotes === 0" class="text-sm text-center py-8" style="color: var(--c-text-muted)">
          Aún no hay votos honorarios registrados.
        </p>
        <div v-else class="space-y-5">
          <ResultsBar
            v-for="r in summary.results"
            :key="r.candidateId"
            :name="r.candidateName"
            :votes="r.honoraryVotes"
            :pct="r.honoraryPercentage"
            color="yellow"
          />
        </div>
      </section>

    </template>

    <div class="text-center mt-12">
      <RouterLink
        to="/"
        class="text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
        style="color: var(--c-blue)"
      >
        ← Volver a votar
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import axios from 'axios'
import ResultsBar from '@/components/ResultsBar.vue'

interface ResultItem {
  candidateId: number
  candidateName: string
  votes: number
  percentage: number
  honoraryVotes: number
  honoraryPercentage: number
}

interface Summary {
  results: ResultItem[]
  totalVotes: number
  totalHonoraryVotes: number
}

const API_URL = import.meta.env.VITE_API_URL ?? ''
const route = useRoute()
const summary = ref<Summary | null>(null)
const loading = ref(true)
let interval: ReturnType<typeof setInterval>

const justVotedHonorary = computed(() => route.query.honorario === '1')

async function fetchResults() {
  try {
    const { data } = await axios.get<Summary>(`${API_URL}/api/votes/results`)
    summary.value = data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchResults()
  interval = setInterval(fetchResults, 10_000)
})
onUnmounted(() => clearInterval(interval))
</script>
