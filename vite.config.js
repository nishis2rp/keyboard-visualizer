import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // plugins: [react()],
  base: '/keyboard-visualizer/',
  test: {
    globals: true, // describe, it, expectなどをグローバルにする
    environment: 'jsdom', // テスト環境をブラウザDOMにする
    setupFiles: './src/tests/setup.js', // テストのセットアップファイル
    css: false, // CSSのインポートを無視
    coverage: {
      provider: 'v8', // v8またはistanbul
      reporter: ['text', 'html'], // レポート形式
    },
  },
})
