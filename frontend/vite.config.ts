import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const backend_uri = (env.APP_ENV === 'container')
    ? 'http://backend:4000/graphql'
    : 'http://localhost:4000/graphql'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/graphql': {
          target: backend_uri,
          changeOrigin: true,
        },
      },
      watch: { usePolling: true },
    },
  }
})
