import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },

  // ── 測試設定 ──────────────────────────────────
  // Vitest 的設定直接寫在 vite.config.js 裡，不需要額外的設定檔
  test: {
    // environment: 'jsdom'
    // 預設 Node.js 沒有 document、window 等瀏覽器 API
    // jsdom 模擬瀏覽器環境，讓測試可以操作 DOM（按鈕、input 等）
    environment: 'jsdom',

    // globals: true
    // 讓 describe / it / expect 這些函式可以直接用，不需要每個檔案都 import
    globals: true,

    // setupFiles：每個測試檔案執行前，會先執行這個設定檔
    // 用來引入 @testing-library/jest-dom，讓 expect 多出更多好用的方法
    // 例如：.toBeInTheDocument()、.toHaveTextContent() 等
    setupFiles: './src/test/setup.js',
  },
})
