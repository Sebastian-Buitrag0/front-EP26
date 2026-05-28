<template>
  <Teleport to="body">
    <div
      ref="el"
      class="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
    >
      <img
        :src="src"
        class="w-16 h-16 rounded-full object-cover object-top shadow-2xl"
        style="border: 3px solid white"
        @error="(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{ src: string }>()
const emit = defineEmits<{ done: [] }>()

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!el.value) return

  const vw = window.innerWidth
  const vh = window.innerHeight
  const fromLeft = Math.random() > 0.5

  const startX = fromLeft ? -72 : vw + 72
  const startY = vh * 0.25 + Math.random() * vh * 0.35

  const peakX = fromLeft
    ? vw * 0.25 + Math.random() * vw * 0.3
    : vw * 0.45 + Math.random() * vw * 0.3
  const peakY = vh * 0.05 + Math.random() * vh * 0.2

  const endX = fromLeft ? vw * 0.6 + Math.random() * vw * 0.5 : Math.random() * vw * 0.4
  const endY = vh + 100

  gsap.set(el.value, { x: startX, y: startY, opacity: 1 })

  gsap.to(el.value, {
    keyframes: [
      { x: peakX, y: peakY, duration: 0.75, ease: 'power2.out' },
      { x: endX,  y: endY,  duration: 0.85, ease: 'power2.in'  },
    ],
    onComplete: () => emit('done'),
  })
})
</script>
