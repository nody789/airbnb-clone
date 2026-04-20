// ─────────────────────────────────────────────
// 單元測試：訂房計算函式
// ─────────────────────────────────────────────
// 執行方式：npm run test
//
// 測試結構：
//   describe('群組名稱', () => {     ← 把相關測試包在一起
//     it('應該要...', () => {        ← 一個 it = 一個測試案例
//       expect(結果).toBe(預期值)    ← 斷言：結果必須等於預期
//     })
//   })
//
// 口訣：「給這個輸入，應該得到這個輸出」

import { describe, it, expect } from 'vitest'
import {
  calcNights,
  calcServiceFee,
  calcTotalPrice,
  validateDates,
} from './booking'

// ── calcNights（計算天數）─────────────────────
describe('calcNights 計算天數', () => {

  it('住 2 晚應該回傳 2', () => {
    const result = calcNights('2024-01-01', '2024-01-03')
    expect(result).toBe(2)
    // 解讀：給入住 1/1、退房 1/3，期望回傳 2（天）
  })

  it('住 1 晚應該回傳 1', () => {
    expect(calcNights('2024-06-10', '2024-06-11')).toBe(1)
  })

  it('住 7 晚應該回傳 7', () => {
    expect(calcNights('2024-03-01', '2024-03-08')).toBe(7)
  })

  it('日期相同應該回傳 0', () => {
    // 同一天入住退房 = 0 晚，不合法的輸入
    expect(calcNights('2024-01-01', '2024-01-01')).toBe(0)
  })

  it('沒有輸入日期應該回傳 0', () => {
    expect(calcNights('', '')).toBe(0)
    expect(calcNights(null, null)).toBe(0)
  })

})

// ── calcServiceFee（計算服務費）──────────────
describe('calcServiceFee 計算服務費（15%）', () => {

  it('每晚 1000、住 2 晚，服務費應該是 300', () => {
    // 1000 × 2 × 15% = 300
    expect(calcServiceFee(1000, 2)).toBe(300)
  })

  it('每晚 1500、住 3 晚，服務費應該是 675', () => {
    // 1500 × 3 × 15% = 675
    expect(calcServiceFee(1500, 3)).toBe(675)
  })

  it('有小數點時應該四捨五入', () => {
    // 999 × 1 × 15% = 149.85 → 四捨五入 = 150
    expect(calcServiceFee(999, 1)).toBe(150)
  })

})

// ── calcTotalPrice（計算總價）────────────────
describe('calcTotalPrice 計算總價', () => {

  it('每晚 1000、住 2 晚，總價應該是 2300', () => {
    // 房費 1000×2=2000，服務費 2000×15%=300，合計 2300
    expect(calcTotalPrice(1000, 2)).toBe(2300)
  })

  it('每晚 2000、住 1 晚，總價應該是 2300', () => {
    // 房費 2000，服務費 2000×15%=300，合計 2300
    expect(calcTotalPrice(2000, 1)).toBe(2300)
  })

  it('住 0 晚總價應該是 0', () => {
    expect(calcTotalPrice(1000, 0)).toBe(0)
  })

})

// ── validateDates（驗證日期）─────────────────
describe('validateDates 驗證日期合法性', () => {

  it('正常日期應該回傳 valid: true', () => {
    const result = validateDates('2024-01-01', '2024-01-03')
    expect(result.valid).toBe(true)
    expect(result.message).toBe('')
  })

  it('退房早於入住應該回傳 valid: false', () => {
    // 退房 1/1 比入住 1/3 還早，不合法
    const result = validateDates('2024-01-03', '2024-01-01')
    expect(result.valid).toBe(false)
    expect(result.message).toBe('退房日期必須晚於入住日期')
  })

  it('日期為空應該回傳 valid: false', () => {
    const result = validateDates('', '')
    expect(result.valid).toBe(false)
    expect(result.message).toBe('請選擇入住和退房日期')
  })

})
