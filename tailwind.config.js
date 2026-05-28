/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        colombia: {
          blue:       'var(--c-blue)',
          'blue-dark':'var(--c-blue-dark)',
          yellow:     'var(--c-yellow)',
          'yellow-bg':'var(--c-yellow-bg)',
          red:        'var(--c-red)',
        },
        surface:  'var(--c-surface)',
        card:     'var(--c-card)',
        border:   'var(--c-border)',
        muted:    'var(--c-text-muted)',
        footer:   'var(--c-footer)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
}
