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
  },
   preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: ["snitch-5-rh0t.onrender.com"],
  },
})
