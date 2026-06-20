# 07 — Task Roadmap

> **Cập nhật lần cuối:** 2026-06-19 — Cập nhật backend completed theo T-REV-3  
> ⚠️ File `MVP_SCOPE.md` cũ đã **outdated** (còn đề cập App Mobile) — roadmap thực tế theo file này.

## 1. Trạng Thái Hiện Tại

| Module | Backend | Frontend | Ghi chú |
|--------|---------|---------|---------|
| Auth | ✅ Hoàn thành | ✅ Hoàn thành | JWT + Refresh Token Cookie |
| Facility | ✅ Hoàn thành | ✅ Hoàn thành | CRUD + Soft delete + Restore |
| Court | ✅ Hoàn thành | ✅ Hoàn thành | CRUD |
| Booking | ✅ Hoàn thành | ✅ Hoàn thành | Hotline, Schedule, VNPay |
| PriceConfig | ✅ Hoàn thành | ✅ Hoàn thành | Bảng giá theo khung giờ |
| Payment | ✅ Hoàn thành | ✅ Tích hợp | VNPay IPN + Cash |
| Product | ✅ Hoàn thành | ✅ Hoàn thành | CRUD + Variants |
| Inventory | ✅ Hoàn thành | ✅ Tích hợp | Adjust, Transfer, Logs |
| Order (POS) | ✅ Hoàn thành | ✅ Hoàn thành | POS + Order management |
| Staff/User | ✅ Hoàn thành | ✅ Hoàn thành | CRUD nhân viên |
| Holiday | ✅ Hoàn thành | ✅ Hoàn thành | Ngày lễ + phụ thu |
| SystemConfig | ✅ Hoàn thành | ✅ Hoàn thành | Cấu hình tham số |
| **Revenue** | ✅ Hoàn thành | ❌ Chưa có | **Backend hoàn tất & đã test thủ công, chờ Frontend** |
| Dashboard | ⚠️ N/A | ⚠️ Placeholder | DashboardPage là div trống |

---

## 2. Roadmap Module Revenue

### T-REV-0: Đồng Bộ Docs Theo Code Thật

**Status: ✅ DONE (2026-06-19)**

| Task | Status | File |
|------|--------|------|
| T-REV-0.1: Tạo `00-project-overview.md` | ✅ Done | `docs/00-project-overview.md` |
| T-REV-0.2: Tạo `01-tech-stack.md` | ✅ Done | `docs/01-tech-stack.md` |
| T-REV-0.3: Tạo `02-architecture.md` | ✅ Done | `docs/02-architecture.md` |
| T-REV-0.4: Tạo `03-backend-api.md` | ✅ Done | `docs/03-backend-api.md` |
| T-REV-0.5: Tạo `04-database.md` | ✅ Done | `docs/04-database.md` |
| T-REV-0.6: Cập nhật `04-database-schema.dbml` | ✅ Done | `docs/04-database-schema.dbml` |
| T-REV-0.7: Tạo `05-frontend-structure.md` | ✅ Done | `docs/05-frontend-structure.md` |
| T-REV-0.8: Tạo `06-coding-rules.md` | ✅ Done | `docs/06-coding-rules.md` |
| T-REV-0.9: Tạo `07-task-roadmap.md` (file này) | ✅ Done | `docs/07-task-roadmap.md` |
| T-REV-0.10: Tạo `08-revenue-module-plan.md` | ✅ Done | `docs/08-revenue-module-plan.md` |
| T-REV-0.11: Cập nhật `BUSINESS_LOGIC.md` | ✅ Done | `docs/BUSINESS_LOGIC.md` |

---

### T-REV-1: Thiết Kế Revenue API

**Status: ✅ DONE (2026-06-19)**

Mục tiêu:
- Xác định query SQL/Sequelize cần thiết
- Thiết kế request params và response format đầy đủ
- Ghi vào `08-revenue-module-plan.md`
- Trình plan cho project owner duyệt trước khi code

Deliverable: Plan được duyệt, `08-revenue-module-plan.md` update chi tiết API design.

---

### T-REV-2: Code Revenue Backend API

**Status: ✅ DONE (2026-06-19)**

Tasks:
- [x] Tạo `backend/src/repositories/revenue.repository.ts`
- [x] Tạo `backend/src/services/revenue.service.ts`
- [x] Tạo `backend/src/controllers/admin/revenue.controller.ts`
- [x] Tạo `backend/src/routes/admin/revenue.route.ts`
- [x] Mount vào `backend/src/routes/index.ts`
- [x] Cập nhật `03-backend-api.md` với Revenue endpoints

---

### T-REV-3: Test Revenue Backend API

**Status: ✅ DONE (2026-06-19 — Manual tested)**

Tasks:
- [x] Test thủ công với Postman / Thunder Client / curl
- [x] Kiểm tra dữ liệu trả về đúng với data thật trong DB
- [x] Kiểm tra phân quyền (staff không xem được)
- [x] Kiểm tra edge case: không có dữ liệu, date range rỗng

---

### T-REV-4: Code Revenue Page (web-admin)

**Status: 🔜 NEXT (Chờ code Frontend)**

Tasks:
- [ ] Tạo `web-admin/src/features/revenue/` structure
- [ ] `revenue.types.ts` — TypeScript interfaces
- [ ] `revenue.service.ts` — API calls
- [ ] `RevenueFilterBar.tsx` — Date range + facility filter
- [ ] `RevenueSummaryCards.tsx` — Summary cards
- [ ] `RevenueChart.tsx` — Chart (library TBD ở T-REV-1)
- [ ] `RevenueTable.tsx` — Transaction table
- [ ] `RevenuePage.tsx` — Assembly
- [ ] Thêm route `/revenue` vào `routes/index.tsx`
- [ ] Thêm menu item vào `AdminLayout.tsx` (chỉ admin)

---

### T-REV-5: Test UI + Integration

**Status: 🔜 Chờ sau T-REV-4**

Tasks:
- [ ] Test filter date range
- [ ] Test filter theo facility
- [ ] Test chart render đúng dữ liệu
- [ ] Test phân quyền: staff không thấy menu Revenue
- [ ] Test responsive trên màn hình nhỏ hơn

---

### T-REV-6: Update Docs + Commit

**Status: 🔜 Chờ sau T-REV-5**

Tasks:
- [ ] Update `03-backend-api.md` với Revenue endpoints hoàn chỉnh
- [ ] Update `05-frontend-structure.md` với feature revenue
- [ ] Update `08-revenue-module-plan.md` status → Done
- [ ] Update file này (T-REV-0 → T-REV-6 status)
- [ ] Git commit theo `GIT_WORKFLOW.md`

---

## 3. Backlog Dài Hạn (Sau Revenue)

| Task | Mô tả | Priority |
|------|-------|---------|
| Dashboard thật | Thay placeholder bằng summary stats thực tế | High |
| loyalty_points | Business logic tích điểm khi booking/order | Medium |
| membership_type | Logic ưu đãi theo loại thành viên | Medium |
| CourtType | Tích hợp đúng với `courts` relation | Low |
| GETTING_STARTED.md | Cập nhật hướng dẫn bỏ App Mobile | Medium |

---

## 4. Quy Tắc Cập Nhật Roadmap

- Cập nhật status task sau mỗi phase hoàn thành
- Thêm task mới vào Backlog nếu phát sinh trong quá trình code
- Không xóa task đã hoàn thành — giữ lịch sử
- Ngày hoàn thành ghi theo format `(YYYY-MM-DD)`
