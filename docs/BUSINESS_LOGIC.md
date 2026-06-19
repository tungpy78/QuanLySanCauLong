# BUSINESS_LOGIC.md — Quy Hoạch Nghiệp Vụ

> **Cập nhật lần cuối:** 2026-06-19 — Sửa status enum, xóa App Mobile, thêm VNPay flow (T-REV-0)

---

## 1. Phân Chia Domain

Hệ thống được chia thành 2 domain nghiệp vụ chính:

### 🔴 DOMAIN 1: Quản Lý Sân & Đặt Lịch

Backend + Frontend: `backend/` + `web-admin/src/features/booking|court|facility|priceConfig|holiday`

**Bảng sở hữu:** `facilities`, `courts`, `price_configs`, `bookings`, `booking_slots`

**Chức năng web-admin:**
- Quản lý danh sách Cơ sở & Sân (Thêm/Sửa/Xóa mềm/Khôi phục)
- Quản lý Cấu hình Giá (`price_configs` theo khung giờ và loại sân)
- Sa bàn lịch đặt sân theo ngày (schedule view)
- Tạo lịch đặt qua hotline
- Xem và cập nhật trạng thái booking
- Cấu hình ngày lễ (Holiday) với phụ thu %
- Tạo link thanh toán VNPay
- *(Sắp làm)* Trang doanh thu tiền sân

### 🔵 DOMAIN 2: Bán Hàng, Kho & Hệ Thống

Backend + Frontend: `backend/` + `web-admin/src/features/product|sale|staff|systemConfig`

**Bảng sở hữu:** `users`, `products`, `product_variants`, `inventory_levels`, `inventory_movements`, `orders`, `order_items`, `payments`

**Chức năng web-admin:**
- Quản lý sản phẩm (CRUD + variants + toggle delete)
- Quản lý kho: điều chỉnh tồn kho, chuyển kho, log nhập/xuất
- Giao diện POS bán hàng tại quầy
- Quản lý đơn hàng (xác nhận, hoàn tất)
- Quản lý tài khoản nhân viên
- Cấu hình tham số hệ thống
- Thanh toán tiền mặt tại quầy
- *(Sắp làm)* Trang doanh thu bán hàng

> ⚠️ **Không có App Mobile trong scope hiện tại.** Phần A1, A2 trong docs cũ là outdated.

---

## 2. Quyền Hạn Theo Role

| Nhóm Tính Năng | Thao tác | `admin` | `staff` |
|---------------|----------|---------|---------|
| **Tài khoản** | Tạo/Khóa tài khoản Staff | ✅ | ❌ |
| **Sân & Giá** | CRUD Cơ sở, Sân, Bảng giá | ✅ | ❌ |
| | Xem sân, tìm slot | ✅ | ✅ |
| **Booking** | Tạo booking hotline | ✅ | ✅ |
| | Cập nhật trạng thái, VNPay | ✅ | ✅ |
| | Xem danh sách booking | ✅ | ✅ |
| **Kho & POS** | Quản lý sản phẩm, nhập kho | ✅ | ❌ |
| | Bán POS, xử lý đơn | ✅ | ✅ |
| | Xem tồn kho | ✅ | ✅ |
| **Holiday** | Cấu hình ngày lễ | ✅ | ❌ |
| **SystemConfig** | Cấu hình tham số | ✅ | ❌ |
| **Doanh thu** | Xem Revenue Page | ✅ | **❌** |

---

## 3. Luồng Nghiệp Vụ Cốt Lõi

### 3.1 Luồng Đặt Sân Qua Hotline

```
[Staff/Admin Web] → POST /api/v1/admin/bookings/hotline
  {
    facility_id, date, slots: [{court_id, start_at, end_at}],
    customer_phone (optional), payment_method: "cash" | "vnpay"
  }
  
  Backend:
  1. Tìm/tạo user theo phone (nếu có)
  2. Kiểm tra overlap trong booking_slots
  3. Tính giá từ price_configs + Holiday surcharge
  4. Transaction: INSERT bookings (status: pending) + booking_slots
  5. INSERT payments (status: pending)
  6. Return booking detail

[Staff/Admin] → PUT /api/v1/admin/bookings/:id/status
  { status: "confirmed" | "cancelled" | "completed" | "no_show" }
```

### 3.2 Luồng Thanh Toán VNPay

```
[Staff/Admin Web] → GET /api/v1/admin/bookings/:id/vnpay-url
  ← { paymentUrl: "https://sandbox.vnpayment.vn/..." }

[Staff] → Gửi URL cho khách thanh toán

[Khách] → Thanh toán trên VNPay

[VNPay] → GET /api/v1/admin/payments/vnpay-ipn?vnp_*=...
  Backend:
  1. Verify HMAC signature
  2. UPDATE payments.status = 'paid', paid_at = now()
  3. UPDATE bookings.payment_status = 'paid'
  4. Return { RspCode: '00', Message: 'Confirm Success' }

[Khách] → GET /api/v1/admin/payments/vnpay-return
  ← HTML page kết quả thanh toán
```

### 3.3 Luồng Thanh Toán Tiền Mặt (Booking)

