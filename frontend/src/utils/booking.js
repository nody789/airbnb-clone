// ─────────────────────────────────────────────
// 訂房計算工具函式
// ─────────────────────────────────────────────
// 為什麼要獨立抽出來？
//   1. 元件（BookingWidget）只負責顯示 UI
//   2. 計算邏輯獨立出來，才能單獨測試
//   3. 未來如果計算邏輯改變，只需改這一個地方
//
// 這是「關注點分離」的概念：UI 歸 UI，邏輯歸邏輯

/**
 * 計算入住天數
 * @param {string} checkIn  - 入住日期，格式 'YYYY-MM-DD'
 * @param {string} checkOut - 退房日期，格式 'YYYY-MM-DD'
 * @returns {number} 天數（退房日 - 入住日）
 */
export function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0

  const diff = new Date(checkOut) - new Date(checkIn)  // 毫秒差
  // 1天 = 24小時 × 60分 × 60秒 × 1000毫秒
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * 計算服務費（房價 × 天數 × 15%）
 * @param {number} price  - 每晚價格
 * @param {number} nights - 住幾晚
 * @returns {number} 服務費（四捨五入）
 */
export function calcServiceFee(price, nights) {
  return Math.round(price * nights * 0.15)
}

/**
 * 計算總價（房價合計 + 服務費）
 * @param {number} price  - 每晚價格
 * @param {number} nights - 住幾晚
 * @returns {number} 總價
 */
export function calcTotalPrice(price, nights) {
  const roomCost   = price * nights
  const serviceFee = calcServiceFee(price, nights)
  return roomCost + serviceFee
}

/**
 * 驗證日期範圍是否合法
 * @param {string} checkIn
 * @param {string} checkOut
 * @returns {{ valid: boolean, message: string }}
 */
export function validateDates(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return { valid: false, message: '請選擇入住和退房日期' }
  }

  const nights = calcNights(checkIn, checkOut)

  if (nights <= 0) {
    return { valid: false, message: '退房日期必須晚於入住日期' }
  }

  return { valid: true, message: '' }
}
