/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Los colores apuntan a variables CSS → cambian automáticamente con el tema
        bg: 'var(--color-bg)',
        navy: 'var(--color-navy)',
        bone: 'var(--color-bone)',
        slate: 'var(--color-slate)',
        // Colores de marca (constantes, no cambian con el tema)
        'orbix-violet': '#7C3AED',
        'orbix-lime': '#B6FF3C',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
