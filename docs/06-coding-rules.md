# 06 — Coding Rules

> **Cập nhật lần cuối:** 2026-06-19 — Đồng bộ theo code thật (T-REV-0)

Tài liệu này định nghĩa các quy tắc bắt buộc khi code trong project này.  
Áp dụng cho cả AI assistant và developer.

---

## 1. Nguyên Tắc Tối Thượng

> **Source of truth là code hiện tại trong `backend/` và `web-admin/`.**  
> Không tự đoán theo docs cũ nếu docs khác code thật.  
> Không code trước khi plan được duyệt bởi project owner.

---

## 2. Quy Tắc Backend

### 2.1 Response Format

**Bắt buộc dùng `AppResponse`:**

```typescript
// Thành công
return AppResponse.success(res, data, 'Message', 200);

// Lỗi — ném error, để errorHandler xử lý
throw new AppError('Message', 400);
// hoặc
return AppResponse.error(res, 'Message', 400);
```

**Format response chuẩn:**
```json
{
  "success": true | false,
  "statusCode": 200 | 4xx | 5xx,
  "message": "...",
  "data": { ... } | null
}
```

> ⛔ Không được dùng format khác. Không được trả `{ error: { code, message } }`.

### 2.2 Route & Prefix

- Tất cả route admin phải đặt dưới: `/api/v1/admin/<domain>`
- Khai báo trong `backend/src/routes/admin/<domain>.route.ts`
- Mount trong `backend/src/routes/index.ts`

```typescript
// Ví dụ thêm module revenue
rootRouter.use('/admin/revenue', revenueRouter);
```

### 2.3 Authentication & Authorization

- Mọi route cần auth phải có middleware `verifyToken`
- Mọi route cần role phải có `requireRoles([...])`
- Revenue routes: chỉ `requireRoles(['admin'])`

```typescript
router.use(verifyToken, requireRoles(['admin']));
```

### 2.4 Validation (Zod)

- Tất cả request body phải validate qua Zod schema
- Schema đặt trong `backend/src/validations/<domain>.validation.ts`
- Dùng middleware `validate(schema)` trên route

```typescript
router.post('/', validate(createRevenueSchema), RevenueController.getSummary);
```

### 2.5 Kiến Trúc Layered

Luồng bắt buộc:
```
Route → Controller → Service → Repository → Model (Sequelize)
```

- **Controller**: Không chứa business logic. Chỉ parse request, gọi service, trả response.
- **Service**: Business logic. Gọi repository, xử lý dữ liệu.
- **Repository**: Chỉ chứa Sequelize queries. Không có logic nghiệp vụ.
- **Model**: Chỉ định nghĩa schema Sequelize. Không có method nghiệp vụ.

### 2.6 Database

- **Không** dùng `sequelize.sync({ force: true })` trên database chung
- **Không** tự ý thay đổi cấu trúc bảng của module khác
- Tên bảng: `snake_case` (VD: `booking_slots`, `price_configs`)
- Timestamps: dùng `created_at`, `updated_at` (không phải `createdAt`, `updatedAt` mặc định)
- Soft delete: hầu hết bảng dùng `paranoid: true` + `deletedAt: 'deleted_at'`

### 2.7 Đơn Vị Tiền

- Tất cả field tiền (`amount_cents`, `total_cents`, `price_cents`, `price_per_hour`) là **integer VNĐ**
- **1 unit = 1 VNĐ** (không chia 100 khi hiển thị)
- Khi tổng hợp doanh thu: `SUM(amount_cents)` trả về số VNĐ

### 2.8 Upload

- Dùng Multer + Cloudinary (đã cấu hình trong `upload.routes.ts`)
- Không commit file ảnh vào repo
- Cloudinary config trong `.env`

---

## 3. Quy Tắc Frontend

### 3.1 Cách Gọi API

```typescript
// Dùng axiosClient từ config/axios.ts — không tạo instance axios mới
import axiosClient from '../../../config/axios';
import type { ApiResponse } from '../../../types/api.type';

// Khai báo kiểu trả về
return await axiosClient.get<any, ApiResponse<T>>('/admin/endpoint');
```

