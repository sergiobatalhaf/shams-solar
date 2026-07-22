/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        shams: {
          black:   '#060D06',
          dark:    '#0D1A0D',
          surface: '#132613',
          card:    '#1A3320',
          green:   '#2E7D32',
          mid:     '#388E3C',
          light:   '#4CAF50',
          neon:    '#76FF03',
          teal:    '#00ACC1',
          cyan:    '#26C6DA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'shams-gradient': 'linear-gradient(135deg, #00ACC1 0%, #43A047 100%)',
        'shams-dark':     'linear-gradient(180deg, #0D1A0D 0%, #060D06 100%)',
        'hero-pattern':   "radial-gradient(ellipse at 20% 50%, rgba(0,172,193,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(76,175,80,0.10) 0%, transparent 50%)",
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
