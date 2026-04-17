// ─────────────────────────────────────────────
// 前端入口檔案
// React 從這裡把整個 App 渲染到 index.html 的 <div id="root"> 裡
// ─────────────────────────────────────────────

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'        // 提供路由功能
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'  // 提供 API 快取
import './index.css'
import App from './App.jsx'

// QueryClient 是 React Query 的核心，負責管理所有 API 請求的快取
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter：讓整個 App 可以使用 useNavigate、Link 等路由功能 */}
    <BrowserRouter>
      {/* QueryClientProvider：讓整個 App 可以使用 useQuery、useMutation */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
