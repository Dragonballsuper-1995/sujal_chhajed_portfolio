
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function spaFallbackPlugin(): Plugin {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const distIndex = path.resolve(__dirname, 'dist/index.html');
      const dist200 = path.resolve(__dirname, 'dist/200.html');
      if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, dist200);
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), spaFallbackPlugin()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-framer-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
              if (id.includes('gsap')) {
                return 'vendor-gsap';
              }
              return 'vendor'; // all other dependencies
            }
          }
        }
      }
    }
  };
});
