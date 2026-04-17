// ─────────────────────────────────────────────
// 圖片牆元件
// ─────────────────────────────────────────────
// 版面：左側一張大圖 + 右側四張小圖（仿 Airbnb 5宮格）
// 點擊「顯示所有相片」後開啟全螢幕燈箱

import { useState } from 'react'

function ImageGallery({ images = [], title }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)  // null 代表燈箱關閉，數字代表目前顯示哪張

  // 補足 5 張圖片的佔位（圖片不足時用預設圖）
  const displayImages = [...images]
  while (displayImages.length < 5) {
    displayImages.push('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800')
  }

  return (
    <>
      {/* ── 圖片網格 ── */}
      {/* overflow-hidden + rounded-2xl：讓整個區塊有圓角 */}
      <div className="relative grid grid-cols-4 grid-rows-2 gap-2 h-96 overflow-hidden rounded-2xl">

        {/* 左側大圖（佔 2 欄 2 列） */}
        <div
          className="col-span-2 row-span-2 cursor-pointer overflow-hidden"
          onClick={() => setLightboxIndex(0)}
        >
          <img
            src={displayImages[0]}
            alt={title}
            className="w-full h-full object-cover hover:brightness-90 transition"
          />
        </div>

        {/* 右側 4 張小圖 */}
        {displayImages.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="cursor-pointer overflow-hidden"
            onClick={() => setLightboxIndex(i + 1)}
          >
            <img
              src={img}
              alt={`${title} ${i + 2}`}
              className="w-full h-full object-cover hover:brightness-90 transition"
            />
          </div>
        ))}

        {/* 「顯示所有相片」按鈕（右下角） */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="absolute bottom-4 right-4 bg-white text-gray-900 text-sm font-medium border border-gray-900 rounded-lg px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          顯示所有相片
        </button>
      </div>

      {/* ── 燈箱（全螢幕圖片瀏覽） ── */}
      {lightboxIndex !== null && (
        // fixed inset-0：覆蓋整個畫面
        // bg-black/90：黑色背景 90% 透明度
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

          {/* 關閉按鈕 */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 上一張按鈕 */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 text-white hover:text-gray-300 transition p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 圖片 */}
          <img
            src={images[lightboxIndex] || displayImages[lightboxIndex]}
            alt={title}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />

          {/* 下一張按鈕 */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 text-white hover:text-gray-300 transition p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 圖片計數 */}
          <div className="absolute bottom-4 text-white text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
