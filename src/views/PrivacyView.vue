<template>
  <div class="max-w-2xl mx-auto px-4 py-10 prose prose-sm">
    <h1>Política de Privacidad</h1>
    <p><strong>Última actualización:</strong> Mayo 2026</p>

    <h2>1. Responsable del tratamiento</h2>
    <p>
      Esta encuesta es operada de forma independiente por un ciudadano colombiano con fines de opinión pública informal.
      Para ejercer sus derechos puede escribir a
      <a href="mailto:sonysebastian2002@gmail.com">sonysebastian2002@gmail.com</a>.
    </p>

    <h2>2. Datos recopilados y propósito</h2>
    <p>Al votar se recopila:</p>
    <ul>
      <li><strong>Identificador de cuenta Google</strong> (hash irreversible) — para garantizar un voto por persona.</li>
      <li><strong>Identificador de dispositivo</strong> (UUID anónimo en su navegador) — para prevenir votos duplicados desde el mismo dispositivo.</li>
      <li><strong>Dirección IP</strong> — para prevenir abusos automatizados. No se asocia a datos personales adicionales.</li>
      <li><strong>Candidato seleccionado y fecha del voto</strong> — resultado de la encuesta.</li>
    </ul>
    <p>
      No se almacena su nombre, correo electrónico ni ningún otro dato personal de su cuenta de Google.
      Los datos de voto son de <strong>opinión política</strong>, clasificados como datos sensibles según la Ley 1581 de 2012,
      por lo que se requiere su consentimiento explícito.
    </p>

    <h2>3. Base legal</h2>
    <p>
      El tratamiento se realiza con base en su <strong>consentimiento libre, previo, expreso e informado</strong>
      (Art. 9, Ley 1581 de 2012 y Decreto 1377 de 2013).
    </p>

    <h2>4. Tiempo de retención</h2>
    <p>
      Los datos se conservarán mientras la encuesta esté activa (hasta diciembre de 2026) y por 6 meses adicionales
      para efectos de auditoría. Tras ese período se eliminarán de forma permanente.
    </p>

    <h2>5. Derechos del titular (Habeas Data)</h2>
    <p>Usted tiene derecho a conocer, actualizar, rectificar y suprimir sus datos. Para ejercerlos escriba a
      <a href="mailto:sonysebastian2002@gmail.com">sonysebastian2002@gmail.com</a>. Su solicitud será atendida en
      un plazo máximo de 15 días hábiles.
    </p>

    <h2>6. Seguridad</h2>
    <p>
      Los identificadores se almacenan como hashes SHA-256 irreversibles. Ningún dato en texto plano
      que permita identificarle es guardado en la base de datos.
    </p>

    <h2>7. Declaración de informalidad</h2>
    <p>
      Esta plataforma es una encuesta informal de opinión ciudadana. <strong>No constituye una votación oficial,
      no está registrada ante el Consejo Nacional Electoral (CNE) y sus resultados no tienen valor electoral.</strong>
    </p>

    <RouterLink to="/" class="text-colombia-blue underline text-sm">← Volver al inicio</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
