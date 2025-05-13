import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  assetsInclude: ['**/*.PNG'],
  //server: {
  //  host: '192.168.100.12',
  //  port: 5173,
  //}
})
