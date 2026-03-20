import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/HigherSoulZone/',
  plugins: [vue()],
  server: { port: 3737 }
})
