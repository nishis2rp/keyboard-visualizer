import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Docker環境ではルートパス、GitHub Pagesでは/keyboard-visualizer/
  base: process.env.VITE_BASE_PATH || '/keyboard-visualizer/',
  server: {
    host: true, // Docker内でアクセス可能にする (0.0.0.0)
    port: 5173,
    watch: {
      usePolling: true, // Dockerボリュームマウント時のファイル監視
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
  },
})
