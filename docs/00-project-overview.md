# 00 — Project Overview

> **Cập nhật lần cuối:** 2026-06-19 — Đồng bộ theo code thật (T-REV-0)

## 1. Tên Dự Án

**Hệ thống Quản lý Sân Thể Thao** (nội bộ gọi: CauLong / ThểThaoVIP)

## 2. Mục Tiêu

Xây dựng hệ thống quản lý sân cầu lông / thể thao đa năng dành cho staff và admin:

- Quản lý đặt sân (hotline, walk-in)
- Quản lý cơ sở, sân, bảng giá
- Bán hàng tại quầy (POS)
- Quản lý sản phẩm và tồn kho
- Quản lý nhân viên
- Cấu hình hệ thống và ngày lễ
- **(Sắp làm)** Trang doanh thu / Revenue Page

## 3. Scope Hiện Tại

| Thành phần | Trạng thái |
|-----------|-----------|
| **Backend API** (`backend/`) | ✅ Đang hoạt động |
| **Web Admin** (`web-admin/`) | ✅ Đang hoạt động |
| App Mobile | ❌ **Không có trong scope hiện tại** |
| Revenue Page | 🔜 Chưa làm — planned T-REV-1 → T-REV-6 |

> ⚠️ **Lưu ý:** Các tài liệu cũ (trước 2026-06-19) có đề cập "App Mobile (A1, A2)" đều là **outdated**. Project hiện tại chỉ tập trung `backend/` + `web-admin/`.

## 4. Cấu Trúc Thư Mục Gốc

```
CauLong/
  backend/          ← Node.js API (Express v5 + TypeScript + Sequelize)
  web-admin/        ← React Admin Dashboard (React 19 + Vite + Ant Design v6)
  docs/             ← Tài liệu hệ thống (thư mục này)
  package.json      ← Root (không dùng workspace)
```

## 5. Môi Trường Đang Dùng

| Biến | Giá trị mẫu |
|------|-------------|
| Backend port | `5000` |
| Frontend port | `5173` (Vite default) |
| Database | MySQL (Aiven Cloud) |
| Redis | Upstash Redis |
| Thanh toán | VNPay Sandbox + Cash |
| Upload ảnh | Cloudinary |

## 6. Liên Kết Tài Liệu Chính

| File | Nội dung |
|------|----------|
| [01-tech-stack.md](./01-tech-stack.md) | Tech stack chi tiết |
| [02-architecture.md](./02-architecture.md) | Kiến trúc hệ thống |
| [03-backend-api.md](./03-backend-api.md) | API thực tế (tất cả endpoints) |
| [04-database.md](./04-database.md) | Database schema và models |
| [04-database-schema.dbml](./04-database-schema.dbml) | DBML diagram |
| [05-frontend-structure.md](./05-frontend-structure.md) | Cấu trúc web-admin |
| [06-coding-rules.md](./06-coding-rules.md) | Quy tắc code bắt buộc |
| [07-task-roadmap.md](./07-task-roadmap.md) | Roadmap nhiệm vụ |
| [08-revenue-module-plan.md](./08-revenue-module-plan.md) | Kế hoạch Revenue Page |

## 7. Các File Docs Cũ (Outdated / Thay Thế)

| File cũ | Trạng thái | Thay thế bởi |
|---------|-----------|-------------|
| `ARCHITECTURE.md` | ⚠️ Outdated — lệch code thật | `02-architecture.md` |
| `BACKEND_API_SPEC.md` | ❌ Outdated — viết cho Mobile App | `03-backend-api.md` |
| `PROJECT_STRUCTURE.md` | ❌ Outdated — cấu trúc không tồn tại | `05-frontend-structure.md` |
| `DATA_MODEL.md` | ⚠️ Outdated — thiếu cột/bảng | `04-database.md` |
| `DATABASE_SCHEMA.dbml` | ⚠️ Outdated — thiếu bảng mới | `04-database-schema.dbml` |
| `MVP_SCOPE.md` | ⚠️ Outdated — scope thay đổi | `07-task-roadmap.md` |
| `BUSINESS_LOGIC.md` | ⚠️ Cập nhật trực tiếp trong file | — |
| `GETTING_STARTED.md` | ⚠️ Outdated — còn đề cập App Mobile | Cần update sau |
| `GIT_WORKFLOW.md` | ✅ Còn dùng | — |
| `DIVIDE.md` | ℹ️ Archive — phân công nhóm cũ | — |
| `PROBLEM_DEFINITION.md` | ✅ Còn dùng | — |
