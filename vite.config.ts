import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules[\\/](gsap|@gsap|lenis|motion|framer-motion)/.test(id)) return 'motion';
        },
      },
    },
  },
});
