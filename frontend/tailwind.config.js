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
          DEFAULT: '#185FA5',
          50: '#E6F1FB',
          100: '#B5D4F4',
          200: '#85B7EB',
          400: '#378ADD',
          600: '#185FA5',
          800: '#0C447C',
          900: '#042C53',
        },
        secondary: {
          DEFAULT: '#626058',
          50: '#E8E6DE',
          100: '#DDDBD3',
          200: '#C2C0B8',
          400: '#626058',
          600: '#626058',
          800: '#3A3936',
          900: '#1C1B19',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to bottom, #E8E6DE 0%, #DDDBD3 50%, #E8E6DE 100%)',
        'neon-gradient': 'linear-gradient(135deg, #185FA5, #C2C0B8)',
        'card-gradient': 'linear-gradient(145deg, rgba(24,95,165,0.05) 0%, transparent 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(24,95,165,0.25)',
        'neon-purple': '0 0 20px rgba(194,192,184,0.15)',
        'neon-both': '0 0 30px rgba(24,95,165,0.25), 0 0 60px rgba(194,192,184,0.15)',
        'card': '0 8px 32px rgba(0,0,0,0.08)',
        'card-hover': '0 16px 48px rgba(24,95,165,0.15), 0 8px 32px rgba(0,0,0,0.1)',
        'glow-profile': '0 0 0 3px rgba(24,95,165,0.2), 0 0 0 6px rgba(194,192,184,0.15), 0 0 40px rgba(24,95,165,0.2)',
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
          '0%': { boxShadow: '0 0 20px rgba(186,117,23,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(186,117,23,0.6), 0 0 80px rgba(98,96,88,0.3)' },
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
