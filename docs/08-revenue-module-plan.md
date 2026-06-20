# 08 — Revenue Module Plan

> **Cập nhật lần cuối:** 2026-06-19 — Cập nhật backend completed theo T-REV-3  
> **Trạng thái module:** ⚠️ Đang phát triển (Backend hoàn thành & đã test thủ công, chờ làm Frontend)

## 1. Tổng Quan

**Mục tiêu:** Xây dựng trang Doanh Thu (Revenue Page) trong `web-admin` cho phép admin xem thống kê doanh thu từ đặt sân và bán hàng.

**Phạm vi:**
- Chỉ `admin` được truy cập — `staff` không xem được
- Dữ liệu tổng hợp từ `payments` table (kết hợp với `bookings`, `orders`, `facilities`)
- Không cần thêm bảng mới — query từ data sẵn có

---

## 2. Trạng Thái Hiện Tại

| Hạng mục | Trạng thái |
|---------|-----------|
| Backend API | ✅ Hoàn thành (Đã test thủ công) |
| Frontend Feature | ❌ Chưa bắt đầu |
| Route `/api/v1/admin/revenue/*` | ✅ Đã triển khai |
| Route `/revenue` trên web-admin | ❌ Chưa có |
| Menu item "Doanh thu" | ❌ Chưa có |
| Chart library | ❌ Chưa cài |

### Tiến độ các Task:
- **T-REV-1:** completed
- **T-REV-2:** completed
- **T-REV-3:** backend manual API test completed
- **T-REV-4:** pending frontend Revenue Page

---

## 3. Nguồn Dữ Liệu

Doanh thu được tổng hợp từ bảng `payments` với `status = 'paid'`:

```sql
-- Doanh thu tiền sân:
SELECT SUM(p.amount_cents), ...
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE p.status = 'paid'
  AND p.booking_id IS NOT NULL
  AND DATE(p.paid_at) BETWEEN :from AND :to

-- Doanh thu bán hàng:
SELECT SUM(p.amount_cents), ...
FROM payments p
JOIN orders o ON p.order_id = o.id
WHERE p.status = 'paid'
  AND p.order_id IS NOT NULL
  AND DATE(p.paid_at) BETWEEN :from AND :to
```

**Lưu ý đơn vị tiền:** `amount_cents` là integer VNĐ (1 unit = 1 VNĐ), **không chia 100** khi hiển thị.

---

## 4. Backend APIs Đã Triển Khai (T-REV-2 & T-REV-3: completed)

> ✅ Tất cả API sau đây đã được triển khai thành công và kiểm thử thủ công đạt kết quả tốt.

### Base: `/api/v1/admin/revenue`

**Phân quyền:** Tất cả revenue routes yêu cầu `verifyToken + requireRoles(['admin'])`.

---

### 4.1 GET `/api/v1/admin/revenue/summary`

**Mô tả:** Lấy tổng quan doanh thu theo khoảng thời gian.

**Query params:**
```
from        string   YYYY-MM-DD   Ngày bắt đầu (required)
to          string   YYYY-MM-DD   Ngày kết thúc (required)
facility_id number   optional     Filter theo cơ sở
```

**Response data (dự kiến):**
```json
{
  "total_revenue_cents": 5600000,
  "booking_revenue_cents": 4000000,
  "order_revenue_cents": 1600000,
  "total_bookings_completed": 25,
  "total_orders_completed": 12,
  "cash_revenue_cents": 3200000,
  "vnpay_revenue_cents": 2400000
}
```

---

### 4.2 GET `/api/v1/admin/revenue/chart`

**Mô tả:** Doanh thu theo ngày hoặc tháng để vẽ chart.

**Query params:**
```
from        string   YYYY-MM-DD   Ngày bắt đầu (required)
to          string   YYYY-MM-DD   Ngày kết thúc (required)
group_by    string   day | month  Nhóm theo ngày hoặc tháng (default: day)
facility_id number   optional     Filter theo cơ sở
```

**Response data (dự kiến):**
```json
[
  {
    "date": "2026-06-01",
    "booking_revenue_cents": 800000,
    "order_revenue_cents": 200000,
    "total_revenue_cents": 1000000
  },
  {
    "date": "2026-06-02",
    ...
  }
]
```

---

### 4.3 GET `/api/v1/admin/revenue/breakdown`

**Mô tả:** Phân tích doanh thu theo loại (tiền sân vs bán hàng) và phương thức thanh toán.

**Query params:**
```
from        string   YYYY-MM-DD   (required)
to          string   YYYY-MM-DD   (required)
facility_id number   optional
```

