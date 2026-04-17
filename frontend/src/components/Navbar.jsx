// ─────────────────────────────────────────────
// 導覽列元件 (Navbar)
// ─────────────────────────────────────────────
// 登入後右側顯示下拉選單（仿 Airbnb 的漢堡+頭像按鈕）
// 點擊按鈕外的區域會關閉選單（用 useEffect 監聽全域點擊）

import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)  // 下拉選單開關
  const menuRef = useRef(null)  // 指向選單 DOM 節點，用於偵測點擊範圍

  // 點擊選單外部時自動關閉
  // useEffect cleanup：元件卸載時移除事件監聽，避免記憶體洩漏
  useEffect(() => {
    const handleClickOutside = (e) => {
      // menuRef.current.contains(e.target)：點擊的元素是否在選單內
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-rose-500 font-bold text-2xl tracking-tight">
          airbnb
        </Link>

        {/* 搜尋列（桌機版） */}
        <div className="hidden md:flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition cursor-pointer">
          <span className="text-sm font-medium text-gray-700 px-3 border-r border-gray-300">任何地點</span>
          <span className="text-sm font-medium text-gray-700 px-3 border-r border-gray-300">任何週</span>
          <span className="text-sm text-gray-500 px-3">新增旅客</span>
          <div className="bg-rose-500 text-white rounded-full p-2 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 右側選單 */}
        {user ? (
          // ── 已登入：漢堡 + 頭像按鈕 ──
          // relative：讓下拉選單可以用 absolute 定位在這個按鈕下方
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 border border-gray-300 rounded-full pl-3 pr-1 py-1 hover:shadow-md transition"
            >
              {/* 漢堡 icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* 頭像小圓圈 */}
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-sm overflow-hidden">
                {user.avatar
                  ? <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                  : user.name[0].toUpperCase()
                }
              </div>
            </button>

            {/* 下拉選單 */}
            {menuOpen && (
              // absolute right-0 top-12：定位在按鈕右下方
              // shadow-lg：明顯的陰影讓選單浮起來
              <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-50">

                {/* 使用者名稱（不可點擊，只是顯示） */}
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                <MenuItem to="/profile" onClick={() => setMenuOpen(false)}>個人設定</MenuItem>
                <MenuItem to="/bookings" onClick={() => setMenuOpen(false)}>我的訂單</MenuItem>
                <MenuItem to="/favorites" onClick={() => setMenuOpen(false)}>收藏清單</MenuItem>

                {/* 房東功能（只有 isHost 才顯示） */}
                {user.isHost && (
                  <>
                    <div className="border-t border-gray-100 my-1" />
                    <MenuItem to="/host/listings" onClick={() => setMenuOpen(false)}>管理房源</MenuItem>
                    <MenuItem to="/host/bookings" onClick={() => setMenuOpen(false)}>訂單管理</MenuItem>
                    <MenuItem to="/host/listings/new" onClick={() => setMenuOpen(false)}>刊登新房源</MenuItem>
                  </>
                )}

                {/* 開啟房東模式的提示（isHost 為 false 時） */}
                {!user.isHost && (
                  <>
                    <div className="border-t border-gray-100 my-1" />
                    <MenuItem to="/profile" onClick={() => setMenuOpen(false)}>
                      <span className="text-rose-500">成為房東</span>
                    </MenuItem>
                  </>
                )}

                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  登出
                </button>
              </div>
            )}
          </div>
        ) : (
          // ── 未登入：登入/註冊按鈕 ──
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition">
              登入
            </Link>
            <Link to="/register" className="text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full transition">
              註冊
            </Link>
          </div>
        )}

      </div>
    </header>
  )
}

// ── 選單項目元件（避免重複寫相同樣式） ──────────
function MenuItem({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
    >
      {children}
    </Link>
  )
}

export default Navbar
