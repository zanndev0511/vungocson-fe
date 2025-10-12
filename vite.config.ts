import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [
    react(), tailwindcss()
  ],
  build: {
    target: 'es2015'
  },
  clearScreen: false, 
  logLevel: "info",
  server: {
    port: 3002,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/assets/styles'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@api': path.resolve(__dirname, './src/api'),
      '@services': path.resolve(__dirname, './src/services')
    }
  }
})
