# 03 — Backend API Reference

> **Cập nhật lần cuối:** 2026-06-19 — Đồng bộ theo code thật (T-REV-0)  
> ⚠️ File `BACKEND_API_SPEC.md` cũ đã **outdated** — thay thế bởi file này.  
> Source of truth: `backend/src/routes/admin/`

## Thông Tin Chung

| Thuộc tính | Giá trị |
|-----------|---------|
| **Base URL** | `http://localhost:5000/api/v1` |
| **Admin prefix** | `/api/v1/admin/` |
| **Định dạng** | JSON, UTF-8 |
| **Auth** | `Authorization: Bearer <accessToken>` |
| **Đơn vị tiền** | Integer (VNĐ). VD: `80000` = 80.000 VNĐ. **1 unit = 1 VNĐ**, không chia 100 khi hiển thị. |

## Response Format Chuẩn

```json
// Thành công
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { ... }
}

// Lỗi
{
  "success": false,
  "statusCode": 400,
  "message": "Mô tả lỗi",
  "data": null
}
```

---

## Health Check

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v1/health` | Không cần |

**Response:**
```json
{ "status": "OK", "message": "Hệ thống đang hoạt động tốt!" }
```

---

## 1. Auth — `/api/v1/admin/auth`

| Method | Path | Body / Query | Mô tả |
|--------|------|-------------|-------|
| POST | `/login` | `{ email, password }` | Đăng nhập, trả về `{ token, user }` + set refresh cookie |
| POST | `/refresh-token` | — (Cookie) | Làm mới access token qua refresh token cookie |
| POST | `/logout` | — | Đăng xuất, xóa refresh token cookie |

**Login Response Data:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin",
    "full_name": "Quản Trị Viên"
  }
}
```

---

## 2. Facility (Cơ Sở) — `/api/v1/admin/facilities`

**Roles:** `admin`, `staff`

| Method | Path | Roles | Mô tả |
|--------|------|-------|-------|
| GET | `/` | admin, staff | Danh sách cơ sở (không bao gồm đã xóa mềm) |
| GET | `/trash` | admin, staff | Danh sách cơ sở đã xóa mềm |
| GET | `/:id` | admin, staff | Chi tiết một cơ sở |
| GET | `/:id/courts` | admin, staff | Danh sách sân thuộc cơ sở |
| POST | `/:id/restore` | admin, staff | Khôi phục cơ sở đã xóa mềm |
| POST | `/` | admin, staff | Tạo cơ sở mới |
| PUT | `/:id` | admin, staff | Cập nhật cơ sở |
| DELETE | `/:id` | admin, staff | Xóa mềm cơ sở (cascade xóa sân + price_configs + inventory_levels) |

**Facility object:**
```json
{
  "id": 1,
  "name": "Cơ sở Quận 7",
  "address": "123 Nguyễn Thị Thập",
  "timezone": "Asia/Ho_Chi_Minh",
  "open_time": "06:00:00",
  "close_time": "22:00:00",
  "avatar_url": "https://...",
  "cancel_policy": { ... },
  "is_active": true,
  "created_at": "2026-01-01T00:00:00.000Z"
}
```

---

## 3. Court (Sân) — `/api/v1/admin/courts`

**Roles:** `admin` only

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/` | Danh sách sân (có thể filter theo facility_id) |
| GET | `/:id` | Chi tiết sân |
| POST | `/` | Tạo sân mới |
| PUT | `/:id` | Cập nhật sân |
| DELETE | `/:id` | Xóa mềm sân |

**Court object:**
```json
{
  "id": 1,
  "facility_id": 1,
  "name": "Sân A1",
  "court_type": "badminton",
  "is_active": true
}
```

**court_type enum:** `badminton` | `tennis` | `football` | `table_tennis`

---

## 4. Booking (Đặt Sân) — `/api/v1/admin/bookings`

**Roles:** `admin`, `staff` (trừ daily-booked-slots chỉ cần verifyToken)

| Method | Path | Roles | Mô tả |
|--------|------|-------|-------|
| GET | `/` | admin, staff | Danh sách booking (filter: `?facility_id=`) |
| GET | `/daily-booked-slots` | verifyToken | Xem slot đã đặt theo ngày (filter: `?facility_id=&date=YYYY-MM-DD&court_type=`) |
| GET | `/:booking_id` | admin, staff | Chi tiết booking |
| POST | `/hotline` | admin, staff | Tạo booking qua hotline |
| PUT | `/:id/status` | admin, staff | Cập nhật trạng thái booking |
| GET | `/:booking_id/vnpay-url` | admin, staff | Tạo link thanh toán VNPay |

**Booking object:**
```json
{
  "id": 1,
  "user_id": null,
  "facility_id": 1,
  "status": "confirmed",
  "payment_status": "paid",
  "payment_method": "vnpay",
  "total_cents": 160000,
  "note": "Ghi chú",
  "checked_in_at": null,
  "cancelled_at": null,
  "cancel_reason": null,
  "slots": [
    {
      "id": 1,
      "court_id": 1,
      "start_at": "2026-06-19T09:00:00.000Z",
      "end_at": "2026-06-19T10:00:00.000Z",
      "price_cents": 80000
    }
  ]
}
```

**Booking status enum:** `pending` | `confirmed` | `cancelled` | `completed` | `no_show`  
**Payment status enum:** `unpaid` | `partial` | `paid` | `refunded`  
**Payment method enum:** `cash` | `vnpay`

---

## 5. Payment (Thanh Toán) — `/api/v1/admin/payments`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/vnpay-ipn` | Không (VNPay webhook) | Xử lý IPN từ VNPay |
| GET | `/vnpay-return` | Không | Trả HTML kết quả thanh toán cho browser |
| PATCH | `/:id/pay-cash` | verifyToken | Xác nhận thanh toán tiền mặt cho order |

