import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // This proxies any request starting with /api to your backend server
      '/api': {
        target: 'http://localhost:8000', // Your local backend server address
        changeOrigin: true,
      },
    },
  },
});