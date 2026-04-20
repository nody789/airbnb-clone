# Airbnb Clone 全端專案

仿 Airbnb 介面的全端住宿預訂平台，使用 React + Node.js 開發。

---

## 功能列表

| 功能 | 說明 |
|------|------|
| 使用者註冊 / 登入 | JWT Token 驗證，7 天免重新登入 |
| 房源搜尋與篩選 | 依地點、類別、價格、人數篩選 |
| 房源詳情 | 圖片牆（5宮格 + 燈箱）、互動地圖、訂房 Widget |
| 訂房系統 | 日期衝突檢查、自動計算費用、服務費模擬 |
| 收藏清單 | 即時新增 / 移除收藏 |
| 我的訂單 | 查看訂單狀態、取消訂單 |
| 房東後台 | 刊登 / 編輯 / 刪除房源、管理旅客訂單 |
| 評論系統 | 星星評分（互動式）、留言 |
| 個人設定 | 修改名稱、頭像、一鍵開啟房東模式 |

---

## 技術棧與選用原因

### 前端

| 套件 | 版本 | 為什麼選它 |
|------|------|-----------|
| **React** | 18 | 業界主流 UI 函式庫，元件化開發，生態系最豐富 |
| **Vite** | 5 | 比 Create React App 快 10 倍以上的開發伺服器，HMR 即時熱更新 |
| **Tailwind CSS** | 3 | Utility-first CSS，不用寫獨立 CSS 檔，class 直接寫在 JSX，響應式設計極方便 |
| **React Router v6** | 6 | React 官方路由方案，支援巢狀路由、私有路由守衛 |
| **TanStack React Query** | 5 | 專門處理伺服器狀態（API 資料），自動快取、loading/error 管理，避免重複請求 |
| **Zustand** | 4 | 輕量全域狀態管理，比 Redux 簡單 10 倍，適合中小型專案 |
| **Axios** | 1 | 比原生 fetch 更簡潔，支援攔截器（自動帶 token）、錯誤處理更直覺 |
| **React Leaflet** | 4 | Leaflet 地圖的 React 封裝，搭配 OpenStreetMap 完全免費，不需 API Key |

### 後端

| 套件 | 版本 | 為什麼選它 |
|------|------|-----------|
| **Node.js + Express** | 5 | JavaScript 全端統一語言，Express 輕量靈活，是 Node.js 最主流的框架 |
| **Prisma ORM** | 6 | 用 JavaScript 操作資料庫，不用寫 SQL，Schema 即文件，自動產生型別 |
| **PostgreSQL** | - | 功能完整的關聯式資料庫，支援陣列型別（圖片清單）、複雜查詢 |
| **JWT (jsonwebtoken)** | 9 | 無狀態驗證，伺服器不需存 Session，適合前後端分離架構 |
| **bcryptjs** | 3 | 業界標準密碼雜湊演算法，即使資料庫外洩也無法反推密碼 |
| **cors** | 2 | 允許前端（不同 port/domain）呼叫後端 API |
| **dotenv** | 17 | 讀取 .env 設定檔，敏感資料（密碼、金鑰）不進版本控制 |
| **Cloudinary SDK** | 2 | 免費圖片雲端儲存，預留圖片上傳功能（目前使用 URL 輸入） |

### 部署（全免費）

| 服務 | 用途 |
|------|------|
| **Vercel** | 前端部署，連結 GitHub 自動 CI/CD |
| **Render** | 後端部署，免費方案（閒置 15 分鐘休眠，喚醒約 30 秒） |
| **Neon** | 免費雲端 PostgreSQL，無自動暫停，可用 Navicat Premium Lite 連線 |
| **Cloudinary** | 免費圖片儲存（25GB） |

---

## 專案架構