**Payment object:**
```json
{
  "id": 1,
  "provider": "vnpay",
  "status": "paid",
  "amount_cents": 160000,
  "booking_id": 1,
  "order_id": null,
  "provider_ref": "VNP_TXNREF",
  "paid_at": "2026-06-19T09:05:00.000Z"
}
```

**Provider enum:** `cash` | `vnpay`  
**Status enum:** `pending` | `paid` | `failed` | `refunded`

---

## 6. Order (Đơn Hàng) — `/api/v1/admin/orders`

**Roles:** `admin`, `staff`

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/` | Tất cả đơn hàng |
| GET | `/pending-pickup` | Đơn hàng chờ nhận |
| GET | `/pending-payment` | Đơn hàng chờ thanh toán |
| POST | `/pos` | Tạo đơn POS (bán tại quầy) |
| GET | `/:id` | Chi tiết đơn hàng |
| PATCH | `/:id/confirm` | Xác nhận đơn hàng |
| PATCH | `/:id/complete` | Hoàn tất đơn hàng (đã giao) |

**Order status enum:** `pending_payment` | `pending_pickup` | `completed` | `cancelled` | `refunded` | `expired`  
**Pickup type enum:** `immediate` | `pickup_store`

---

## 7. Product (Sản Phẩm) — `/api/v1/admin/products`

| Method | Path | Roles | Mô tả |
|--------|------|-------|-------|
| GET | `/` | verifyToken | Danh sách sản phẩm |
| GET | `/search` | admin, staff | Tìm kiếm sản phẩm |
| GET | `/:id` | verifyToken | Chi tiết sản phẩm |
| POST | `/` | admin | Tạo sản phẩm |
| PUT | `/:id` | admin | Cập nhật sản phẩm |
| PATCH | `/:id/toggle-delete` | admin | Bật/tắt xóa mềm sản phẩm |
| GET | `/:id/variants` | verifyToken | Variants của sản phẩm |
| POST | `/:id/variants` | admin | Thêm variant |
| PUT | `/:id/variants/:variantId` | admin | Cập nhật variant |
| PATCH | `/:id/variants/:variantId/toggle-delete` | admin | Bật/tắt xóa mềm variant |

---

## 8. Inventory (Kho) — `/api/v1/admin/inventory`

| Method | Path | Roles | Mô tả |
|--------|------|-------|-------|
| POST | `/adjust` | admin | Điều chỉnh tồn kho |
| GET | `/facility/:facilityId` | admin, staff | Tồn kho theo cơ sở |
| GET | `/facility/:facilityId/variant/:variantId` | admin, staff | Tồn kho của một variant tại cơ sở |
| POST | `/transfer` | admin | Chuyển hàng giữa cơ sở |
| POST | `/sync` | admin | Đồng bộ tồn kho |
| GET | `/movements` | verifyToken | Log nhập/xuất kho |
| GET | `/low-stock` | verifyToken | Hàng sắp hết |

---

## 9. PriceConfig (Bảng Giá) — `/api/v1/admin/price-configs`

**Roles:** `admin` only

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/` | Danh sách cấu hình giá |
| POST | `/` | Tạo cấu hình giá |
| PUT | `/:id` | Cập nhật cấu hình giá |
| DELETE | `/:id` | Xóa cấu hình giá |

**PriceConfig object:**
```json
{
  "id": 1,
  "facility_id": 1,
  "court_type": "badminton",
  "start_time": "06:00:00",
  "end_time": "12:00:00",
  "price_per_hour": 80000
}
```

---

## 10. User & Staff — `/api/v1/admin/users`

| Method | Path | Roles | Mô tả |
|--------|------|-------|-------|
| GET | `/search-phone` | verifyToken | Tìm user theo số điện thoại (`?phone=`) |
| GET | `/` | admin | Danh sách tất cả user |
| PATCH | `/:id/status-lock` | admin | Khóa/mở khóa tài khoản |
| POST | `/staff` | admin | Tạo tài khoản nhân viên |

---

## 11. Holiday (Ngày Lễ) — `/api/v1/admin/holidays`

