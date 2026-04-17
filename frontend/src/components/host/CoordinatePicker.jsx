// ─────────────────────────────────────────────
// 座標選取器（新增房源時用地圖點選位置）
// ─────────────────────────────────────────────
// 繼承自 ListingMap，但加上點擊取得座標的功能
// useMapEvents：react-leaflet 提供的 hook，監聽地圖事件

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// 台灣中心座標（預設地圖中心）
const TAIWAN_CENTER = [23.6978, 120.9605]

// 內部元件：監聽地圖點擊事件
// 這要獨立成一個元件，因為 useMapEvents 必須在 MapContainer 內部使用
function ClickHandler({ onMapClick }) {
  useMapEvents({
    // 當使用者點擊地圖時觸發
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null  // 這個元件不渲染任何 UI，只負責監聽事件
}

function CoordinatePicker({ lat, lng, onMapClick }) {
  // 如果已有座標就用已選的位置，否則預設顯示台灣
  const center = lat && lng ? [parseFloat(lat), parseFloat(lng)] : TAIWAN_CENTER

  return (
    <div className="h-64 rounded-xl overflow-hidden border border-gray-300 cursor-crosshair">
      <MapContainer
        center={center}
        zoom={lat && lng ? 13 : 7}  // 有選座標就放大，否則顯示全台灣
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 監聽點擊事件，回傳座標給父元件 */}
        <ClickHandler onMapClick={onMapClick} />

        {/* 如果已有選取的座標，顯示標記 */}
        {lat && lng && (
          <Marker position={[parseFloat(lat), parseFloat(lng)]}>
            <Popup>已選取此位置</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default CoordinatePicker
