# 05 — Frontend Structure (web-admin)

> **Cập nhật lần cuối:** 2026-06-19 — Đồng bộ theo code thật (T-REV-0)  
> ⚠️ File `PROJECT_STRUCTURE.md` cũ đã **outdated** — thay thế bởi file này.  
> Source of truth: `web-admin/src/`

## 1. Cấu Trúc Thư Mục

```
web-admin/
  index.html
  vite.config.ts
  tsconfig.json
  package.json
  src/
    App.tsx               ← Entry: chỉ render <RouterProvider router={router} />
    main.tsx              ← Mount React app vào DOM
    App.css
    index.css

    assets/               ← Static assets (ảnh, svg...)
    components/           ← Shared UI components dùng lại nhiều nơi
    config/
      axios.ts            ← Axios instance với interceptors (auth, refresh token, error)
    features/             ← Mỗi module nghiệp vụ là một feature
    layouts/
      AdminLayout.tsx     ← Layout chính (Sidebar + Header + Outlet + Auth Guard)
    routes/
      index.tsx           ← createBrowserRouter — tất cả routes
    types/                ← TypeScript interfaces dùng chung
    utils/                ← Utility functions
```

---

## 2. Features Hiện Có

| Feature | Đường dẫn | Mô tả |
|---------|-----------|-------|
| `auth` | `/login` | Đăng nhập, Zustand auth store |
| `booking` | `/booking/schedule`, `/booking/list` | Sa bàn lịch sân + danh sách booking |
| `court` | `/facility/courts` | Quản lý sân |
| `facility` | `/facility/branches` | Quản lý cơ sở |
| `holiday` | `/holidays` | Cấu hình ngày lễ |
| `priceConfig` | `/pricing` | Bảng giá theo khung giờ |
| `product` | `/products` | Quản lý sản phẩm + variants |
| `sale` | `/employee/pos`, `/employee/orders` | POS bán hàng + đơn hàng |
| `staff` | `/staff` | Quản lý nhân viên |
| `systemConfig` | `/system-configs` | Cấu hình tham số hệ thống |
| **`revenue`** | `/revenue` (dự kiến) | **❌ Chưa có** |

---

## 3. Cấu Trúc Mỗi Feature

Mọi feature tuân theo pattern chuẩn:

```
features/example/
  components/       ← React components (ExamplePage.tsx, ExampleModal.tsx...)
  hooks/            ← Custom hooks (useExampleQuery, useExampleMutation...)
  services/         ← API calls (example.service.ts hoặc example.api.ts)
  store/            ← Zustand store nếu cần (example.store.ts)
  types/            ← TypeScript interfaces (example.types.ts)
```

**Ví dụ feature booking:**
```
features/booking/
  components/
    BookingPage.tsx         ← Trang danh sách booking (table)
    BookingSchedulePage.tsx ← Sa bàn lịch sân
  hooks/
    (...)
  services/
    booking.service.ts      ← getAllBookings, updateBooking, createBooking...
  store/
    (...)
  types/
    booking.types.ts        ← Booking, CreateBookingPayload, DailySlotGridResponse...
```

---

## 4. Routing

File: `src/routes/index.tsx`

```typescript
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AdminLayout />,      // ← Auth guard ở đây
    children: [
      { index: true, element: <DashboardPage /> },   // ⚠️ Hiện là placeholder

      // Booking
      { path: 'booking/schedule', element: <BookingSchedulePage /> },
      { path: 'booking/list',     element: <BookingPage /> },

      // Facility
      { path: 'facility/branches', element: <FacilityPage /> },
      { path: 'facility/courts',   element: <CourtPage /> },

      // POS & Orders
      { path: 'employee/pos',    element: <PosPage /> },
      { path: 'employee/orders', element: <OrderPage /> },

      // Others
      { path: 'pricing',         element: <PriceConfigPage /> },
      { path: 'holidays',        element: <HolidayPage /> },
      { path: 'system-configs',  element: <SystemConfigPage /> },
      { path: 'products',        element: <ProductTable /> },
      { path: 'staff',           element: <StaffPage /> },

      // ❌ Chưa có: { path: 'revenue', element: <RevenuePage /> },
    ],
  },
]);
```