**Roles:** `admin` only

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/` | Danh sách ngày lễ |
| POST | `/` | Tạo ngày lễ |
| PUT | `/:id` | Cập nhật ngày lễ |
| DELETE | `/:id` | Xóa ngày lễ |

**Holiday object:**
```json
{
  "id": 1,
  "name": "Tết Nguyên Đán",
  "holiday_date": "2026-01-29",
  "surcharge_percent": 50
}
```

---

## 12. SystemConfig (Cấu Hình Hệ Thống) — `/api/v1/admin/system-configs`

**Roles:** `admin` only

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/` | Tất cả config |
| POST | `/` | Tạo config mới |
| PUT | `/:id` | Cập nhật config |
| DELETE | `/:id` | Xóa config |

**SystemConfig object:**
```json
{
  "id": 1,
  "key": "booking_advance_days",
  "value": "30",
  "description": "Số ngày tối đa đặt trước",
  "data_type": "number"
}
```

**data_type enum:** `number` | `string` | `boolean`

---

## 13. Upload — `/api/v1/upload`

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/` (dự kiến) | Upload ảnh lên Cloudinary |

---

## 14. Revenue — `/api/v1/admin/revenue`

> **Trạng thái:** ✅ **Đã triển khai**  
> Source of truth: `backend/src/routes/admin/revenue.route.ts`

### Quy Tắc Chung:
- **Phân quyền:** Chỉ `admin` được phép gọi các API này. `staff` gọi sẽ bị chặn với mã lỗi `403 Forbidden`. Không có token hợp lệ trả về `401 Unauthorized`.
- **Tính doanh thu:** Doanh thu được lấy từ các bản ghi trong bảng `payments` có `status = 'paid'`.
- **Thời gian ghi nhận:** Sử dụng trường `paid_at` để xác định ngày/tháng của doanh thu. Nếu `paid_at` bị `null`, hệ thống fallback sử dụng `created_at`.
- **Đơn vị tiền tệ:** Trường `amount_cents` là integer VNĐ (VD: `80000` = 80.000 VNĐ), không chia 100 khi hiển thị.
- **Lọc theo cơ sở (`facility_id`):** Tham số `facility_id` là optional. Nếu không truyền, hệ thống sẽ trả về số liệu của toàn hệ thống (tất cả các cơ sở). Nếu truyền vào, hệ thống chỉ tính doanh thu cho cơ sở tương ứng.

### Các Endpoints:

| Method | Path | Roles | Mô tả |
|--------|------|-------|-------|
| GET | `/summary` | admin | Lấy tổng quan doanh thu, số lượng booking và order, doanh thu theo phương thức thanh toán |
| GET | `/chart` | admin | Dữ liệu vẽ biểu đồ doanh thu theo ngày/tháng (`group_by=day` hoặc `group_by=month`) |
| GET | `/breakdown` | admin | Phân tích tỉ lệ doanh thu theo nguồn (booking/order), phương thức thanh toán, cơ sở |
| GET | `/transactions` | admin | Danh sách giao dịch doanh thu (phân trang, filter theo nguồn, phương thức thanh toán...) |

#### Chi Tiết API:

1. **GET `/api/v1/admin/revenue/summary`**
   - Query params:
     - `from` (string, YYYY-MM-DD): Ngày bắt đầu (optional)
     - `to` (string, YYYY-MM-DD): Ngày kết thúc (optional)
     - `facility_id` (number): ID cơ sở (optional)
   - Response: 200 OK, 400 Bad Request (nếu định dạng ngày sai), 404 Not Found (nếu facility_id không tồn tại).

2. **GET `/api/v1/admin/revenue/chart`**
   - Query params:
     - `from` (string, YYYY-MM-DD): Ngày bắt đầu (optional)
     - `to` (string, YYYY-MM-DD): Ngày kết thúc (optional)
     - `group_by` (string): `day` hoặc `month` (default: `day`)
     - `facility_id` (number): ID cơ sở (optional)
   - Response: 200 OK.

3. **GET `/api/v1/admin/revenue/breakdown`**
   - Query params:
     - `from` (string, YYYY-MM-DD): Ngày bắt đầu (optional)
     - `to` (string, YYYY-MM-DD): Ngày kết thúc (optional)
     - `facility_id` (number): ID cơ sở (optional)
   - Response: 200 OK.

4. **GET `/api/v1/admin/revenue/transactions`**
   - Query params:
     - `from` (string, YYYY-MM-DD): Ngày bắt đầu (optional)
     - `to` (string, YYYY-MM-DD): Ngày kết thúc (optional)
     - `facility_id` (number): ID cơ sở (optional)
     - `source` (string): `booking` hoặc `order` (optional)
     - `provider` (string): `cash` hoặc `vnpay` (optional)
     - `page` (number): Số trang (default: 1)
     - `limit` (number): Số phần tử trên trang (default: 10)
   - Response: 200 OK.

