// ─────────────────────────────────────────────
// 類別篩選列元件（仿 Airbnb 頂部類別 icon 列）
// ─────────────────────────────────────────────

// 類別清單：每個項目有 icon（emoji）和顯示名稱
const CATEGORIES = [
  { value: '', label: '全部', icon: '🏠' },
  { value: '海邊', label: '海邊', icon: '🏖️' },
  { value: '山區', label: '山區', icon: '⛰️' },
  { value: '城市', label: '城市', icon: '🏙️' },
  { value: '鄉村', label: '鄉村', icon: '🌾' },
  { value: '溫泉', label: '溫泉', icon: '♨️' },
  { value: '島嶼', label: '島嶼', icon: '🏝️' },
  { value: '露營', label: '露營', icon: '🏕️' },
]

function CategoryFilter({ selected, onSelect }) {
  return (
    // overflow-x-auto：橫向超出時可以滑動（手機版適用）
    <div className="flex gap-8 overflow-x-auto pb-2 border-b border-gray-200 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          // 選中的類別用 border-b-2 加底線，其他是透明底線
          className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition whitespace-nowrap ${
            selected === cat.value
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs font-medium">{cat.label}</span>
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
