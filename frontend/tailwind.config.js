/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: '#F8FAFC',
        accent: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          cyan: '#06B6D4',
        },
        'text-primary': '#0F172A',
        'text-secondary': '#334155',
        'text-muted': '#64748B',
        'border-base': '#E2E8F0',
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#BFDBFE',
          200: '#2563EB',
          400: '#06B6D4',
          600: '#2563EB',
          800: '#1D4ED8',
          900: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#64748B',
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#E2E8F0',
          400: '#64748B',
          600: '#64748B',
          800: '#334155',
          900: '#0F172A',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to bottom, #FFFFFF 0%, #F8FAFC 50%, #FFFFFF 100%)',
        'neon-gradient': 'linear-gradient(135deg, #2563EB, #06B6D4)',
        'card-gradient': 'linear-gradient(145deg, rgba(37, 99, 235,0.05) 0%, transparent 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(37, 99, 235,0.25)',
        'neon-purple': '0 0 20px rgba(6, 182, 212,0.15)',
        'neon-both': '0 0 30px rgba(37, 99, 235,0.25), 0 0 60px rgba(6, 182, 212,0.15)',
        'card': '0 4px 20px rgba(15,23,42,0.06)',
        'card-hover': '0 8px 30px rgba(15,23,42,0.10)',
        'glow-profile': '0 0 0 3px rgba(37, 99, 235,0.2), 0 0 0 6px rgba(6, 182, 212,0.15), 0 0 40px rgba(37, 99, 235,0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(37,99,235,0.16)' },
          '100%': { boxShadow: '0 0 32px rgba(6,182,212,0.22)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
