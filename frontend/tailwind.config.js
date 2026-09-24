/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        // Cuerpo de texto de toda la app (ya queda como default más abajo, en index.css)
        sans: ["Inter", "sans-serif"],
        // Solo para títulos: usar la clase "font-poppins" en el elemento que lo necesite
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
      //paleta primaria
      fondoGlobal: "#E4E1DA",       
      primarioBase: "#537A63",      
      primarioOscuro: "#1E2D24",     
      primarioClaro: "#87c6a1",     
      extra: "#929487",
      //paleta secundaria
      superficie: "#DCE3DB",
      acentoBase: "#5E3E3E",
      acentoOscuro: "#2B1C1C",
      textoSecundario: "#645244",
      //Tipografías y alertas
      error: "#832D28",
      texto: "#FFFFFF",
      textoNegro: "#090404"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}

