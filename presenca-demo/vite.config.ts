import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/controle-de-presen-a-em-palestras-eventos-da-Carteirinha-Digital-da-FATEC-Itaquera/',
  server: {
    port: 5173,
    open: true
  }
})
