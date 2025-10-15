import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // <-- ESSA LINHA É A CRÍTICA
  ],
  theme: {
    extend: {
      colors: {
        'm2-green': '#97f901',
        'm2-dark': '#111111',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      keyframes: {
        'fly-search': {
          '0%': { 
            transform: 'translateX(0vw) translateY(0vh) rotate(5deg)',
            opacity: '0.8',
          },
          '25%': {
            transform: 'translateX(10vw) translateY(-5vh) rotate(-5deg)',
          },
          '50%': {
            transform: 'translateX(0vw) translateY(0vh) rotate(5deg)',
          },
          '75%': {
            transform: 'translateX(-10vw) translateY(5vh) rotate(-5deg)',
          },
          '100%': { 
            transform: 'translateX(0vw) translateY(0vh) rotate(5deg)',
            opacity: '0.8',
          },
        },
        'pulse': { // Reintroduzindo a animação de pulso para a luz
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.7' },
        }
      },
      animation: {
        'fly-search': 'fly-search 15s ease-in-out infinite', // Animação mais rápida e suave
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
      
    },
  },
  plugins: [],
}
export default config