import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() as any,
  ],
  css: {
    postcss: false, // Desactiva PostCSS en Vite por completo
  },
});