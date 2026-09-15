import crypto from 'node:crypto';

// Polyfill for Node.js < 21.7 (Node 18/20) where crypto.hash does not exist
if (typeof (crypto as any).hash !== 'function') {
  (crypto as any).hash = (algo: string, data: any, enc?: any) => {
    const h = crypto.createHash(algo).update(data);
    return enc ? h.digest(enc) : h.digest('hex');
  };
}

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
