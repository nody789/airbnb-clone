// ─────────────────────────────────────────────
// 首頁 - 房源列表
// ─────────────────────────────────────────────
// 使用到的 React Query 概念：
//   useQuery → 發 GET 請求，自動管理 loading/error/data 狀態
//   queryKey → 快取的識別鍵，相同 key 不會重複請求
//
// 使用到的 React 概念：
//   useState → 管理搜尋篩選條件

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getListings } from '../services/api'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'

function HomePage() {
  // 篩選條件，傳給 API
  const [filters, setFilters] = useState({ location: '', category: '', guests: '' })

  // useQuery：自動發請求並管理狀態
  //   - data：API 回傳的資料
  //   - isLoading：請求中（顯示骨架屏）
  //   - isError：請求失敗
  // queryKey 包含 filters，每次篩選條件改變就重新請求
  const { data: listings = [], isLoading, isError } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => getListings(filters).then((res) => res.data),
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* 搜尋列（手機版） */}
      <div className="md:hidden mb-6">
        <SearchBar filters={filters} onSearch={setFilters} />
      </div>

      {/* 類別篩選 */}
      <CategoryFilter
        selected={filters.category}
        onSelect={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
      />

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
        <div className="text-center py-20 text-gray-500">
          沒有符合條件的房源
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
