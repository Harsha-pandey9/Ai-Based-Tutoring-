import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    // Only use proxy in development
    ...(mode === 'development' && {
      proxy: {
        '/api': 'http://localhost:5000',
        '/socket.io': {
          target: 'http://localhost:5000',
          ws: true,
        },
      },
    }),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          clerk: ['@clerk/clerk-react'],
          icons: ['react-icons'],
          charts: ['chart.js', 'react-chartjs-2'],
          editor: ['@monaco-editor/react'],
          socket: ['socket.io-client'],
        },
      },
    },
  },
  define: {
    global: 'globalThis',
  },
}));