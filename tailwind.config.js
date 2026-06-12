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
        brand: {
          50:  '#edfaf3',
          100: '#d3f4e3',
          200: '#aae8c9',
          300: '#74d6a8',
          400: '#3dbc83',
          500: '#1a9e66',
          600: '#107d50',
          700: '#0d6342',
          800: '#0c5037',
          900: '#0b422e',
        },
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.25s ease',
        'bounce-soft': 'bounceSoft 0.4s ease',
        'pulse-green': 'pulseGreen 1.5s ease infinite',
        'rider-bob': 'riderBob 1s ease-in-out infinite',
      },
      keyframes: {
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        bounceSoft: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.08)' } },
        pulseGreen: { '0%,100%': { boxShadow: '0 0 0 0 rgba(26,158,102,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(26,158,102,0)' } },
        riderBob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-3px)' } },
      },
    },
  },
  plugins: [],
}
