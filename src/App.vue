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
        <span class="mx-2 opacity-30">·</span>
        <a href="https://github.com/Sebastian-Buitrag0" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
