// ─────────────────────────────────────────────
// 假資料腳本（Seed Script）
// ─────────────────────────────────────────────
// 用途：在資料庫填入示範資料，方便開發和展示
// 執行：npm run seed（在 backend/ 目錄下）
//
// 注意：每次執行會先清除現有資料再重新建立

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 開始填入示範資料...\n')

  // ── 清除現有資料（順序很重要！要先刪有外鍵的資料表）──
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.user.deleteMany()
  console.log('🗑️  已清除舊資料')

  // ── 建立使用者 ──────────────────────────────────────
  const hashedPassword = await bcrypt.hash('demo1234', 10)

  const host = await prisma.user.create({
    data: {
      name: '陳大明',
      email: 'host@demo.com',
      password: hashedPassword,
      isHost: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    },
  })

  const guest = await prisma.user.create({
    data: {
      name: '林小美',
      email: 'guest@demo.com',
      password: hashedPassword,
      isHost: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c38b?w=150&auto=format&fit=crop',
    },
  })

  console.log('👤 已建立使用者：host@demo.com / guest@demo.com（密碼都是 demo1234）')

  // ── 建立房源 ──────────────────────────────────────
  const listingsData = [
    {
      title: '信義區現代設計公寓',
      description:
        '位於台北最繁華的信義商圈，步行即可抵達101大樓和各大百貨。公寓採現代北歐風格設計，配備全套廚房設備、高速網路和智慧家電。適合商務出差或城市觀光的旅客，周邊餐廳、咖啡廳和交通十分便利。',
      price: 3800,
      location: '台北市信義區',
      lat: 25.0338,
      lng: 121.5645,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
      ],
      maxGuests: 3,
      category: '城市',
    },
    {
      title: '墾丁南灣海景獨棟別墅',
      description:
        '俯瞰南灣湛藍海景的私人別墅，距離沙灘步行只需3分鐘。備有寬敞的戶外露台和泳池，是家庭旅遊或朋友聚會的首選。清晨可欣賞日出，夜晚享受星空，是南台灣最美的度假體驗之一。',
      price: 5500,
      location: '屏東縣恆春鎮',
      lat: 21.9389,
      lng: 120.8422,
      images: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
      ],
      maxGuests: 8,
      category: '海邊',
    },
    {
      title: '阿里山雲霧山林木屋',
      description:
        '隱身阿里山森林中的溫馨木屋，海拔約1500公尺，終年雲霧繚繞。清晨步行即可抵達觀日出平台，晚上躺在床上就能聽見蟲鳴鳥叫。房間備有火爐和厚棉被，是體驗台灣山林風情的絕佳選擇。',
      price: 2800,
      location: '嘉義縣阿里山鄉',
      lat: 23.5137,
      lng: 120.8037,
      images: [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800&auto=format&fit=crop',
      ],
      maxGuests: 4,
      category: '山區',
    },
    {
      title: '北投百年溫泉旅館',
      description:
        '座落在北投溪畔的傳統溫泉旅館，擁有百年歷史建築。提供私人湯屋和戶外露天溫泉池，泉質為全台罕見的北投石放射能泉。享用完溫泉後可漫步參觀北投溫泉博物館，感受日治時代的風情。',
      price: 4500,
      location: '台北市北投區',
      lat: 25.1281,
      lng: 121.5053,
      images: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop',
      ],
      maxGuests: 2,
      category: '溫泉',
    },
    {
      title: '澎湖小離島珊瑚礁民宿',
      description:
        '坐落在澎湖群島中一座寧靜小島上，四周被清澈的珊瑚礁海洋環繞。可從這裡出發浮潛、乘船探索周邊無人島，體驗最純粹的島嶼生活。傍晚坐在礁石上欣賞澎湖著名的落日，令人難忘。',
      price: 3200,
      location: '澎湖縣馬公市',
      lat: 23.5700,
      lng: 119.5793,
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop',
      ],
      maxGuests: 4,
      category: '島嶼',
    },
    {
      title: '合歡山高山星空露營地',
      description:
        '海拔3000公尺的合歡山星空露營，遠離城市光害，銀河觸手可及。提供豪華露營裝備（Glamping），無需自備帳篷，附贈早餐和熱飲。白天可健行賞花，冬季有機會體驗台灣難得一見的雪景。',
      price: 2200,
      location: '南投縣仁愛鄉',
      lat: 24.1452,
      lng: 121.2782,
      images: [
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=800&auto=format&fit=crop',
      ],
      maxGuests: 2,
      category: '露營',
    },
    {
      title: '台南古都百年老宅',
      description:
        '改建自清代古厝的文創民宿，保留百年紅磚和木雕工藝，融入現代舒適設施。位於台南中西區文化古蹟密集區，步行即可拜訪赤嵌樓、祀典武廟等歷史景點。早餐供應道地台南碗粿和虱目魚粥。',
      price: 2600,
      location: '台南市中西區',
      lat: 22.9936,
      lng: 120.1877,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop',
      ],
      maxGuests: 3,
      category: '城市',
    },
    {
      title: '九份山城雨霧茶樓',
      description:
        '仿《神隱少女》場景的九份山城民宿，夜晚點燈後如夢似幻。坐在木造陽台上，一邊品茗一邊俯瞰基隆港和山城燈火，是最具台灣特色的旅宿體驗。附近有阿妹茶館、奉天宮、老街等景點。',
      price: 3500,
      location: '新北市瑞芳區',
      lat: 25.1095,
      lng: 121.8448,
      images: [
        'https://images.unsplash.com/photo-1538932936090-6cec5a03a571?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519181245277-cffeb31da948?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526285759904-71d1170ed2e8?w=800&auto=format&fit=crop',
      ],
      maxGuests: 2,
      category: '山區',
    },
    {
      title: '花蓮七星潭海岸套房',
      description:
        '緊鄰七星潭月牙形礫石海灘，從房間推窗即見太平洋壯闊海景。清晨可沿著海岸線慢跑，欣賞太陽從中央山脈升起的絕美景色。周邊有新城鄉、太魯閣國家公園，適合深度花蓮旅遊的旅客。',
      price: 3900,
      location: '花蓮縣新城鄉',
      lat: 24.0073,
      lng: 121.6137,
      images: [
        'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&auto=format&fit=crop',
      ],
      maxGuests: 2,
      category: '海邊',
    },
    {
      title: '苗栗客家田園農莊',
      description:
        '坐落在苗栗三義丘陵地帶的客家農莊，四周是梯田和竹林。可體驗採摘有機蔬菜、製作客家傳統麻糬，並享用農莊自己種植的食材烹調的早餐。適合親子旅遊，讓孩子體驗台灣農村生活。',
      price: 1900,
      location: '苗栗縣三義鄉',
      lat: 24.3869,
      lng: 120.7574,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&auto=format&fit=crop',
      ],
      maxGuests: 6,
      category: '鄉村',
    },
  ]

  // 逐一建立房源，全部指定給 host 使用者
  const listings = []
  for (const data of listingsData) {
    const listing = await prisma.listing.create({
      data: { ...data, hostId: host.id },
    })
    listings.push(listing)
  }
  console.log(`🏠 已建立 ${listings.length} 筆房源`)

  // ── 建立評論 ──────────────────────────────────────
  const reviewsData = [
    { listingId: listings[0].id, rating: 5, comment: '地點超棒！走路就到101，附近餐廳選擇很多。公寓很乾淨，設備齊全，會再回來的！' },
    { listingId: listings[0].id, rating: 4, comment: '整體很滿意，空間寬敞，採光好。唯一小缺點是停車場比較遠，但交通方便所以不太需要開車。' },
    { listingId: listings[1].id, rating: 5, comment: '墾丁最美的民宿！海景無敵，泳池超棒。房東很親切，推薦了很多好吃的在地餐廳。' },
    { listingId: listings[1].id, rating: 5, comment: '全家大小都喜歡！早上在露台喝咖啡看海，晚上烤肉看星星，完美假期！' },
    { listingId: listings[2].id, rating: 4, comment: '阿里山的木屋很有氛圍，早起看日出非常值得。山上氣溫偏低建議多帶件外套。' },
    { listingId: listings[3].id, rating: 5, comment: '北投溫泉品質一流！私人湯屋非常舒適，泡完精神放鬆。房間的日式裝潢很有特色。' },
    { listingId: listings[4].id, rating: 5, comment: '澎湖海水超清澈！從民宿出發浮潛15分鐘就看到珊瑚礁，魚類豐富。強烈推薦！' },
    { listingId: listings[5].id, rating: 4, comment: '高山星空真的美翻了！銀河清晰可見，是這輩子看過最美的星空。露營設備很齊全。' },
    { listingId: listings[6].id, rating: 5, comment: '老宅改建得很有味道，住在古厝裡感覺很特別。早餐的碗粿和虱目魚粥超好吃！' },
    { listingId: listings[7].id, rating: 4, comment: '九份夜景真的美！晚上從陽台看燈火好有氛圍。房間空間稍小但裝潢精緻，很有特色。' },
    { listingId: listings[8].id, rating: 5, comment: '七星潭的日出美到哭！從房間推開窗就是海，聽著海浪聲入睡。花蓮必住的民宿！' },
    { listingId: listings[9].id, rating: 4, comment: '客家農莊體驗很特別，小孩第一次採蔬菜開心極了。早餐用自種食材做的，新鮮好吃！' },
  ]

  for (const data of reviewsData) {
    await prisma.review.create({
      data: { ...data, authorId: guest.id },
    })
  }
  console.log(`⭐ 已建立 ${reviewsData.length} 筆評論`)

  // ── 建立訂單範例 ──────────────────────────────────
  const today = new Date()
  const futureDate = (days) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

  await prisma.booking.createMany({
    data: [
      {
        guestId: guest.id,
        listingId: listings[0].id,
        checkIn: futureDate(7),
        checkOut: futureDate(10),
        totalPrice: 3800 * 3 * 1.15,
        status: 'CONFIRMED',
      },
      {
        guestId: guest.id,
        listingId: listings[1].id,
        checkIn: futureDate(20),
        checkOut: futureDate(23),
        totalPrice: 5500 * 3 * 1.15,
        status: 'PENDING',
      },
    ],
  })
  console.log('📅 已建立 2 筆訂單')

  console.log('\n✅ 示範資料建立完成！')
  console.log('────────────────────────')
  console.log('  帳號：host@demo.com  │ 密碼：demo1234（房東）')
  console.log('  帳號：guest@demo.com │ 密碼：demo1234（旅客）')
  console.log('────────────────────────')
}

main()
  .catch((e) => {
    console.error('❌ 建立失敗：', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
