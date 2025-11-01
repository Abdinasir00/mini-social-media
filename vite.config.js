import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://connecthub-three.vercel.app',
        changeOrigin: true,
        secure: true,
        // You can remove rewrite if path doesn’t need changing
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
