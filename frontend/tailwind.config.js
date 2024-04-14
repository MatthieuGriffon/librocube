/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px', // Breakpoint pour tablettes
      'lg': '1024px',
      'xl': '1280px',
      // Ajouter ou ajuster les breakpoints selon les besoins
    },
    extend: {},
  },
  plugins: [],
}

