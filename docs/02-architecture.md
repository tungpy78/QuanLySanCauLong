# 02 — Architecture

> **Cập nhật lần cuối:** 2026-06-19 — Đồng bộ theo code thật (T-REV-0)  
> ⚠️ File `ARCHITECTURE.md` cũ đã **outdated** — thay thế bởi file này.

## 1. Sơ Đồ Tổng Thể

```
┌──────────────────────────────────┐
│   Web Admin — React 19 + Vite    │
│   (web-admin/ — port 5173)       │
└────────────────┬─────────────────┘
                 │ HTTPS / JSON
                 │ Authorization: Bearer <accessToken>
                 ▼
┌──────────────────────────────────┐
│   Node.js API — Express v5       │
│   (backend/ — port 5000)         │
│   /api/v1/admin/*                │
└──────┬──────────────┬────────────┘
       ▼              ▼
┌────────────┐  ┌────────────┐  ┌──────────────────┐
│   MySQL    │  │   Redis    │  │   Cloudinary     │
│  (Aiven)   │  │ (Upstash)  │  │   (uploads)      │
└────────────┘  └────────────┘  └──────────────────┘
```

> ℹ️ Không có App Mobile trong scope hiện tại.

---

## 2. Quy Ước API

### 2.1 Base URL & Prefix

| Môi trường | URL |
|-----------|-----|
| Development | `http://localhost:5000/api/v1` |
| Production | (chưa xác định — xem `.env`) |

- Tất cả route admin: `/api/v1/admin/*`
- Health check: `GET /api/v1/health`

### 2.2 Response Format (Chuẩn duy nhất)

**Mọi response từ backend đều theo format này:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "data": null
}
```

> ⛔ Docs cũ ghi format `{ "error": { "code": "...", "message": "..." } }` là **sai** — không dùng.

### 2.3 Authentication

| Loại | Cơ chế |
|------|--------|
| **Access Token** | JWT — Header: `Authorization: Bearer <token>` |
| **Refresh Token** | JWT — Lưu trong httpOnly Cookie, gửi tự động theo request |
| **Token TTL** | Access: `JWT_EXPIRES_IN` (1d) / Refresh: 7 ngày |

**Luồng auth:**
1. `POST /api/v1/admin/auth/login` → trả về `{ token, user }` trong response + refresh token trong Cookie
2. Frontend lưu `accessToken` vào `localStorage`
3. Axios interceptor tự gắn `Authorization: Bearer <accessToken>` vào mọi request
4. Khi 401 → Axios tự gọi `POST /api/v1/admin/auth/refresh-token` (kèm Cookie) → nhận access token mới

### 2.4 Role-Based Access

Hệ thống có 3 role: `admin` | `staff` | `customer`

| Middleware | Mục đích |
|-----------|---------|
| `verifyToken` | Xác thực JWT, gắn `req.user = { id, role }` |
| `requireRoles(['admin', 'staff'])` | Kiểm tra role |

---

## 3. Kiến Trúc Backend (Layered)

```
server.ts          ← Entry: setup Express, middleware, routes, start server
  │
  └── src/
       ├── config/           ← database.ts (Sequelize), redis.ts
       ├── routes/admin/     ← Khai báo route, gắn middleware + controller
       ├── middlewares/      ← auth, role, validate, errorHandler
       ├── validations/      ← Zod schemas (validate request body)
       ├── controllers/admin/← Parse request, gọi service, trả response
       ├── services/         ← Business logic
       ├── repositories/     ← Truy vấn DB (Sequelize queries)
       ├── models/           ← Sequelize model definitions
       ├── utils/            ← AppResponse, ErrorClass, token.util, vnpay
       ├── types/            ← TypeScript interfaces/types
       ├── constants/
       ├── patterns/
       └── seeders/
```

**Luồng xử lý một request:**
```
Request → Route → Middleware(verifyToken, requireRoles, validate) → Controller → Service → Repository → DB
                                                                          ↓
