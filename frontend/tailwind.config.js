/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000', // Negro
        surface: '#111111', // Gris muy oscuro para contraste
        primary: '#E50914', // Rojo brillante (estilo Netflix)
        primaryHover: '#B81D24', // Rojo más oscuro
        accent: '#FFFFFF', // Blanco
        textBase: '#F5F5F1', // Blanco humo para legibilidad
        textHighlight: '#FFFFFF' // Blanco puro
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
