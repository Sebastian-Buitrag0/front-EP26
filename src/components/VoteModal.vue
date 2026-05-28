<template>
  <Teleport to="body">
    <div
      ref="backdropRef"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style="background: rgba(0,0,0,0.55); backdrop-filter: blur(2px)"
      @click.self="!voteDone && closeModal()"
      role="dialog"
      aria-modal="true"
      :aria-label="`Votar por ${candidate.name}`"
    >
      <div
        ref="panelRef"
        class="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 sm:p-7 shadow-2xl"
        style="border-top: 1px solid var(--c-border)"
      >
        <!-- Indicador de paso (3 segmentos) -->
        <div class="flex items-center gap-2 mb-6" aria-hidden="true">
          <span class="h-1 flex-1 rounded-full" :style="{ background: 'var(--c-blue)' }" />
          <span class="h-1 flex-1 rounded-full transition-colors duration-300"
            :style="{ background: idToken || voteDone ? 'var(--c-blue)' : 'var(--c-border)' }" />
          <span class="h-1 flex-1 rounded-full transition-colors duration-500"
            :style="{ background: voteDone ? 'var(--c-blue)' : 'var(--c-border)' }" />
        </div>

        <!-- Verificando con backend -->
        <template v-if="checking">
          <div class="flex flex-col items-center py-8 gap-4">
            <div class="rounded-full h-8 w-8 border-[3px] border-colombia-blue border-t-transparent animate-spin" />
            <p class="text-sm" style="color: var(--c-text-muted)">Verificando tu cuenta...</p>
          </div>
        </template>

        <!-- Paso 3: ¡Votaste! Compartir -->
        <template v-else-if="voteDone">
          <div ref="step3Ref">
            <div class="text-center mb-6">
              <p class="text-4xl mb-3" aria-hidden="true">🎉</p>
              <h3 class="text-xl font-extrabold mb-1" style="color: var(--c-text)">
                {{ isHonoraryResult ? '¡Voto honorario registrado!' : '¡Voto registrado!' }}
              </h3>
              <p class="text-sm" style="color: var(--c-text-muted)">
                {{ isHonoraryResult
                  ? 'Tu opinión también importa. Cuéntale a tus amigos y familiares.'
                  : 'Invita a más personas a participar.' }}
              </p>
            </div>

            <!-- Botones de redes sociales -->
            <div class="grid grid-cols-4 gap-2 mb-3">
              <a
                v-for="net in shareNetworks"
                :key="net.name"
                :href="net.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="net.name"
                class="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
                :style="{ background: net.bg, color: net.color }"
              >
                <span v-html="net.icon" aria-hidden="true" />
                {{ net.name }}
              </a>
            </div>

            <!-- Copiar link -->
            <button
              @click="copyLink"
              class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium mb-5 transition-colors"
              style="background: var(--c-surface); color: var(--c-text); border: 1px solid var(--c-border)"
            >
              <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {{ copied ? '¡Link copiado!' : 'Copiar link' }}
            </button>

            <button
              @click="goToResults"
              class="w-full min-h-[48px] font-bold text-sm rounded-xl text-white transition-opacity hover:opacity-90"
              style="background: var(--c-blue)"
            >
              Ver resultados →
            </button>
          </div>
        </template>

        <!-- Paso 1: Google Login -->
        <template v-else-if="!idToken">
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
import axios from 'axios'
import { submitVote } from '@/composables/useVote'
import { useVoteStore } from '@/stores/vote'
import type { Candidate } from '@/stores/vote'

const SITE = 'https://encuesta-presidencial-2026.online'
const TEXT = '🗳️ Voté en la encuesta presidencial informal de Colombia 2026. ¿Y tú? Mira los resultados en tiempo real'
const encodedText = encodeURIComponent(TEXT)
const encodedUrl = encodeURIComponent(SITE)

const API_URL = import.meta.env.VITE_API_URL ?? ''

const props = defineProps<{ candidate: Candidate }>()
const emit = defineEmits<{ close: []; voted: [] }>()
const router = useRouter()
const voteStore = useVoteStore()

const backdropRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const step2Ref = ref<HTMLElement | null>(null)
const step3Ref = ref<HTMLElement | null>(null)

const idToken = ref<string | null>(null)
const birthDate = ref('')
const consented = ref(false)
const loading = ref(false)
const checking = ref(false)
const error = ref('')
const voteDone = ref(false)
const isHonoraryResult = ref(false)
const copied = ref(false)

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

const shareNetworks = [
  {
    name: 'WhatsApp',
    bg: '#25D366', color: '#fff',
    url: `https://wa.me/?text=${encodedText}+${encodedUrl}`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`,
  },
  {
    name: 'X',
    bg: '#000', color: '#fff',
    url: `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=EleccionesColombia2026`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
  {
    name: 'Facebook',
    bg: '#1877F2', color: '#fff',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  },
  {
    name: 'Telegram',
    bg: '#229ED9', color: '#fff',
    url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  },
]

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

watch(voteDone, async (val) => {
  if (!val || reduced) return
  await nextTick()
  if (step3Ref.value) {
    gsap.from(step3Ref.value, { y: 18, opacity: 0, duration: 0.38, ease: 'power2.out' })
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

async function onGoogleSuccess(response: { credential: string }) {
  if (voteStore.hasVoted) {
    router.push('/resultados')
    return
  }

  checking.value = true
  try {
    const { data } = await axios.post(`${API_URL}/api/votes/check`, { idToken: response.credential })
    if (data.hasVoted) {
      voteStore.markVoted()
      router.push('/resultados')
      return
    }
  } catch {
    // Si falla el check, dejamos pasar al paso 2 igual
  } finally {
    checking.value = false
  }

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
    isHonoraryResult.value = result.isHonorary
    voteDone.value = true
  } catch (e: any) {
    const status = e?.response?.status
    if (status === 409) {
      voteStore.markVoted()
      router.push('/resultados')
    } else {
      error.value = 'Ocurrió un error. Intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}

async function goToResults() {
  emit('close')
  router.push({ path: '/resultados', query: isHonoraryResult.value ? { honorario: '1' } : {} })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(SITE)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch {
    // fallback silencioso
  }
}
</script>
