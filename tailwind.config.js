/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A12',
        navy: '#14121F',
        'orbix-violet': '#7C3AED',
        'orbix-lime': '#B6FF3C',
        bone: '#F5F5FA',
        slate: '#948FA3',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
