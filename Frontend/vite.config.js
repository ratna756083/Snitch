import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  
   preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: ["snitch-6.onrender.com"],
     proxy:{
      "/api":{
        target:"https://snitch-3p82.onrender.com",
        changeOrigin:true,
        secure:true
      }
    }
  },
})
