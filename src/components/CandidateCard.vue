<template>
  <article
    class="bg-card rounded-2xl overflow-hidden flex flex-col group transition-shadow duration-200 hover:shadow-lg"
    style="border: 1px solid var(--c-border)"
  >
    <div class="aspect-[4/5] overflow-hidden" style="background: var(--c-surface)">
      <img
        :src="candidate.photoUrl || '/placeholder.svg'"
        :alt="candidate.name"
        loading="lazy"
        class="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        @error="(e) => { const img = e.target as HTMLImageElement; if (!img.src.endsWith('/placeholder.svg')) img.src = '/placeholder.svg' }"
      />
    </div>

    <div class="p-3 sm:p-4 flex flex-col flex-1 gap-1">
      <h2 class="text-sm font-bold leading-snug" style="color: var(--c-text)">
        {{ displayName }}
      </h2>
      <p class="text-xs font-semibold" style="color: var(--c-blue)">
        {{ candidate.party }}
      </p>
      <p v-if="candidate.vicePresident" class="text-xs leading-snug" style="color: var(--c-text-muted)">
        <span class="font-medium">Fórmula:</span> {{ candidate.vicePresident }}
      </p>

      <button
        @click="$emit('vote', candidate)"
        class="mt-auto min-h-[44px] w-full rounded-xl font-semibold text-sm text-white
               flex items-center justify-center
               transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-offset-2 focus-visible:ring-colombia-blue"
        style="background: var(--c-blue)"
        @mouseover="(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--c-blue-dark)')"
        @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--c-blue)')"
        :aria-label="`Votar por ${candidate.name}`"
      >
        Votar por {{ firstName }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Candidate } from '@/stores/vote'

const props = defineProps<{ candidate: Candidate }>()
defineEmits<{ vote: [candidate: Candidate] }>()

const firstName = computed(() => props.candidate.name.split(' ')[0])

// Nombre + primer apellido (incluyendo preposiciones como "de la")
const displayName = computed(() => {
  const parts = props.candidate.name.split(' ')
  if (parts.length <= 2) return props.candidate.name
  if (parts.length === 3) return `${parts[0]} ${parts[1]}`
  // El primer apellido empieza en el índice 2 (después del segundo nombre).
  // Recoge preposiciones en minúscula + la primera palabra capitalizada.
  const apellido: string[] = []
  for (let i = 2; i < parts.length; i++) {
    apellido.push(parts[i])
    if (parts[i][0] !== parts[i][0].toLowerCase()) break
  }
  return `${parts[0]} ${apellido.join(' ')}`
})
</script>
