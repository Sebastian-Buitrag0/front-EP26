<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-colombia-blue text-white">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <RouterLink
          to="/"
          class="font-bold text-base sm:text-lg tracking-tight leading-tight hover:opacity-90 transition-opacity"
          aria-label="Inicio — Encuesta Presidencial 2026"
        >
          <span aria-hidden="true">🇨🇴</span> Encuesta Presidencial 2026
        </RouterLink>
        <RouterLink
          to="/resultados"
          class="text-sm font-medium opacity-75 hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          Ver resultados
        </RouterLink>
      </div>
      <div
        class="bg-colombia-yellow text-colombia-blue text-xs text-center py-1.5 px-4 font-semibold tracking-wide"
        role="status"
        aria-label="Aviso legal"
      >
        Encuesta informal de opinión ciudadana · No es una votación oficial ni un sondeo registrado ante el CNE
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="bg-footer text-white/50 text-xs text-center py-5 px-4 space-y-1">
      <p>
        <RouterLink to="/privacidad" class="hover:text-white transition-colors underline underline-offset-2">
          Política de privacidad
        </RouterLink>
        <span class="mx-2 opacity-30">·</span>
        Ley 1581 de 2012
        <span class="mx-2 opacity-30">·</span>
        Colombia 2026
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
