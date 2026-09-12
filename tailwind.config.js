/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#08090a',
          900: '#0b0c0e',
          850: '#111215',
          800: '#17191e',
          700: '#22252c',
          600: '#343842',
        },
        space: {
          950: '#08090a',
          900: '#0b0c0e',
          850: '#111215',
          800: '#17191e',
        },
        ocean: {
          900: '#0b0c0e',
          800: '#111215',
          700: '#1c1f26',
          600: '#282c37',
        },
        sky: {
          500: '#8c929d',
          400: '#a1a7b3',
        },
        cyan: {
          400: '#a3a8b4',
          300: '#d1d5db',
          500: '#73767c',
        },
        signal: {
          yellow: '#d4d4d8',
          green: '#9ca3af',
        },
        ink: {
          950: '#050607',
          900: '#090a0c',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'Georgia', 'serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'super-wide': '0.3em',
        'mega-wide': '0.45em',
        'ultra-wide': '0.6em',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
}
