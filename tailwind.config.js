/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        blue:"#595AFF",
        gray:"#606984",
        lightGreen:"#80C79A"
      }
    },
  },
  plugins: [require("daisyui")],
}