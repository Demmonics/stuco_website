import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis') || id.includes('node_modules/canvas-confetti')) {
            return 'animation-vendor';
          }
          if (id.includes('node_modules/@supabase') || id.includes('node_modules/lucide-react')) {
            return 'lib-vendor';
          }
        },
      },
    },
  },
});
