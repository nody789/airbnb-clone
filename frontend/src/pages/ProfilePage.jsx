// ─────────────────────────────────────────────
// 個人設定頁面
// ─────────────────────────────────────────────
// 功能：
//   1. 修改名稱和頭像網址
//   2. 開啟/關閉房東模式（isHost）
//      → 開啟後 Navbar 才會出現「管理房源」

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateProfile, changePassword } from '../services/api'
import useAuthStore from '../stores/authStore'

function ProfilePage() {
  const { user, setUser } = useAuthStore()

  // 用 user 資料初始化表單
  const [form, setForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  })
  const [saved, setSaved] = useState(false)  // 顯示「已儲存」提示

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  // 更新基本資料
  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: ({ data }) => {
      setUser(data)   // 同步更新 Zustand store 和 localStorage
      setSaved(true)
    },
  })

  // 修改密碼表單狀態
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setPwError('')
    setPwSaved(false)
  }

  const { mutate: savePassword, isPending: isSavingPw } = useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      setPwSaved(true)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    },
    onError: (err) => {
      setPwError(err.response?.data?.message || '修改失敗，請稍後再試')
    },
  })

  const handlePwSubmit = (e) => {
    e.preventDefault()
    setPwError('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('新密碼與確認密碼不一致')
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('新密碼至少需要 6 個字元')
      return
    }
    savePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
  }

  // 切換房東模式（獨立的 toggle，即時生效）
  const { mutate: toggleHost, isPending: isToggling } = useMutation({
    mutationFn: (isHost) => updateProfile({ isHost }),
    onSuccess: ({ data }) => {
      setUser(data)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    save({ name: form.name, avatar: form.avatar || null })
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">個人設定</h1>

      <div className="space-y-8">

        {/* ── 頭像預覽 ── */}
        <div className="flex items-center gap-6 pb-8 border-b border-gray-200">
          {/* 頭像：有圖片就顯示圖片，否則顯示姓名首字 */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-3xl shrink-0">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="頭像"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            {user?.isHost && (
              <span className="inline-block mt-1 text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">
                房東
              </span>
            )}
          </div>
        </div>

        {/* ── 基本資料表單 ── */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">基本資料</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">名稱</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              頭像網址 <span className="text-gray-400 font-normal">（選填）</span>
            </label>
            <input
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://... 圖片網址"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
            >
              {isSaving ? '儲存中...' : '儲存變更'}
            </button>
            {/* 儲存成功提示，2 秒後靠 CSS 淡出（靠 saved state 控制顯示） */}
            {saved && (
              <p className="text-green-600 text-sm font-medium">✓ 已儲存</p>
            )}
          </div>
        </form>

        {/* ── 修改密碼 ── */}
        <form onSubmit={handlePwSubmit} className="space-y-5 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900">修改密碼</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">目前密碼</label>
            <input
              type="password"
              name="currentPassword"
              value={pwForm.currentPassword}
              onChange={handlePwChange}
              placeholder="輸入目前的密碼"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">新密碼</label>
            <input
              type="password"
              name="newPassword"
              value={pwForm.newPassword}
              onChange={handlePwChange}
              placeholder="至少 6 個字元"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">確認新密碼</label>
            <input
              type="password"
              name="confirmPassword"
              value={pwForm.confirmPassword}
              onChange={handlePwChange}
              placeholder="再輸入一次新密碼"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            />
          </div>

          {/* 錯誤訊息 */}
          {pwError && (
            <p className="text-sm text-red-500">{pwError}</p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSavingPw}
              className="bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition"
            >
              {isSavingPw ? '更新中...' : '更新密碼'}
            </button>
            {pwSaved && (
              <p className="text-green-600 text-sm font-medium">✓ 密碼已更新</p>
            )}
          </div>
        </form>

        {/* ── 房東模式 ── */}
        <div className="border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">房東模式</h2>
              <p className="text-sm text-gray-500 mt-1">
                {user?.isHost
                  ? '已開啟。您可以刊登房源並管理訂單。'
                  : '開啟後即可刊登房源，讓旅客預訂您的住宿。'}
              </p>
            </div>

            {/* Toggle Switch */}
            {/* 點擊時呼叫 toggleHost，傳入相反的 isHost 值 */}
            <button
              onClick={() => toggleHost(!user?.isHost)}
              disabled={isToggling}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
                user?.isHost ? 'bg-rose-500' : 'bg-gray-300'
              }`}
            >
              {/* 滑動的白色圓點 */}
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                  user?.isHost ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 開啟房東模式後顯示的提示 */}
          {user?.isHost && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <a
                href="/host/listings"
                className="text-sm text-rose-500 font-medium hover:underline"
              >
                前往管理房源 →
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProfilePage
