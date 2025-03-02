/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handjet: ["Handjet", "sans-serif"],
        Caveat: ["Caveat", "cursive"],
        PlayfairDisplay: ["Playfair Display", "serif"],
        SUSE: ["SUSE", "sans-serif"],
        Sevillana: ["Sevillana", "cursive"],
        Lora: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
