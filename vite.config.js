import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El dashboard es solo frontend; importamos los JSON desde la carpeta data/
export default defineConfig({
  plugins: [react()],
})
