import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    },
    proxy: {
      '/api': {
        target: 'https://fleet-ledger.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'https://fleet-ledger.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
})