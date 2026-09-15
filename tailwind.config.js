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
    'text-white',
    'text-black',
    'bg-neo-yellow',
    'bg-neo-blue',
    'bg-neo-green',
    'bg-neo-pink',
    'bg-neo-purple',
    'bg-neo-orange',
    'bg-neo-red',
    'hover:bg-neo-yellow',
    'hover:bg-neo-blue',
    'hover:bg-neo-green',
    'hover:bg-neo-pink',
    'hover:bg-neo-purple',
    'text-neo-green',
    'text-neo-blue',
    'text-neo-pink',
    'text-neo-yellow',
    'text-neo-purple',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
        sans: ['"Archivo Black"', 'Verdana', 'sans-serif'],
        body: ['"Space Mono"', 'Courier New', 'monospace'],
      },
      colors: {
        canvas: '#FAF8F5',
        ink: '#050505',
        muted: '#5A5A5A',
        surface: '#FFFFFF',
        neo: {
          yellow: '#FFDE59',
          orange: '#FF914D',
          green: '#7ED957',
          blue: '#5CE1E6',
          pink: '#FF66C4',
          purple: '#8C52FF',
          red: '#E10600',
          black: '#050505',
          white: '#FAF8F5',
          dark: {
            bg: '#050505',
            surface: '#0E0E12',
            border: '#FFFFFF',
            text: '#FFFFFF',
            'text-muted': '#A3A3A3',
          }
        },
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px rgba(5,5,5,1)',
        'neo': '4px 4px 0px 0px rgba(5,5,5,1)',
        'neo-lg': '6px 6px 0px 0px rgba(5,5,5,1)',
        'neo-xl': '8px 8px 0px 0px rgba(5,5,5,1)',
        'neo-press': '0px 0px 0px 0px rgba(5,5,5,1)',
        'neo-white': '4px 4px 0px 0px rgba(255,255,255,1)',
        'neo-sm-white': '2px 2px 0px 0px rgba(255,255,255,1)',
        'neo-dark': '4px 4px 0px 0px #FFFFFF',
        'neo-sm-dark': '2px 2px 0px 0px #FFFFFF',
        'neo-lg-dark': '8px 8px 0px 0px #FFFFFF',
      },
      animation: {
        'marquee': 'marquee 22s linear infinite',
        'marquee-reverse': 'marqueeReverse 22s linear infinite',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'slideUp': 'slideUp 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.04' },
          '50%': { opacity: '0.09' },
        }
      },
      maxWidth: {
        'reading': '68ch',
      }
    },
  },
  plugins: [],
}
