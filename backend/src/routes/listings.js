// ─────────────────────────────────────────────
// 房源路由 (Listings Routes)
// 負責：查詢列表、查詢詳情、新增、編輯、刪除房源
// ─────────────────────────────────────────────
// 路由對應：
//   GET    /api/listings         → 取得房源列表（支援篩選）
//   GET    /api/listings/:id     → 取得單一房源詳情
//   POST   /api/listings         → 新增房源（需登入）
//   PUT    /api/listings/:id     → 編輯房源（需登入，只能改自己的）
//   DELETE /api/listings/:id     → 刪除房源（需登入，只能刪自己的）

import { Router } from 'express'
import prisma from '../utils/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// ── 取得房源列表（支援搜尋篩選）────────────────
router.get('/', async (req, res) => {
  try {
    // req.query 是 URL 的查詢參數，例如：
    // GET /api/listings?location=台北&category=海邊&minPrice=500
    const { location, category, minPrice, maxPrice, guests } = req.query

    const listings = await prisma.listing.findMany({
      where: {
        // 展開運算子（...）：只有該參數有傳才加入篩選條件
        // contains + insensitive = 模糊搜尋，不分大小寫
        ...(location && { location: { contains: location, mode: 'insensitive' } }),
        ...(category && { category }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),  // gte = >= (大於等於)
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),  // lte = <= (小於等於)
        ...(guests && { maxGuests: { gte: parseInt(guests) } }),
      },
      include: {
        // 同時撈出關聯資料，不用再發額外 SQL
        host: { select: { id: true, name: true, avatar: true } },
        reviews: { select: { rating: true } },  // 只撈評分，用來計算平均分
      },
      orderBy: { createdAt: 'desc' },  // 最新的排最前面
    })
    res.json(listings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── 取得單一房源詳情 ────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    // req.params.id 是 URL 路徑上的參數，例如 /api/listings/abc123
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        host: { select: { id: true, name: true, avatar: true } },
        // 詳情頁要顯示完整評論，包含評論者資料
        reviews: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
        },
      },
    })
    if (!listing) return res.status(404).json({ message: '找不到房源' })
    res.json(listing)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── 新增房源 ────────────────────────────────────
// authenticate 確保只有登入的使用者才能新增
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, price, location, lat, lng, images, maxGuests, category } = req.body

    const listing = await prisma.listing.create({
      data: {
        title, description, price, location, lat, lng, images, maxGuests, category,
        hostId: req.user.id,  // 從 token 取得當前使用者 ID，自動設為房東
      },
    })
    res.status(201).json(listing)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── 編輯房源 ────────────────────────────────────
router.put('/:id', authenticate, async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } })
    if (!listing) return res.status(404).json({ message: '找不到房源' })

    // 確認這筆房源是當前登入使用者的，防止別人修改你的房源
    if (listing.hostId !== req.user.id) return res.status(403).json({ message: '無權限修改此房源' })

    const updated = await prisma.listing.update({
      where: { id: req.params.id },
      data: req.body,  // 直接用前端傳來的資料更新
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── 刪除房源 ────────────────────────────────────
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } })
    if (!listing) return res.status(404).json({ message: '找不到房源' })

    if (listing.hostId !== req.user.id) return res.status(403).json({ message: '無權限刪除此房源' })

    await prisma.listing.delete({ where: { id: req.params.id } })
    res.json({ message: '刪除成功' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
