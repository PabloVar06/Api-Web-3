/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Archivo"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Instrument Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Cobre / terracota para llamadas a la acción
        cobre: { 400: "#d98a5f", 500: "#c4693d", 600: "#a8532c", 700: "#8a4122", 800: "#6b3219" },
      },
      boxShadow: {
        luz: "0 0 40px -8px rgba(52, 211, 153, 0.45)",
        cobre: "0 10px 30px -10px rgba(196, 105, 61, 0.55)",
      },
    },
  },
  plugins: [],
};