### 3.2 Thêm Feature Mới

```
features/<domain>/
  components/      ← React components
  hooks/           ← Custom hooks (useQuery, useMutation)
  services/        ← API calls
  store/           ← Zustand (nếu cần)
  types/           ← TypeScript interfaces
```

Sau đó:
1. Thêm route vào `routes/index.tsx`
2. Thêm menu vào `AdminLayout.tsx`

### 3.3 UI Component

- Dùng **Ant Design v6** cho UI components
- Dùng **Tailwind CSS v4** cho layout và utility styles
- Không import từ `antd/lib/...` — dùng import trực tiếp `from 'antd'`

### 3.4 State

- Server data (API response): dùng **TanStack React Query**
- Global auth state: dùng **Zustand** (`useAuthStore`)
- Local UI state: dùng React `useState`

### 3.5 Phân Quyền UI

```typescript
const { user } = useAuthStore();
const isAdmin = user?.role === 'admin';

// Chỉ render nếu admin
{isAdmin && <RevenueMenuItem />}
```

---

## 4. Quy Tắc An Toàn

| Rule | Chi tiết |
|------|---------|
| **Không commit `.env`** | File `.env` đã có trong `.gitignore` — không xóa dòng này |
| **Không hardcode credential** | DB password, JWT secret, API key phải qua `.env` |
| **Không `force: true`** | Không dùng `sequelize.sync({ force: true })` |
| **Không đổi schema không xin phép** | Thay đổi DB schema phải plan trước |

---

## 5. Quy Tắc Phát Triển

| Rule | Chi tiết |
|------|---------|
| **Không code trước khi plan duyệt** | Mọi feature mới phải có plan và được project owner duyệt |
| **Không tự cài package** | Phải khai báo package cần cài và lý do, được duyệt trước |
| **Không commit trực tiếp** | Dùng branch + PR theo `GIT_WORKFLOW.md` |
| **Không tự đoán theo docs cũ** | Nếu docs cũ lệch code, dùng code làm source of truth |
| **Revenue chỉ admin** | Route và UI revenue phải có `requireRoles(['admin'])` và `isAdmin` check |

---

## 6. Naming Conventions

| Hạng mục | Convention | Ví dụ |
|----------|-----------|-------|
| File backend | `kebab-case.type.ts` | `booking.service.ts`, `booking.route.ts` |
| File frontend | `PascalCase.tsx` (component), `camelCase.ts` (service/hook) | `BookingPage.tsx`, `booking.service.ts` |
| DB table | `snake_case` | `booking_slots`, `price_configs` |
| DB column | `snake_case` | `facility_id`, `created_at` |
| TypeScript interface | `PascalCase` | `BookingAttributes`, `ApiResponse<T>` |
| Route path | `kebab-case` | `/admin/price-configs`, `/admin/system-configs` |
| Feature folder | `camelCase` | `priceConfig`, `systemConfig` |

---

## 7. Enum Chuẩn (Không Tự Thêm)

> Bắt buộc dùng đúng các enum đã code trong model. Không tự thêm giá trị mới khi chưa update model.

| Model | Field | Values |
|-------|-------|--------|
| User | `role` | `admin \| staff \| customer` |
| User | `membership_type` | `standard \| student \| vip` |
| Court | `court_type` | `badminton \| tennis \| football \| table_tennis` |
| Booking | `status` | `pending \| confirmed \| cancelled \| completed \| no_show` |
| Booking | `payment_status` | `unpaid \| partial \| paid \| refunded` |
| Booking | `payment_method` | `cash \| vnpay` |
| Order | `status` | `pending_payment \| pending_pickup \| completed \| cancelled \| refunded \| expired` |
| Order | `pickup_type` | `immediate \| pickup_store` |
| Payment | `provider` | `cash \| vnpay` |
| Payment | `status` | `pending \| paid \| failed \| refunded` |
| SystemConfig | `data_type` | `number \| string \| boolean` |
| InventoryMovement | `reason` | `sale \| return \| adjustment \| import \| transfer_in \| transfer_out \| sync` |
