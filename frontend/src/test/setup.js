// ─────────────────────────────────────────────
// 測試全域設定檔
// ─────────────────────────────────────────────
// 這個檔案在「每個測試檔案執行之前」自動執行
//
// @testing-library/jest-dom 讓 expect() 多了很多專門測 DOM 的方法：
//   expect(el).toBeInTheDocument()  → 元素存在於畫面中
//   expect(el).toHaveTextContent()  → 元素有指定文字
//   expect(el).toBeDisabled()       → 按鈕被禁用
//   expect(el).toHaveClass()        → 元素有指定 CSS class
//   ...等等，比原生的 expect 更語意化

import '@testing-library/jest-dom'
