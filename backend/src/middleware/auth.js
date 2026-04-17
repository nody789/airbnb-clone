// ─────────────────────────────────────────────
// JWT 驗證中介軟體 (Authentication Middleware)
// ─────────────────────────────────────────────
// JWT（JSON Web Token）是一種登入驗證機制：
//   1. 使用者登入成功 → 後端產生一個 token 字串給前端
//   2. 前端把 token 存起來（localStorage）
//   3. 之後每次呼叫需要登入的 API，前端在 Header 帶上：
//      Authorization: Bearer <token>
//   4. 後端用這個 middleware 驗證 token 是否有效
//
// 使用方式：在需要登入的路由加上 authenticate 參數
//   router.get('/bookings', authenticate, (req, res) => { ... })

import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  // 從請求 Header 取出 token
  // Authorization: "Bearer eyJhbGci..." → split(' ')[1] 取得 token 部分
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: '未授權，請先登入' })
  }

  try {
    // 用 JWT_SECRET 解碼 token，取得當初存入的資料（userId）
    // 如果 token 被竄改或過期，這裡會拋出錯誤
    req.user = jwt.verify(token, process.env.JWT_SECRET)

    // next() 代表「通過驗證，繼續執行下一個處理函式」
    next()
  } catch {
    res.status(401).json({ message: 'Token 無效或已過期，請重新登入' })
  }
}
