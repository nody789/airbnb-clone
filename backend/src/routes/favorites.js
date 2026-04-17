// ─────────────────────────────────────────────
// 收藏路由 (Favorites Routes)
// 負責：取得收藏清單、新增收藏、移除收藏
// ─────────────────────────────────────────────
// 所有路由都需要登入
//
// 路由對應：
//   GET    /api/favorites/:listingId → 取得我的所有收藏房源
//   POST   /api/favorites/:listingId → 收藏某房源
//   DELETE /api/favorites/:listingId → 取消收藏某房源

import { Router } from 'express'
import prisma from '../utils/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// ── 取得收藏清單 ─────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { listing: true },  // 把完整房源資料一起帶出來
    })

    // 只回傳房源資料（不回傳 favorite 本身），前端更好處理
    res.json(favorites.map((f) => f.listing))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── 新增收藏 ─────────────────────────────────────
router.post('/:listingId', authenticate, async (req, res) => {
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        listingId: req.params.listingId,
      },
    })
    res.status(201).json(favorite)
  } catch (err) {
    // 若已收藏（unique 約束）會報錯，可在這裡處理
    res.status(500).json({ message: err.message })
  }
})

// ── 移除收藏 ─────────────────────────────────────
router.delete('/:listingId', authenticate, async (req, res) => {
  try {
    // userId_listingId 是 Prisma 根據 @@unique([userId, listingId]) 自動產生的複合鍵名稱
    await prisma.favorite.delete({
      where: {
        userId_listingId: {
          userId: req.user.id,
          listingId: req.params.listingId,
        },
      },
    })
    res.json({ message: '已移除收藏' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
