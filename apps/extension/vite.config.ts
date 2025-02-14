import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import renameAndPackOutputPlugin from './output-pack-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    // a workaround for @metamask/post-message-stream - readable-stream
    nodePolyfills({
      include: ['process', 'util'],
    }),
    renameAndPackOutputPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // 'util': 'node_modules'
    },
  },
  build: {
    manifest: true,
    outDir: process.env.NODE_ENV === 'production' ? 'build' : 'dist',
    rollupOptions: {
      input: {
        tab: resolve(__dirname, 'src/tab.html'),
        sidePanel: resolve(__dirname, 'src/side-panel.html'),
      },
      treeshake: true,
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
