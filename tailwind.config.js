/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A0A0F',
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d1d1db',
          300: '#a8a8bc',
          400: '#7a7a96',
          500: '#5c5c78',
          600: '#47475e',
          700: '#363649',
          800: '#252534',
          900: '#14141f',
          950: '#0A0A0F',
        },
        lime: {
          DEFAULT: '#C8F135',
          50: '#f7fde8',
          100: '#edfac5',
          200: '#d9f48e',
          300: '#C8F135',
          400: '#aede18',
          500: '#8cbf10',
          600: '#6d9810',
          700: '#537512',
          800: '#435e14',
          900: '#395016',
        },
        amber: {
          audit: '#F5A623',
        },
        red: {
          audit: '#FF4D4D',
        },
        green: {
          audit: '#22C55E',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        shimmer: 'shimmer 2s infinite linear',
        'count-up': 'count-up 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};