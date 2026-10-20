import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server:{
    proxy:{
      "/api":{
        target:"https://snitch-3p82.onrender.com",
        changeOrigin:true,
        secure:false
      }
    }
  }
})
