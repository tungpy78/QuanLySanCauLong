# 01 — Tech Stack

> **Cập nhật lần cuối:** 2026-06-19 — Đồng bộ theo code thật (T-REV-0)  
> **Source of truth:** `backend/package.json`, `web-admin/package.json`

## 1. Backend

| Hạng mục | Công nghệ | Phiên bản | Ghi chú |
|----------|-----------|-----------|---------|
| **Runtime** | Node.js | 20+ LTS | |
| **Framework** | Express | ^5.2.1 | Dùng Express v5, không phải Fastify |
| **Ngôn ngữ** | TypeScript | ^6.0.2 | |
| **Dev runner** | tsx + nodemon | tsx ^4.21.0 | Chạy TS trực tiếp không build |
| **ORM** | Sequelize | ^6.37.8 | |
| **Driver DB** | mysql2 | ^3.22.0 | |
| **Cache** | redis | ^6.0.0 | Upstash Redis (rediss://) |
| **Validation** | Zod | ^4.3.6 | Schema validation cho request body |
| **Auth** | jsonwebtoken | ^9.0.3 | JWT Bearer access token |
| **Password** | bcryptjs | ^3.0.3 | |
| **Cookie** | cookie-parser | ^1.4.7 | Refresh token trong httpOnly cookie |
| **CORS** | cors | ^2.8.6 | |
| **Security** | helmet | ^8.1.0 | HTTP security headers |
| **Logger** | morgan | ^1.10.1 | Dev logging |
| **Upload** | multer + multer-storage-cloudinary | ^2.1.1 + ^4.0.0 | Upload ảnh |
| **Cloud storage** | cloudinary | ^1.41.3 | |
| **Payment** | VNPay (custom util) + Cash | — | Sandbox + tiền mặt |
| **Date** | dayjs + moment | ^1.11.20 + ^2.30.1 | |
| **Package manager** | pnpm | — | `pnpm-lock.yaml` trong thư mục |

### Scripts Backend

```bash
npm run dev    # nodemon --watch src --watch server.ts --ext ts --exec tsx server.ts
npm run seed   # tsx src/seeders/init.seeder.ts
npm run build  # tsc
npm start      # node dist/server.js
```

---

## 2. Frontend (web-admin)

| Hạng mục | Công nghệ | Phiên bản | Ghi chú |
|----------|-----------|-----------|---------|
| **Framework** | React | ^19.2.5 | React 19 |
| **Build tool** | Vite | ^8.0.9 | |
| **Ngôn ngữ** | TypeScript | ~6.0.2 | |
| **UI Library** | Ant Design (antd) | ^6.3.6 | **Dùng antd v6**, không phải v5 |
| **Icons** | @ant-design/icons | ^6.1.1 | |
| **CSS** | Tailwind CSS | ^4.2.2 | Tailwind v4 (plugin Vite) |
| **Routing** | React Router DOM | ^7.14.1 | createBrowserRouter |
| **State** | Zustand | ^5.0.12 | Auth store |
| **Data fetching** | @tanstack/react-query | ^5.99.2 | |
| **HTTP Client** | axios | ^1.15.1 | Custom axiosClient |
| **Date** | dayjs | ^1.11.20 | |
| **QR Code** | qrcode.react + react-qr-code | — | |
| **3D** | three.js + @react-three/fiber + @react-three/drei | — | |
| **Package manager** | pnpm | — | |

### Scripts Frontend

```bash
npm run dev      # vite
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # vite preview
```

---

## 3. Database & Infrastructure

| Hạng mục | Chi tiết |
|----------|---------|
| **Database** | MySQL 8+ |
| **Cache** | Redis (Upstash, protocol: `rediss://`) |
| **Storage** | Cloudinary (ảnh sản phẩm, cơ sở) |
| **Payment gateway** | VNPay (sandbox) |
| **DB management** | Sequelize sync (SYNC_DB=true trong .env) |

---

## 4. Package Manager

Cả `backend/` và `web-admin/` đều dùng **pnpm** (có `pnpm-lock.yaml`).  
Root `package.json` ở `CauLong/` không có workspace config.

---

## 5. Không Dùng

> ⚠️ Các công nghệ **không** được dùng trong project (tránh nhầm lẫn với docs cũ):

- ~~Fastify~~ → Chỉ dùng Express
- ~~Drizzle / Knex / TypeORM~~ → Chỉ dùng Sequelize
- ~~Expo / React Native~~ → Không có App Mobile
- ~~antd v5~~ → Dùng antd v6
- ~~Tailwind v3~~ → Dùng Tailwind v4
- ~~Session auth~~ → Chỉ dùng JWT + Refresh Token Cookie
