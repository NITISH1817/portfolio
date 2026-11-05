import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import wasm from 'vite-plugin-wasm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    react(),
    tailwindcss(),
  ],
  server: {
    watch: {
      ignored: ['**/temp-folio-2025/**']
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('rapier') || id.includes('@dimforge')) {
              return 'vendor-physics';
            }
            if (id.includes('three') || id.includes('postprocessing') || id.includes('camera-controls')) {
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
