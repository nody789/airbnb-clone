# Airbnb Clone 專案規劃

## 技術棧

### 前端 (`/frontend`)
- React 18 + Vite
- Tailwind CSS
- shadcn/ui（元件庫）
- React Router v6
- React Query（伺服器狀態：API 請求、快取、loading/error）
- Zustand（全域 UI 狀態：登入使用者、Modal 等）
- Leaflet.js + OpenStreetMap（地圖，免費）
- Axios（API 請求）

### 後端 (`/backend`)
- Node.js + Express.js
- Prisma ORM
- PostgreSQL
- JWT + bcrypt（認證）
- Multer（圖片上傳）
- Cloudinary SDK（圖片儲存，免費方案）

### 部署（全免費）
- 前端：Vercel
- 後端：Render
- 資料庫：Supabase（PostgreSQL 免費 500MB）
- 圖片：Cloudinary 免費方案

---

## 資料夾結構

```
airbnb-clone/
├── frontend/
│   ├── src/
│   │   ├── components/      # 共用元件
│   │   ├── pages/           # 頁面
│   │   ├── hooks/           # 自定義 hooks
│   │   ├── stores/          # Zustand stores
│   │   ├── services/        # API 呼叫
│   │   └── utils/           # 工具函式
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── controllers/     # 業務邏輯
│   │   ├── middleware/      # JWT 驗證等
│   │   ├── prisma/          # Schema & migrations
│   │   └── utils/           # 工具函式
│   └── package.json
├── PLAN.md
└── README.md
```

---

## 核心功能

### Phase 1 - 基礎功能
- [ ] 使用者註冊 / 登入（JWT）
- [ ] 房源列表頁（搜尋、篩選）
- [ ] 房源詳情頁（圖片、地圖、說明）
- [ ] 訂房流程（選日期、確認）

### Phase 2 - 進階功能
- [ ] 房東後台（刊登、管理房源）
- [ ] 訂單管理（房客 / 房東視角）
- [ ] 評論 & 評分系統
- [ ] 收藏清單（Wishlist）

### Phase 3 - 優化
- [ ] 模擬付款流程
- [ ] 響應式設計（Mobile friendly）
- [ ] 載入骨架屏（Skeleton loading）
- [ ] 錯誤處理 & 通知系統

---

## 資料庫 Schema

### User
| 欄位 | 型別 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| name | String | 使用者名稱 |
| email | String | 唯一 |
| password | String | bcrypt hash |
| avatar | String | 頭像 URL |
| isHost | Boolean | 是否為房東 |
| createdAt | DateTime | |

### Listing（房源）
| 欄位 | 型別 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| title | String | 標題 |
| description | String | 描述 |
| price | Float | 每晚價格 |
| location | String | 地址 |
| lat | Float | 緯度 |
| lng | Float | 經度 |
| images | String[] | 圖片 URL 陣列 |
| maxGuests | Int | 最多人數 |
| category | String | 類型（海邊/山區等） |
| hostId | UUID | 關聯 User |
| createdAt | DateTime | |

### Booking（訂單）
| 欄位 | 型別 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| checkIn | DateTime | 入住日期 |
| checkOut | DateTime | 退房日期 |
| totalPrice | Float | 總價 |
| status | Enum | PENDING/CONFIRMED/CANCELLED |
| guestId | UUID | 關聯 User |
| listingId | UUID | 關聯 Listing |

### Review（評論）
| 欄位 | 型別 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| rating | Int | 1-5 分 |
| comment | String | 評論內容 |
| authorId | UUID | 關聯 User |
| listingId | UUID | 關聯 Listing |

---

## API 路由規劃

### 認證
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### 房源
```
GET    /api/listings          # 列表（支援搜尋篩選）
GET    /api/listings/:id      # 詳情
POST   /api/listings          # 新增（需登入，房東）
PUT    /api/listings/:id      # 編輯（需登入，本人）
DELETE /api/listings/:id      # 刪除（需登入，本人）
```

### 訂單
```
GET  /api/bookings            # 我的訂單
POST /api/bookings            # 新增訂單
PUT  /api/bookings/:id        # 更新狀態
```

### 評論
```
GET  /api/listings/:id/reviews
POST /api/listings/:id/reviews
```

### 收藏
```
GET    /api/favorites
POST   /api/favorites/:listingId
DELETE /api/favorites/:listingId
```

---

## 頁面規劃

| 路由 | 頁面 | 說明 |
|------|------|------|
| `/` | 首頁 | 搜尋列 + 房源列表 |
| `/listings/:id` | 房源詳情 | 圖片、地圖、訂房 |
| `/login` | 登入 | |
| `/register` | 註冊 | |
| `/bookings` | 我的訂單 | 需登入 |
| `/favorites` | 收藏清單 | 需登入 |
| `/host/listings` | 房東管理 | 需登入 + isHost |
| `/host/listings/new` | 新增房源 | 需登入 + isHost |

---

## Supabase 設定（免費雲端資料庫）

> 官網：https://supabase.com

### 步驟
1. 前往 https://supabase.com 註冊免費帳號（可用 GitHub 登入）
2. 點 **New Project**，填入專案名稱和資料庫密碼（記好密碼！）
3. 等待約 1 分鐘建立完成
4. 左側選單 → **Project Settings** → **Database**
5. 找到 **Connection string** → 選 **URI** 格式，複製整串
6. 把 `[YOUR-PASSWORD]` 替換成你剛才設定的資料庫密碼
7. 貼到 `backend/.env` 的 `DATABASE_URL`

### 連線字串格式
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

### 用 Navicat Premium Lite 連線
- Host：`db.xxxxxxxxxxxx.supabase.co`（從 Supabase 複製）
- Port：`5432`
- Database：`postgres`
- Username：`postgres`
- Password：你設定的資料庫密碼

### 設定好後執行 Migration
```bash
cd backend
npx prisma migrate dev --name init
```
這個指令會根據 `prisma/schema.prisma` 在資料庫建立所有資料表

---

## 開發順序建議

1. **後端先行**：建立 DB Schema、認證 API
2. **前端基礎**：路由、登入/註冊頁
3. **核心功能**：房源列表 + 詳情頁
4. **訂房流程**：日期選擇、訂單建立
5. **房東功能**：刊登房源
6. **收尾**：評論、收藏、UI 優化
