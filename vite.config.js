/** @type {import('tailwindcss').Config} */
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
export default ({
  server: {
    host: true, // or '0.0.0.0'
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:"#20599E",
        secondary:"#8F9195",
        darck:"#F4F4F4",
        ddd:"#F09C0A",
        sss:"#E8EAED",
        gradientStart:"#184785",
        gradientEnd:"#F8F9FA",

        boxShadow:{
          'custom-shadow':'10px 0px 20px rgba(0,0,0,0.3)   '
        }
        

      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    tailwindcss(),
    react(),
   
  ],
})