**Response data (dự kiến):**
```json
{
  "by_type": {
    "booking": 4000000,
    "order": 1600000
  },
  "by_payment_method": {
    "cash": 3200000,
    "vnpay": 2400000
  },
  "by_facility": [
    { "facility_id": 1, "facility_name": "Cơ sở Quận 7", "revenue_cents": 3500000 },
    { "facility_id": 2, "facility_name": "Cơ sở Quận 3", "revenue_cents": 2100000 }
  ]
}
```

---

### 4.4 GET `/api/v1/admin/revenue/transactions`

**Mô tả:** Danh sách các giao dịch đã thanh toán (có phân trang).

**Query params:**
```
from        string   YYYY-MM-DD   (required)
to          string   YYYY-MM-DD   (required)
facility_id number   optional
type        string   booking | order | all  (default: all)
provider    string   cash | vnpay | all     (default: all)
page        number   (default: 1)
limit       number   (default: 20)
```

**Response data (dự kiến):**
```json
{
  "total": 37,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": 123,
      "type": "booking",
      "ref_id": 45,
      "provider": "vnpay",
      "amount_cents": 160000,
      "paid_at": "2026-06-15T14:30:00.000Z",
      "facility_name": "Cơ sở Quận 7"
    }
  ]
}
```

---

## 5. Frontend Plan (Chưa Code — T-REV-4)

### Cấu Trúc Feature

```
web-admin/src/features/revenue/
  components/
    RevenuePage.tsx          ← Trang chính, assembly tất cả components
    RevenueFilterBar.tsx     ← Date range picker + Facility select
    RevenueSummaryCards.tsx  ← 4 summary cards
    RevenueChart.tsx         ← Line/Bar chart theo ngày hoặc tháng
    RevenueBreakdown.tsx     ← Pie chart: tiền sân vs bán hàng
    RevenueTable.tsx         ← Bảng giao dịch với pagination
  hooks/
    useRevenueQuery.ts       ← useQuery wrapper cho revenue APIs
  services/
    revenue.service.ts       ← API calls
  types/
    revenue.types.ts         ← TypeScript interfaces
```

### Route

```typescript
// routes/index.tsx
{ path: 'revenue', element: <RevenuePage /> }
```

### Menu (AdminLayout)

```typescript
// Chỉ hiện với isAdmin
...(isAdmin ? [{
  key: '/revenue',
  icon: <BarChartOutlined />,
  label: 'Doanh thu'
}] : [])
```

### UI Components Dự Kiến

```
RevenuePage
├── RevenueFilterBar
│   ├── DateRangePicker (from/to)
│   └── Select: Cơ sở (All / từng facility)
│
├── RevenueSummaryCards (4 cards)
│   ├── Card 1: Tổng doanh thu (trong khoảng filter)
│   ├── Card 2: Doanh thu tiền sân
│   ├── Card 3: Doanh thu bán hàng
│   └── Card 4: Số booking + đơn hàng hoàn thành
│
├── RevenueChart
│   ├── Toggle: Theo ngày / Theo tháng
│   └── Line chart / Bar chart
│
├── RevenueBreakdown
│   └── Pie chart: Tiền sân vs Bán hàng vs Cash vs VNPay
│
└── RevenueTable
    ├── Filter: Tất cả / Booking / Order
    ├── Filter: Cash / VNPay / Tất cả
    └── Table: ID, Loại, Số tiền, Phương thức, Ngày, Cơ sở
```

---

## 6. Chart Library (TBD)

> ⚠️ **Chưa chọn và chưa cài chart library.** Sẽ quyết định ở T-REV-1.

Các lựa chọn đang xem xét:
- **Ant Design Charts** (`@ant-design/charts`) — tích hợp tốt với antd v6
- **Recharts** — nhẹ, React-native
- **ECharts** (`echarts-for-react`) — tính năng nhiều

**Quy tắc:** Không tự cài chart library trong phase docs (T-REV-0). Phải plan và được duyệt.

---

## 7. Các Điểm Cần Xác Nhận ở T-REV-1

Trước khi code, cần quyết định:

1. **Chart library** — chọn tool nào?
2. **Default date range** — mặc định filter ngày nào? (hôm nay, 7 ngày qua, tháng này?)
3. **Phân trang** — transaction table phân trang hay load all?
4. **Export** — có cần export CSV/Excel không?
5. **Real-time** — có cần auto-refresh không?

---

## 8. Tiêu Chí Hoàn Thành (T-REV-5)

- [ ] Admin login → thấy menu "Doanh thu"
- [ ] Staff login → không thấy menu "Doanh thu"
- [ ] Filter date range hoạt động đúng
- [ ] Summary cards hiển thị đúng số liệu
- [ ] Chart render đúng theo ngày/tháng
- [ ] Table phân trang, filter đúng
- [ ] Số tiền hiển thị đơn vị VNĐ rõ ràng (format: 1.600.000 VNĐ)
- [ ] Responsive trên màn hình desktop (không cần mobile)
