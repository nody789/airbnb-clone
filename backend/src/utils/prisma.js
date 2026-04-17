// ─────────────────────────────────────────────
// Prisma Client 單例 (Singleton)
// ─────────────────────────────────────────────
// Prisma 是 ORM（物件關聯對映），讓你用 JS 操作資料庫
// 不用寫 SQL，改用像這樣的語法：
//   prisma.user.findMany()   → SELECT * FROM users
//   prisma.user.create(...)  → INSERT INTO users ...
//
// 這裡只建立一個 PrismaClient 實例並匯出，
// 所有路由共用同一個，避免建立過多資料庫連線

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default prisma