> ⚠️ `DashboardPage` tại `/` hiện là **placeholder** (chỉ là `<div>`). Kế hoạch: Revenue Page sẽ thay thế hoặc trở thành route `/revenue` riêng.

---

## 5. Auth Guard (AdminLayout)

```typescript
// layouts/AdminLayout.tsx
const { user, isAuthenticated, logout } = useAuthStore();

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

- Dùng Zustand store (`auth.store.ts`) — đọc từ `localStorage`
- Nếu `accessToken` không có trong localStorage → redirect `/login`

---

## 6. Axios Client

File: `src/config/axios.ts`

```typescript
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,   // Gửi Cookie refresh token
  timeout: 30000,
});
```

**Request interceptor:** Gắn `Authorization: Bearer <accessToken>` từ localStorage vào mọi request.

**Response interceptor:**
- Trả về `response.data` trực tiếp (không phải raw Axios response)
- Khi 401 → tự gọi refresh token → retry request → hoặc redirect `/login`

**Cách dùng trong service:**
```typescript
// Ví dụ features/booking/services/booking.service.ts
import axiosClient from '../../../config/axios';
import type { ApiResponse } from '../../../types/api.type';

export const BookingService = {
  getAllBookings: async (params?: any) => {
    return await axiosClient.get<any, ApiResponse<Booking[]>>('/admin/bookings', { params });
  },
};
```

---

## 7. State Management

| Dùng cho | Tool |
|---------|------|
| Auth state (user, isAuthenticated) | **Zustand** (`features/auth/store/auth.store.ts`) |
| Server data (API calls) | **TanStack React Query** (useQuery, useMutation) |
| Local UI state | React `useState` / `useReducer` |

---

## 8. UI Library & Styling

| Hạng mục | Chi tiết |
|----------|---------|
| **UI Component** | Ant Design v6 (`antd`) |
| **Icons** | `@ant-design/icons` |
| **CSS** | Tailwind CSS v4 (plugin Vite, không cần `tailwind.config.js`) |
| **Kết hợp** | Dùng `className` Tailwind cho layout, dùng Ant Design cho components |

---

## 9. Sidebar Menu

Sidebar được **hardcode** trong `AdminLayout.tsx` dưới dạng `menuItems` array.

```typescript
const menuItems = [
  { key: '/',           icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: '/booking',    icon: <CalendarOutlined />,  label: 'Quản lý Đặt Sân',
    children: [
      { key: '/booking/schedule', label: 'Sa bàn lịch sân' },
      { key: '/booking/list',     label: 'Danh sách đơn hàng' },
    ]
  },
  // ... (chỉ admin thấy: facility-management, settings)
  { key: '/products', label: 'Hàng hóa & Kho' },
  { key: '/staff',    label: 'Nhân viên' },
];
```

**Phân quyền menu:**
- Nhóm "Cơ sở & Sân" và "Cài đặt hệ thống" chỉ hiện khi `isAdmin = user?.role === 'admin'`.
- Khi thêm Revenue Page, cần thêm entry vào `menuItems` và chỉ hiện cho `admin`.

---

## 10. Thêm Feature Mới (Pattern)

Khi thêm một feature mới (ví dụ `revenue`):

1. **Tạo thư mục** `src/features/revenue/`
2. **Tạo cấu trúc** `components/`, `hooks/`, `services/`, `types/`
3. **Tạo service** gọi API (`revenue.service.ts`)
4. **Tạo types** TypeScript (`revenue.types.ts`)
5. **Tạo page** chính (`RevenuePage.tsx`)
6. **Thêm route** vào `routes/index.tsx`
7. **Thêm menu** vào `AdminLayout.tsx`

---

## 11. Ghi Chú Quan Trọng

> ⛔ Docs cũ `PROJECT_STRUCTURE.md` mô tả cấu trúc `src/modules/{auth, users, facilities...}` — **không tồn tại trong code thực**.  
> ⛔ Docs cũ đề cập `apps/web/`, `apps/mobile/`, `packages/shared-types/` — **không tồn tại**.  
> ✅ Cấu trúc thực tế: `web-admin/src/features/{feature}/...` như mô tả ở trên.
