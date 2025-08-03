import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on mode (e.g. development, production, docker)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
        '/ws': {
          target: env.VITE_WS_BASE_URL,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  }
})

