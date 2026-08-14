/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070f',
        navy: '#0A1128',
        'orbix-blue': '#2E6BFF',
        'orbix-cyan': '#5FD4D0',
        bone: '#F5F7FA',
        slate: '#8A94A6',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
