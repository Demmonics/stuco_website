/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#0A1622',
          900: '#193546',
        },
        ocean: {
          700: '#065B98',
        },
        sky: {
          500: '#1B7FDC',
        },
        cyan: {
          400: '#0DB8D3',
        },
        signal: {
          yellow: '#EEE638',
          green: '#16F686',
        },
        ink: {
          950: '#151A1F',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.3em',
      },
      backdropBlur: {
        glass: '16px',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
