// ─────────────────────────────────────────────
// 404 找不到頁面
// ─────────────────────────────────────────────

import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* 大數字 404 */}
      <p className="text-8xl font-bold text-rose-500 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">找不到此頁面</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        您輸入的網址不存在，可能是網址輸入錯誤，或是頁面已被移除。
      </p>
      <Link
        to="/"
        className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-3 rounded-xl transition"
      >
        回到首頁
      </Link>
    </div>
  )
}

export default NotFoundPage
