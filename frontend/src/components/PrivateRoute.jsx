// ─────────────────────────────────────────────
// 私有路由守衛 (Private Route Guard)
// ─────────────────────────────────────────────
// 作用：保護需要登入才能進入的頁面
// 邏輯：
//   - 有登入（有 token）→ 顯示頁面
//   - 沒登入 → 自動導向 /login

import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

function PrivateRoute() {
  const { token } = useAuthStore()

  // Outlet 是 React Router 的「插槽」
  // 代表「把子路由的元件渲染在這裡」
  // Navigate 則是程式化跳轉，replace 避免返回按鈕回到被保護的頁面
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