```
[Staff] → Thu tiền mặt từ khách
[Staff Web] → PUT /api/v1/admin/bookings/:id/status { payment_status: "paid" }
  Backend: UPDATE bookings.payment_status = 'paid'
```

### 3.4 Luồng Bán Hàng POS

```
[Staff Web] → POST /api/v1/admin/orders/pos
  {
    facility_id,
    payment_method: "cash" | "vnpay",
    items: [{ variant_id, quantity }]
  }
  
  Backend:
  1. Kiểm tra inventory_levels cho từng variant tại facility
  2. Transaction:
     a. INSERT orders (status: pending_payment)
     b. INSERT order_items
     c. UPDATE inventory_levels (trừ kho)
     d. INSERT inventory_movements (reason: 'sale')
     e. INSERT payments (status: pending)
  3. Return order detail

[Staff] → Thu tiền mặt → PATCH /api/v1/admin/payments/:id/pay-cash
  Backend: UPDATE payments.status = 'paid'
  → PATCH /api/v1/admin/orders/:id/confirm → complete
```

---

## 4. Quy Chuẩn Trạng Thái (Enums — theo code thật)

### Booking Status

| Value | Mô tả |
|-------|-------|
| `pending` | Vừa tạo, chờ xác nhận |
| `confirmed` | Đã xác nhận lịch |
| `cancelled` | Đã hủy |
| `completed` | Đã hoàn thành |
| `no_show` | Khách không đến |

> ⚠️ **Không có** status `checked_in` — docs cũ `BUSINESS_LOGIC.md` ghi sai.

### Booking Payment Status

| Value | Mô tả |
|-------|-------|
| `unpaid` | Chưa thanh toán |
| `partial` | Thanh toán một phần |
| `paid` | Đã thanh toán đủ |
| `refunded` | Đã hoàn tiền |

### Order Status

| Value | Mô tả |
|-------|-------|
| `pending_payment` | Chờ thanh toán |
| `pending_pickup` | Đã thanh toán, chờ nhận hàng |
| `completed` | Đã giao hàng và thanh toán |
| `cancelled` | Đã hủy |
| `refunded` | Đã hoàn tiền |
| `expired` | Hết thời hạn |

> ⚠️ **Không có** status `processing` — docs cũ `BUSINESS_LOGIC.md` ghi sai.

### Payment Provider

| Value | Mô tả |
|-------|-------|
| `cash` | Tiền mặt |
| `vnpay` | VNPay (sandbox) |

> ⚠️ **Không có** `manual_transfer`, `momo`, `sandbox` — docs cũ ghi sai.

### Payment Status

| Value | Mô tả |
|-------|-------|
| `pending` | Chờ thanh toán |
| `paid` | Đã thanh toán |
| `failed` | Thất bại |
| `refunded` | Đã hoàn tiền |

---

## 5. Quy Tắc Nghiệp Vụ Quan Trọng

### 5.1 Tính Giá Booking

```
Giá sân = SUM(booking_slots.price_cents)
price_cents của mỗi slot = price_per_hour × (duration_hours)
  → Lấy từ price_configs theo: facility_id + court_type + khung giờ
  → Nếu ngày lễ: nhân thêm (1 + surcharge_percent / 100)
```

### 5.2 Chống Double Booking

- Trước khi INSERT booking_slots: kiểm tra overlap với các slots đã có
- Nếu overlap → throw error
- Bọc trong Sequelize transaction để tránh race condition

### 5.3 Quản Lý Tồn Kho

- Mỗi sản phẩm tại mỗi cơ sở có 1 dòng trong `inventory_levels` (UNIQUE variant_id + facility_id)
- Khi bán hàng: trừ `quantity_on_hand` và ghi vào `inventory_movements`
- Khi điều chỉnh kho: ghi `inventory_movements` với reason phù hợp

### 5.4 Soft Delete Cascade

Khi xóa mềm `Facility`:
- Tự động xóa mềm tất cả `Court` thuộc facility
- Tự động xóa mềm tất cả `PriceConfig` thuộc facility
- Tự động xóa mềm tất cả `InventoryLevel` thuộc facility

Khi khôi phục `Facility`: Cascade ngược lại.

### 5.5 loyalty_points & membership_type

- Các field `loyalty_points` và `membership_type` **tồn tại** trong `users` model
- **Chưa có business logic nào** sử dụng chúng trong flow hiện tại
- Không áp dụng ưu đãi, không cộng điểm, không phân biệt tier
- Đây là field để dành cho tính năng tương lai

---

## 6. Doanh Thu — Nghiệp Vụ Dự Kiến

> ⚠️ Phần này mô tả **kế hoạch** — chưa có API thật.

Doanh thu được tính từ bảng `payments` WHERE `status = 'paid'`:
- **Doanh thu tiền sân:** `booking_id IS NOT NULL`
- **Doanh thu bán hàng:** `order_id IS NOT NULL`
- **Đơn vị:** integer VNĐ (1 unit = 1 VNĐ)
- **Phân quyền:** Chỉ `admin` xem được

Chi tiết xem [08-revenue-module-plan.md](./08-revenue-module-plan.md).