```
airbnb-clone/
├── frontend/                    # React 前端
│   ├── src/
│   │   ├── components/          # 共用 UI 元件
│   │   │   ├── Navbar.jsx           # 導覽列（含下拉選單）
│   │   │   ├── PrivateRoute.jsx     # 路由守衛（需登入）
│   │   │   ├── ListingCard.jsx      # 房源卡片
│   │   │   ├── SearchBar.jsx        # 搜尋列
│   │   │   ├── CategoryFilter.jsx   # 類別篩選
│   │   │   ├── detail/
│   │   │   │   ├── ImageGallery.jsx     # 圖片牆 + 燈箱
│   │   │   │   ├── BookingWidget.jsx    # 訂房框
│   │   │   │   ├── ListingMap.jsx       # Leaflet 地圖
│   │   │   │   └── ReviewSection.jsx    # 評論區
│   │   │   └── host/
│   │   │       └── CoordinatePicker.jsx # 地圖點選座標
│   │   ├── pages/               # 頁面元件
│   │   │   ├── HomePage.jsx         # 首頁（房源列表）
│   │   │   ├── ListingDetailPage.jsx # 房源詳情
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── BookingsPage.jsx     # 我的訂單
│   │   │   ├── FavoritesPage.jsx    # 收藏清單
│   │   │   ├── ProfilePage.jsx      # 個人設定
│   │   │   ├── HostListingsPage.jsx # 房東管理
│   │   │   ├── HostBookingsPage.jsx # 房東訂單管理
│   │   │   ├── NewListingPage.jsx   # 刊登房源
│   │   │   ├── EditListingPage.jsx  # 編輯房源
│   │   │   └── NotFoundPage.jsx     # 404
│   │   ├── stores/
│   │   │   └── authStore.js         # Zustand 登入狀態
│   │   └── services/
│   │       └── api.js               # 所有 Axios API 函式
│   └── package.json
│
├── backend/                     # Node.js 後端
│   ├── src/
│   │   ├── index.js             # 入口，掛載所有路由
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT 驗證 middleware
│   │   ├── routes/
│   │   │   ├── auth.js          # 認證（註冊/登入/個人設定）
│   │   │   ├── listings.js      # 房源 CRUD
│   │   │   ├── bookings.js      # 訂單（含房東管理）
│   │   │   ├── reviews.js       # 評論
│   │   │   └── favorites.js     # 收藏
│   │   └── utils/
│   │       └── prisma.js        # Prisma Client 單例
│   ├── prisma/
│   │   └── schema.prisma        # 資料庫 Schema
│   └── package.json
│
├── PLAN.md                      # 完整規劃文件（含 Supabase 設定步驟）
└── README.md
```

---

## 示範帳號

> 執行 `cd backend && npm run seed` 後可使用以下帳號登入

| 角色 | Email | 密碼 | 說明 |
|------|-------|------|------|
| 🏠 房東 | `host@demo.com` | `demo1234` | 可管理房源、查看訂單、確認/拒絕預訂 |
| 🧳 旅客 | `guest@demo.com` | `demo1234` | 可瀏覽房源、訂房、收藏、留評論 |

### 如何成為房東？

任何一般帳號都可以升級為房東，步驟如下：

1. 登入後，點右上角頭像 → **個人設定**
2. 勾選「**開啟房東模式**」並儲存
3. Navbar 選單會新增「**管理房源 / 訂單管理 / 刊登新房源**」

> 升級後就能刊登房源、設定價格、接受旅客預訂。

---

## 本機開發設定

### 前置需求
- Node.js v20.19+ 或 v22+（目前 v20.12 也可以執行，僅有警告）
- 資料庫：本機 PostgreSQL 或 [Neon](https://neon.tech) 免費帳號

### 1. Clone 專案

```bash
git clone https://github.com/你的帳號/airbnb-clone.git
cd airbnb-clone
```

### 2. 後端設定

```bash
cd backend
npm install

# 複製環境變數範本
cp .env.example .env
# 編輯 .env，填入你的 DATABASE_URL 和 JWT_SECRET
```

`.env` 範例：
```
DATABASE_URL="postgresql://[帳號]:[密碼]@[host]-pooler.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://[帳號]:[密碼]@[host].neon.tech/neondb?sslmode=require"
JWT_SECRET="任意一段複雜的字串"
PORT=5000
```

```bash
# 建立資料庫資料表
npx prisma migrate dev --name init

# 填入示範資料（可選）
npm run seed

# 啟動後端
npm run dev
```

### 3. 前端設定

```bash
cd frontend
npm install
npm run dev
```

前端執行於 `http://localhost:5173`，API 請求自動代理到後端 `http://localhost:5000`

---

## API 路由總覽

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PATCH  /api/auth/profile          ← 更新個人資料 / 開啟房東模式

GET    /api/listings               ← 支援 ?location=&category=&minPrice=&maxPrice=&guests=
GET    /api/listings/:id
POST   /api/listings               ← 需登入
PUT    /api/listings/:id           ← 需登入（本人）
DELETE /api/listings/:id           ← 需登入（本人）

GET    /api/bookings               ← 我的訂單
POST   /api/bookings               ← 建立訂單
PUT    /api/bookings/:id           ← 旅客取消
GET    /api/bookings/host          ← 房東查看訂單
PUT    /api/bookings/:id/host-action ← 房東確認/拒絕

GET    /api/listings/:id/reviews
POST   /api/listings/:id/reviews   ← 需登入

GET    /api/favorites              ← 需登入
POST   /api/favorites/:listingId   ← 需登入
DELETE /api/favorites/:listingId   ← 需登入
```
