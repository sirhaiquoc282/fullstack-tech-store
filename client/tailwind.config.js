/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
     extend: {
      maxWidth : {
        1480 : "1480px"
      },
      
      fontFamily : {
        jakarta : ["Plus Jakarta Sans", "sans-serif"]
      }
     },
   },
   plugins: [
     require('@tailwindcss/line-clamp'),
   ],
}