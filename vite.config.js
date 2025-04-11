import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: "#20599E",
      },
    },
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
})