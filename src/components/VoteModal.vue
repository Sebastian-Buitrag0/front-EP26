<template>
  <Teleport to="body">
    <div
      ref="backdropRef"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style="background: rgba(0,0,0,0.55); backdrop-filter: blur(2px)"
      @click.self="closeModal"
      role="dialog"
      aria-modal="true"
      :aria-label="`Votar por ${candidate.name}`"
    >
      <div
        ref="panelRef"
        class="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 sm:p-7 shadow-2xl"
        style="border-top: 1px solid var(--c-border)"
      >
        <!-- Indicador de paso -->
        <div class="flex items-center gap-2 mb-6" aria-hidden="true">
          <span class="h-1 flex-1 rounded-full" :style="{ background: 'var(--c-blue)', opacity: 1 }" />
          <span class="h-1 flex-1 rounded-full transition-colors duration-300"
            :style="{ background: idToken ? 'var(--c-blue)' : 'var(--c-border)' }" />
        </div>

        <!-- Paso 1: Google Login -->
        <template v-if="!idToken">
          <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color: var(--c-text-muted)">Paso 1 de 2</p>
          <h3 class="text-xl font-extrabold mb-1" style="color: var(--c-text)">Verificar identidad</h3>
          <p class="text-sm mb-1" style="color: var(--c-text-muted)">
            Vas a votar por
            <strong style="color: var(--c-blue)">{{ candidate.name }}</strong>
          </p>
          <p class="text-sm mb-6" style="color: var(--c-text-muted)">
            Usamos Google solo para garantizar un voto por persona. No almacenamos tu nombre ni correo.
          </p>
          <GoogleLogin :callback="onGoogleSuccess" class="flex justify-center" />
          <button
            @click="closeModal"
            class="mt-4 w-full text-sm py-2 rounded-xl transition-colors duration-150"
            style="color: var(--c-text-muted)"
          >
            Cancelar
          </button>
        </template>

        <!-- Paso 2: Fecha + consentimiento -->
        <div v-else ref="step2Ref">
          <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color: var(--c-text-muted)">Paso 2 de 2</p>
          <h3 class="text-xl font-extrabold mb-1" style="color: var(--c-text)">Confirmar voto</h3>
          <p class="text-sm mb-5" style="color: var(--c-blue); font-weight: 600">
            {{ candidate.name }}
          </p>

          <!-- Fecha de nacimiento -->
          <div class="mb-3">
            <label class="block text-sm font-semibold mb-1.5" style="color: var(--c-text)">
              Fecha de nacimiento
            </label>
            <input
              v-model="birthDate"
              type="date"
              :max="maxDate"
              :min="minDate"
              class="w-full rounded-xl px-3 py-2.5 text-sm transition-colors duration-150
                     focus:outline-none focus:ring-2 focus:ring-colombia-blue"
              style="border: 1.5px solid var(--c-border); background: var(--c-surface); color: var(--c-text)"
              aria-label="Fecha de nacimiento"
            />
          </div>

          <!-- Indicador de edad -->
          <div
            v-if="ageLabel"
            class="rounded-xl px-4 py-2.5 mb-4 text-sm font-medium text-center"
            :style="isMinor
              ? 'background: var(--c-yellow-bg); color: oklch(35% 0.1 80)'
              : 'background: oklch(96% 0.02 150); color: oklch(30% 0.08 150)'"
            role="status"
          >
            {{ ageLabel }}
          </div>

          <!-- Consentimiento -->
          <label
            class="flex items-start gap-3 cursor-pointer rounded-xl p-3 mb-5 transition-colors"
            style="background: var(--c-surface)"
          >
            <input
              v-model="consented"
              type="checkbox"
              class="mt-0.5 h-4 w-4 rounded shrink-0"
              style="accent-color: var(--c-blue)"
            />
            <span class="text-xs leading-relaxed" style="color: var(--c-text-muted)">
              Acepto la
              <RouterLink to="/privacidad" target="_blank"
                class="underline underline-offset-2 font-medium"
                style="color: var(--c-blue)">
                política de privacidad
              </RouterLink>
              y el tratamiento de mis datos de opinión política conforme a la Ley 1581 de 2012.
            </span>
          </label>

          <p v-if="error" class="text-sm text-center mb-3" style="color: var(--c-red)" role="alert">
            {{ error }}
          </p>

          <button
            @click="confirm"
            :disabled="!birthDate || !consented || loading"
            class="w-full min-h-[48px] font-bold text-sm rounded-xl text-white transition-colors duration-150
                   disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-colombia-blue"
            style="background: var(--c-blue)"
            @mouseover="(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.background = 'var(--c-blue-dark)' }"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--c-blue)')"
          >
            <span v-if="loading" aria-live="polite">Registrando voto...</span>
            <span v-else-if="isMinor">Registrar voto honorario</span>
            <span v-else>Confirmar mi voto</span>
          </button>
          <button
            @click="closeModal"
            class="mt-3 w-full text-sm py-2 rounded-xl transition-colors"
            style="color: var(--c-text-muted)"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'
import { gsap } from 'gsap'
import { submitVote } from '@/composables/useVote'
import { useVoteStore } from '@/stores/vote'
import type { Candidate } from '@/stores/vote'

const props = defineProps<{ candidate: Candidate }>()
const emit = defineEmits<{ close: []; voted: [] }>()
const router = useRouter()
const voteStore = useVoteStore()

const backdropRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const step2Ref = ref<HTMLElement | null>(null)

const idToken = ref<string | null>(null)
const birthDate = ref('')
const consented = ref(false)
const loading = ref(false)
const error = ref('')

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const today = new Date()
const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate())
  .toISOString().split('T')[0]
const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
  .toISOString().split('T')[0]

const age = computed(() => {
  if (!birthDate.value) return null
  const birth = new Date(birthDate.value)
  let a = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--
  return a
})

const isMinor = computed(() => age.value !== null && age.value < 18)

const ageLabel = computed(() => {
  if (age.value === null) return ''
  if (isMinor.value) return `Voto honorario — ${age.value} años. Tu voz también cuenta.`
  return `Voto válido — ${age.value} años`
})

onMounted(() => {
  if (reduced) return
  gsap.from(backdropRef.value, { opacity: 0, duration: 0.25 })
  gsap.from(panelRef.value, { y: 52, opacity: 0, duration: 0.38, ease: 'power3.out', delay: 0.05 })
})

watch(idToken, async (val) => {
  if (!val || reduced) return
  await nextTick()
  if (step2Ref.value) {
    gsap.from(step2Ref.value, { y: 18, opacity: 0, duration: 0.32, ease: 'power2.out' })
  }
})

async function closeModal() {
  if (!reduced && panelRef.value && backdropRef.value) {
    await Promise.all([
      gsap.to(panelRef.value, { y: 36, opacity: 0, duration: 0.22, ease: 'power2.in' }),
      gsap.to(backdropRef.value, { opacity: 0, duration: 0.28, delay: 0.04 }),
    ])
  }
  emit('close')
}

function onGoogleSuccess(response: { credential: string }) {
  idToken.value = response.credential
}

async function confirm() {
  if (!idToken.value || !consented.value || !birthDate.value) return
  loading.value = true
  error.value = ''
  try {
    const result = await submitVote(idToken.value, props.candidate.id, birthDate.value)
    voteStore.markVoted()
    emit('voted')
    router.push({ path: '/resultados', query: result.isHonorary ? { honorario: '1' } : {} })
  } catch (e: any) {
    const status = e?.response?.status
    error.value = status === 409
      ? (e?.response?.data?.message ?? 'Ya registraste tu voto.')
      : 'Ocurrió un error. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>
