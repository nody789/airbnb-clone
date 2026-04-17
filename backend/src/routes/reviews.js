// ─────────────────────────────────────────────
// 評論路由 (Reviews Routes)
// 負責：查詢某房源的評論、新增評論
// ─────────────────────────────────────────────
// 這個路由是「巢狀路由」，掛載在 /api/listings/:listingId/reviews 下
// 例如：GET /api/listings/abc123/reviews
//
// mergeParams: true 讓這個子路由能取得上層路由的 :listingId 參數

import { Router } from 'express'
import prisma from '../utils/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router({ mergeParams: true })  // 繼承上層路由的 URL 參數

// ── 取得某房源的所有評論 ─────────────────────────
router.get('/', async (req, res) => {
  try {
    // req.params.listingId 來自上層路由 /api/listings/:listingId/reviews
    const reviews = await prisma.review.findMany({
      where: { listingId: req.params.listingId },
      include: {
        // 帶出評論者的基本資訊，前端顯示頭像和名字
        author: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── 新增評論 ─────────────────────────────────────
router.post('/', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body  // rating: 1~5 的整數

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        authorId: req.user.id,           // 從 token 取得評論者 ID
        listingId: req.params.listingId, // 從 URL 取得房源 ID
      },
    })
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
