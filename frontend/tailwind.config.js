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
        primary: {
          DEFAULT: '#00d4ff',
          50: '#e0faff',
          100: '#b3f4ff',
          200: '#80edff',
          300: '#4de7ff',
          400: '#26e2ff',
          500: '#00d4ff',
          600: '#00aad4',
          700: '#0080a8',
          800: '#00567d',
          900: '#002c51',
        },
        secondary: {
          DEFAULT: '#7c3aed',
          50: '#f5f0ff',
          100: '#e8d9ff',
          200: '#cfb3ff',
          300: '#b58cff',
          400: '#9a66ff',
          500: '#7c3aed',
          600: '#6429c4',
          700: '#4d1a9b',
          800: '#360c72',
          900: '#1f0049',
        },
        dark: {
          DEFAULT: '#0a0a0f',
          50: '#1a1a2e',
          100: '#16213e',
          200: '#0f3460',
          card: '#111118',
          glass: 'rgba(255,255,255,0.04)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.1) 0%, transparent 60%)',
        'neon-gradient': 'linear-gradient(135deg, #00d4ff, #7c3aed)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.2)',
        'neon-purple': '0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.2)',
        'neon-both': '0 0 30px rgba(0,212,255,0.3), 0 0 60px rgba(124,58,237,0.2)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 16px 48px rgba(0,212,255,0.15), 0 8px 32px rgba(0,0,0,0.5)',
        'glow-profile': '0 0 0 3px rgba(0,212,255,0.3), 0 0 0 6px rgba(124,58,237,0.2), 0 0 40px rgba(0,212,255,0.3)',
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
          '0%': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0,212,255,0.6), 0 0 80px rgba(124,58,237,0.3)' },
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
