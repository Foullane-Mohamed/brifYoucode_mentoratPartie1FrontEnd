/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0078E7',
          dark: '#0056b3',
        },
        secondary: {
          light: '#f8f9fa',
          DEFAULT: '#6c757d',
          dark: '#343a40',
        },
      },
    },
  },
  plugins: [],
}