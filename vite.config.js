import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('rapier')) {
              return 'vendor-physics';
            }
            if (id.includes('three') || id.includes('postprocessing')) {
              return 'vendor-three';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('zustand') || id.includes('react-router-dom')) {
              return 'vendor-core';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 3500
  }
})
