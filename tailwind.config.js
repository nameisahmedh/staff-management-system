/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'dark-bg': '#111827',
        'dark-card': '#1F2937',
        'dark-border': '#374151',
      }
    },
  },
  plugins: [],
}

