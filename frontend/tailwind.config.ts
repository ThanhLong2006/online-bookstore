import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 30px 60px -30px rgba(99, 102, 241, 0.65)',
      },
    },
  },
  plugins: [],
} satisfies Config

