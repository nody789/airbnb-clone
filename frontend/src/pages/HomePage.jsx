// ─────────────────────────────────────────────
// 首頁 - 房源列表
// ─────────────────────────────────────────────
// 使用到的 React Query 概念：
//   useQuery → 發 GET 請求，自動管理 loading/error/data 狀態
//   queryKey → 快取的識別鍵，相同 key 不會重複請求
//
// 使用到的 React Router 概念：
//   useSearchParams → 讀寫 URL 的 query string（?location=台北&category=海邊）
//   這樣搜尋條件可以放在網址裡，方便分享或上一頁回來保留篩選狀態

import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getListings } from '../services/api'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'

function HomePage() {
  // useSearchParams：讀寫 URL query string
  //   searchParams.get('location') → 讀取 ?location= 的值
  //   setSearchParams({ ... })     → 更新 URL query string（不會跳轉頁面）
  const [searchParams, setSearchParams] = useSearchParams()

  // 從 URL 讀出篩選條件（如果 URL 沒有就用預設空字串）
  const filters = {
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    guests:   searchParams.get('guests')   || '',
  }

  // 更新某個篩選條件，同時保留其他條件
  const updateFilter = (key, value) => {
    // 把目前所有參數複製出來
    const next = {
      location: searchParams.get('location') || '',
      category: searchParams.get('category') || '',
      guests:   searchParams.get('guests')   || '',
    }
    next[key] = value
    // 移除空字串的參數（讓 URL 更乾淨）
    Object.keys(next).forEach((k) => { if (!next[k]) delete next[k] })
    setSearchParams(next)
  }

  // 手機版搜尋列：一次更新全部條件
  const handleMobileSearch = (newFilters) => {
    const next = { ...newFilters }
    Object.keys(next).forEach((k) => { if (!next[k]) delete next[k] })
    setSearchParams(next)
  }

  // useQuery：自動發請求並管理狀態
  // queryKey 包含 filters，每次篩選條件改變就重新請求
  const { data: listings = [], isLoading, isError } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => getListings(filters).then((res) => res.data),
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* 搜尋列（手機版，桌機版已在 Navbar 裡） */}
      <div className="md:hidden mb-6">
        <SearchBar filters={filters} onSearch={handleMobileSearch} />
      </div>

      {/* 類別篩選 */}
      <CategoryFilter
        selected={filters.category}
        onSelect={(cat) => updateFilter('category', cat)}
      />

      {/* 目前篩選條件顯示（有搜尋地點時才顯示，方便使用者知道目前在篩選） */}
      {(filters.location || filters.guests) && (
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
          <span>篩選條件：</span>
          {filters.location && (
            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              📍 {filters.location}
              {/* x 按鈕清除地點篩選 */}
              <button
                onClick={() => updateFilter('location', '')}
                className="text-gray-400 hover:text-gray-600 ml-1"
              >×</button>
            </span>
          )}
          {filters.guests && (
            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              👤 {filters.guests} 人
              <button
                onClick={() => updateFilter('guests', '')}
                className="text-gray-400 hover:text-gray-600 ml-1"
              >×</button>
            </span>
          )}
        </div>
      )}

      {/* 房源列表 */}
      {isLoading && (
        // 骨架屏：資料載入中時的佔位動畫
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-64 mb-3" />
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
              <div className="bg-gray-200 h-4 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-gray-500">
          載入失敗，請重新整理頁面
        </div>
      )}

      {!isLoading && !isError && listings.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium text-gray-700 mb-2">找不到符合條件的房源</p>
          <p className="text-gray-500 text-sm">試試清除篩選條件，或搜尋其他地點</p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 text-rose-500 text-sm underline hover:no-underline"
          >
            清除所有篩選
          </button>
        </div>
      )}

      {!isLoading && !isError && listings.length > 0 && (
        // grid：格狀排版
        // grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        // → 手機1欄、小螢幕2欄、中螢幕3欄、大螢幕4欄（響應式設計）
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {listings.map((listing) => (
            // key 是 React 用來識別列表項目的唯一值，必須提供
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

    </div>
  )
}

export default HomePage
