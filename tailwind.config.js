
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.{js,ts,jsx,tsx}",
    "./index.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Classes come from data (e.g. CHARACTER_TRAITS in constants.ts), so we safelist them.
    { pattern: /^bg-neo-(red|orange|yellow|blue)$/ },
    { pattern: /^text-(8|9)xl$/, variants: ['md'] },
    'text-white',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
        sans: ['"Archivo Black"', 'Verdana', 'sans-serif'],
      },
      colors: {
        neo: {
          yellow: '#FFDE59',
          orange: '#FF914D',
          green: '#7ED957',
          blue: '#5CE1E6',
          pink: '#FF66C4',
          purple: '#8C52FF',
          red: '#E10600',
          black: '#050505',
          white: '#FAFAFA',
          dark: {
            bg: '#000000',
            surface: '#000000',
            border: '#FFFFFF',
            text: '#FFFFFF',
            'text-muted': '#A3A3A3',
          }
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
        'neo-dark': '4px 4px 0px 0px #FFFFFF',
        'neo-sm-dark': '2px 2px 0px 0px #FFFFFF',
        'neo-lg-dark': '8px 8px 0px 0px #FFFFFF',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marqueeReverse 25s linear infinite',
        'blob': 'blob 7s infinite',
        'glitch': 'glitch 1s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wave': 'wave 1s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
