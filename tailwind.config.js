/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C9A84C', // Sacred / divine gold
          dark: '#B8973B',
        },
        saffron: {
          DEFAULT: '#E07B39', // Jain spiritual orange
          dark: '#C06B29',
        },
        stone: {
          darkest: '#0A0A0A',
          overlay: 'rgba(26, 26, 26, 0.8)',
        },
        cream: '#F5EDD7',
      },
      fontFamily: {
        headline: ['"Cinzel Decorative"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