Response ← AppResponse.success/error ←──────────────────────────────────
```

### 3.1 Request Validation (Zod)

```typescript
// Ví dụ: middleware validate
router.post('/', validate(createFacilitySchema), FacilityController.create);
// validate() middleware: parse body qua Zod schema → nếu lỗi throw ValidationError
```

### 3.2 Error Handling

Tất cả lỗi được bắt trong controller qua `try/catch → next(error)` → `errorHandlingMiddleware` xử lý trả về format chuẩn.

---

## 4. Kiến Trúc Frontend (Feature-based)

```
web-admin/src/
  App.tsx              ← RouterProvider
  routes/index.tsx     ← createBrowserRouter — định nghĩa toàn bộ routes
  layouts/
    AdminLayout.tsx    ← Layout chính: Sidebar + Header + <Outlet>
                          ← Auth guard: redirect /login nếu chưa đăng nhập
  features/
    auth/              ← Login, Zustand store, auth service
    booking/           ← Booking page, schedule, service
    court/             ← Quản lý sân
    facility/          ← Quản lý cơ sở
    holiday/           ← Cấu hình ngày lễ
    priceConfig/       ← Bảng giá
    product/           ← Quản lý hàng hóa
    sale/              ← POS + Đơn hàng
    staff/             ← Quản lý nhân viên
    systemConfig/      ← Cấu hình hệ thống
  config/
    axios.ts           ← Axios instance với interceptors
  components/          ← Shared components
  types/               ← Shared TypeScript types
  utils/               ← Utility functions
```

### 4.1 Cách Gọi API

```typescript
// config/axios.ts
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,   // Gửi Cookie refresh token
});

// Response interceptor: trả về response.data trực tiếp
// Request interceptor: gắn Authorization: Bearer <accessToken>
// 401 handler: tự refresh token, retry request, hoặc redirect /login
```

### 4.2 Mỗi Feature Có Cấu Trúc

```
features/example/
  components/    ← React components (Page, Modal, Form...)
  hooks/         ← Custom hooks (useQuery, useMutation...)
  services/      ← API calls (axiosClient.get/post...)
  store/         ← Zustand store (nếu cần)
  types/         ← TypeScript interfaces
```

### 4.3 Sidebar

Sidebar được hardcode trong `AdminLayout.tsx` dưới dạng `menuItems` array.  
Hiển thị/ẩn menu theo role: một số nhóm chỉ hiện với `isAdmin = user?.role === 'admin'`.

---

## 5. Luồng Dữ Liệu

### 5.1 Đặt Sân (Hotline)

```
[Staff Web] → POST /admin/bookings/hotline
  → BookingService.createBookingByHotline()
    → Check availability (BookingSlot overlap)
    → Transaction: INSERT bookings + booking_slots
    → Calculate price từ PriceConfig + Holiday surcharge
    → Create Payment record (status: pending)
  ← Return booking detail
```

### 5.2 Bán Hàng POS

```
[Staff Web] → POST /admin/orders/pos
  → OrderService.createOrder()
    → Check inventory (InventoryLevel)
    → Transaction: INSERT orders + order_items
    → UPDATE inventory_levels (trừ kho)
    → INSERT inventory_movements (log)
    → Create Payment record
  ← Return order detail
```

### 5.3 Thanh Toán VNPay

```
[Staff Web] → GET /admin/bookings/:id/vnpay-url
  → BookingService.generateVNPayUrl()
  ← Return { paymentUrl }
[Khách] → Thanh toán trên VNPay
[VNPay] → GET /admin/payments/vnpay-ipn (webhook)
  → PaymentService.processVNPayIPN()
    → UPDATE payments.status = 'paid'
    → UPDATE bookings.payment_status = 'paid'
```

---

## 6. Biến Môi Trường

### Backend (.env)

| Biến | Mô tả |
|------|-------|
| `PORT` | Port server (default: 5000) |
| `NODE_ENV` | development / production |
| `CLIENT_URL` | URL frontend (CORS whitelist) |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | MySQL config |
| `JWT_SECRET` | Ký JWT |
| `JWT_EXPIRES_IN` | TTL access token (vd: `1d`) |
| `SYNC_DB` | `true` = Sequelize sync DB khi start |
| `VNP_TMNCODE`, `VNP_HASHSECRET`, `VNP_URL`, `VNP_RETURNURL` | VNPay config |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary |
| `REDIS_URL` | Redis connection string |

### Frontend (.env)

| Biến | Mô tả |
|------|-------|
| `VITE_API_URL` | Backend base URL (vd: `http://localhost:5000/api/v1`) |
