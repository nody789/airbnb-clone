// ─────────────────────────────────────────────
// 收藏清單頁面
// ─────────────────────────────────────────────
// 功能：
//   1. 顯示所有收藏的房源（和首頁卡片一樣的版面）
//   2. 可以直接在這裡移除收藏
//   3. 點擊卡片跳轉到房源詳情頁

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, removeFavorite } from '../services/api'
import { Link } from 'react-router-dom'

function FavoritesPage() {
  const queryClient = useQueryClient()

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavorites().then((res) => res.data),
  })

  const { mutate: remove } = useMutation({
    mutationFn: (listingId) => removeFavorite(listingId),
    onSuccess: () => {
      // 移除後重新整理收藏列表
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  if (isLoading) return <FavoritesSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">收藏清單</h1>
      <p className="text-gray-500 text-sm mb-8">
        {favorites.length > 0 ? `${favorites.length} 個房源` : ''}
      </p>

      {favorites.length === 0 ? (
        // 空狀態
        <div className="text-center py-24">
          <div className="text-6xl mb-4">❤️</div>
          <p className="text-xl font-medium text-gray-900 mb-2">還沒有收藏</p>
          <p className="text-gray-500 mb-6">瀏覽房源時點擊愛心，將喜歡的住宿加入收藏</p>
          <Link
            to="/"
            className="inline-block bg-rose-500 text-white font-medium px-6 py-3 rounded-xl hover:bg-rose-600 transition"
          >
            探索住宿
          </Link>
        </div>
      ) : (
        // 和首頁相同的 grid 格狀排版
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((listing) => (
            <FavoriteCard
              key={listing.id}
              listing={listing}
              onRemove={() => remove(listing.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── 收藏房源卡片 ─────────────────────────────────
// 和 ListingCard 相似，但愛心按鈕固定是「已收藏」狀態，點擊直接移除
function FavoriteCard({ listing, onRemove }) {
  const avgRating = listing.reviews?.length
    ? (listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length).toFixed(1)
    : null

  return (
    <Link to={`/listings/${listing.id}`} className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={listing.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
          alt={listing.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
        />

        {/* 移除收藏按鈕（愛心填滿狀態） */}
        <button
          onClick={(e) => {
            e.preventDefault()  // 阻止跳轉到詳情頁
            onRemove()
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/70 hover:bg-white transition"
          title="移除收藏"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 fill-rose-500" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-gray-900 truncate">{listing.location}</p>
          {avgRating && (
            <div className="flex items-center gap-1 text-sm text-gray-700 shrink-0 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {avgRating}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{listing.title}</p>
        <p className="text-sm mt-1">
          <span className="font-semibold text-gray-900">NT$ {listing.price.toLocaleString()}</span>
          <span className="text-gray-500"> / 晚</span>
        </p>
      </div>
    </Link>
  )
}

// ── 骨架屏 ──────────────────────────────────────
function FavoritesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="h-8 bg-gray-200 rounded w-32 mb-8 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-64 mb-3" />
            <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
            <div className="bg-gray-200 h-4 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage
