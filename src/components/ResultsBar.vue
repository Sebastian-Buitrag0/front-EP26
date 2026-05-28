<template>
  <div class="space-y-1">
    <div class="flex items-baseline justify-between gap-2 px-0.5">
      <span class="text-sm font-semibold truncate" :title="name" style="color: var(--c-text)">
        {{ shortName }}
      </span>
      <span class="text-xs font-medium tabular-nums shrink-0" style="color: var(--c-text-muted)">
        {{ votes.toLocaleString('es-CO') }} votos
      </span>
    </div>
    <div class="relative h-6 rounded-full overflow-hidden" style="background: var(--c-border)">
      <div
        class="h-full rounded-full flex items-center justify-end pr-2.5 transition-all duration-500"
        style="transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1)"
        :class="color === 'yellow' ? 'bg-colombia-yellow' : 'bg-colombia-blue'"
        :style="{ width: `${Math.max(pct, 2)}%` }"
      >
        <span
          v-if="pct >= 10"
          class="text-xs font-bold tabular-nums"
          :class="color === 'yellow' ? 'text-yellow-900' : 'text-white'"
        >
          {{ pct }}%
        </span>
      </div>
      <span
        v-if="pct < 10 && pct > 0"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold tabular-nums"
        style="color: var(--c-text-muted)"
      >
        {{ pct }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  votes: number
  pct: number
  color?: 'blue' | 'yellow'
}>()

const shortName = computed(() => {
  const parts = props.name.split(' ')
  if (parts.length <= 2) return props.name
  if (parts.length === 3) return `${parts[0]} ${parts[1]}`
  const apellido: string[] = []
  for (let i = 2; i < parts.length; i++) {
    apellido.push(parts[i])
    if (parts[i][0] !== parts[i][0].toLowerCase()) break
  }
  return `${parts[0]} ${apellido.join(' ')}`
})
</script>
