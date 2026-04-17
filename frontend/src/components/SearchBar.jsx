// ─────────────────────────────────────────────
// 搜尋列元件（手機版）
// ─────────────────────────────────────────────

import { useState } from 'react'

function SearchBar({ filters, onSearch }) {
  // 本地暫存輸入值，按下搜尋才更新父元件的 filters
  const [local, setLocal] = useState(filters)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(local)  // 把最新的篩選條件傳給父元件（HomePage）
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="搜尋地點..."
        value={local.location}
        onChange={(e) => setLocal((prev) => ({ ...prev, location: e.target.value }))}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
      />
      <button
        type="submit"
        className="bg-rose-500 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-rose-600 transition"
      >
        搜尋
      </button>
    </form>
  )
}

export default SearchBar
