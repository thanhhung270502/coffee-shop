# Coffee Shop — Implementation Plan

> Kế hoạch xây dựng hệ thống quán cà phê: **Admin → Customer → Staff (POS)**  
> Cập nhật lần cuối: 2026-07-08

---

## Tổng quan

| Thông tin | Chi tiết |
|-----------|----------|
| **Mục tiêu** | Nền tảng quản lý quán cafe: Admin quản trị, Customer đặt hàng online, Staff bán tại quầy (POS) |
| **Thứ tự build** | 1. Admin → 2. Customer → 3. Staff (POS) |
| **Stack** | Next.js 16, React 19, Prisma, PostgreSQL (Neon), Tailwind CSS, TanStack Query, Zod |
| **Trạng thái hiện tại** | ✅ Auth cơ bản (`User`, `Session`), API login/register/logout/me |

### Ba vai trò hệ thống

| Vai trò | Route prefix | Mô tả |
|---------|--------------|-------|
| **Admin** | `/admin` | Quản lý menu, sản phẩm, đơn hàng, nhân viên, báo cáo |
| **Customer** | `/` (public) | Đặt nước online + mua sản phẩm đóng gói |
| **Staff (POS)** | `/pos` | Nhân viên quầy: order nước, thu tiền, xử lý đơn online |

### Hai loại sản phẩm Customer

| Loại | `ProductType` | Ví dụ |
|------|---------------|-------|
| Đồ uống | `DRINK` | Cà phê sữa đá, trà sữa — có size, topping, tùy chọn |
| Đóng gói | `PACKAGED` | Cà phê hạt, trà túi — có SKU, tồn kho |

### Hai loại đơn hàng

| Loại | `OrderType` | Kênh | Xử lý bởi |
|------|-------------|------|-----------|
| Đặt nước | `DRINK_ORDER` | `ONLINE` / `POS` | Barista / POS |
| Mua hàng | `PRODUCT_ORDER` | `ONLINE` | Admin / kho |

---

## Cách tracking tiến độ

- `[ ]` Chưa bắt đầu
- `[~]` Đang làm
- `[x]` Hoàn thành
- `[–]` Bỏ qua / defer

**Cập nhật file này** mỗi khi hoàn thành task — đổi `[ ]` → `[x]` và ghi ngày vào cột Notes nếu cần.

### Tổng tiến độ

| Phase | Tên | Trạng thái | Tiến độ |
|-------|-----|------------|---------|
| 0 | Foundation | `[x]` | 8/8 |
| 1 | Admin | `[x]` | 32/32 |
| 2 | Customer | `[ ]` | 0/28 |
| 3 | Staff (POS) | `[ ]` | 0/24 |
| 4 | Polish & Launch | `[ ]` | 0/12 |

---

## Phase 0 — Foundation

**Mục tiêu:** Chuẩn bị nền tảng dùng chung cho cả 3 module.  
**Ước tính:** 3–5 ngày  
**Phụ thuộc:** Auth hiện có

### 0.1 Database & Schema cơ bản

- [x] Thêm `Role` enum: `ADMIN`, `STAFF`, `CUSTOMER`
- [x] Mở rộng model `User`: `role`, `phone`, `isActive`
- [x] Thêm enums: `ProductType`, `OrderType`, `OrderChannel`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `FulfillmentType`
- [x] Tạo models: `Category`, `Product`, `ProductVariant`, `Topping`, `ProductTopping`, `ProductSku`
- [x] Tạo models: `Order`, `OrderItem`, `OrderItemTopping`
- [x] Chạy migration + `prisma generate`
- [x] Tạo seed script: 1 admin, 1 staff, categories + products mẫu

**Files cần tạo/sửa:**

```
prisma/schema.prisma
prisma/seed.ts
package.json          # thêm script db:seed
```

### 0.2 Auth & RBAC

- [x] Cập nhật `PublicUser` + `toPublicUser` — trả về `role`
- [x] Tạo `requireAuth()` / `requireRole(roles[])` helper cho API routes
- [x] Tạo layout guard cho `/admin/*` (ADMIN only) — dùng Server Component, không middleware
- [x] Tạo layout guard cho `/pos/*` (ADMIN + STAFF) — chuẩn bị sẵn, dùng ở Phase 3
- [x] Cập nhật register: mặc định `CUSTOMER`; tạo staff chỉ qua admin

**Files:**

```
src/libs/auth/session.ts
src/libs/auth/guards.ts
src/libs/auth/role-home.ts
src/app/(admin)/admin/layout.tsx
src/app/(pos)/pos/layout.tsx
```

### 0.3 Cấu trúc thư mục & shared

- [x] Tạo route groups: `(admin)`, `(customer)`, `(pos)`
- [x] Setup TanStack Query provider trong root layout
- [x] Tạo `src/modules/` skeleton: `admin`, `customer`, `pos`
- [x] Shared UI primitives cơ bản: Button, Input, Badge, Card, Table, Dialog
- [x] Utility format tiền VND: `formatCurrency(35000)` → `35.000₫`

**Files:**

```
src/app/(admin)/admin/layout.tsx
src/app/(customer)/layout.tsx
src/app/(pos)/pos/layout.tsx
src/modules/
common/models/auth/
src/shared/components/
src/shared/providers/query-provider.tsx
src/shared/mutations/
src/shared/queries/
src/shared/utils/currency.util.ts
```

### ✅ Definition of Done — Phase 0

- [x] Migration chạy thành công, seed có data mẫu
- [x] Login admin → truy cập `/admin` OK; customer → bị chặn
- [x] Prisma client generate không lỗi
- [x] `npm run check-types` pass

---

## Phase 1 — Admin

**Mục tiêu:** Admin quản lý toàn bộ menu, sản phẩm, đơn hàng, nhân viên.  
**Ước tính:** 2–3 tuần  
**Phụ thuộc:** Phase 0

### 1.1 Admin Shell & Navigation

- [x] Layout admin: sidebar + header + breadcrumb
- [x] Navigation: Dashboard, Danh mục, Đồ uống, Sản phẩm, Đơn hàng, Nhân viên, Cài đặt
- [x] Trang Dashboard skeleton (placeholder cards)
- [x] Responsive: sidebar collapse trên tablet

**Routes:**

```
/admin                  → Dashboard
/admin/categories       → Quản lý danh mục
/admin/drinks           → Quản lý đồ uống
/admin/products         → Quản lý sản phẩm đóng gói
/admin/orders           → Quản lý đơn hàng
/admin/staff            → Quản lý nhân viên
/admin/settings         → Cài đặt quán
```

### 1.2 Categories API & UI

- [x] `GET /api/admin/categories` — list (filter by `type`)
- [x] `POST /api/admin/categories` — tạo
- [x] `PATCH /api/admin/categories/[id]` — sửa
- [x] `DELETE /api/admin/categories/[id]` — xóa (soft delete hoặc check rỗng)
- [x] UI: bảng danh mục + form tạo/sửa modal
- [x] Phân tab: Danh mục đồ uống | Danh mục sản phẩm

### 1.3 Drinks (Đồ uống) API & UI

- [x] `GET /api/admin/drinks` — list + filter category, search
- [x] `GET /api/admin/drinks/[id]` — chi tiết kèm variants, toppings
- [x] `POST /api/admin/drinks` — tạo product type DRINK
- [x] `PATCH /api/admin/drinks/[id]` — sửa
- [x] `PATCH /api/admin/drinks/[id]/status` — bật/tắt `isActive`
- [x] Quản lý variants (S/M/L + giá) trong form
- [x] Quản lý toppings gắn với product
- [x] Upload ảnh (URL string trước; S3/Cloudinary phase sau)

**Validation (Zod):**

```ts
// drink: name, categoryId, variants[{name, price}], toppingIds[], image?, description?
```

### 1.4 Packaged Products API & UI

- [x] `GET /api/admin/products` — list sản phẩm đóng gói
- [x] `POST /api/admin/products` — tạo product type PACKAGED
- [x] `PATCH /api/admin/products/[id]` — sửa
- [x] Quản lý SKUs: label (250g/500g), price, stock, sku code
- [x] UI: bảng + form, hiển thị tồn kho, cảnh báo stock thấp (< 5)
- [x] `PATCH /api/admin/products/[id]/stock` — điều chỉnh tồn kho thủ công

### 1.5 Toppings (dùng chung cho đồ uống)

- [x] `GET/POST/PATCH/DELETE /api/admin/toppings`
- [x] UI: trang quản lý topping độc lập hoặc section trong Drinks
- [x] Fields: name, price, isActive

### 1.6 Orders Management (Admin)

- [x] `GET /api/admin/orders` — list + filter: type, status, channel, date range
- [x] `GET /api/admin/orders/[id]` — chi tiết đơn
- [x] `PATCH /api/admin/orders/[id]/status` — đổi trạng thái
- [x] UI: bảng đơn hàng, filter tabs (Tất cả | Nước | Sản phẩm | Online | POS)
- [x] UI: trang chi tiết đơn — items, khách, địa chỉ, timeline trạng thái
- [x] Xử lý `PRODUCT_ORDER`: xác nhận → đóng gói → giao → hoàn thành
- [x] Trừ tồn kho khi xác nhận `PRODUCT_ORDER`

### 1.7 Staff Management

- [x] `GET /api/admin/staff` — list nhân viên (role STAFF)
- [x] `POST /api/admin/staff` — tạo tài khoản staff (admin tạo, không public register)
- [x] `PATCH /api/admin/staff/[id]` — sửa name, phone, isActive
- [x] `PATCH /api/admin/staff/[id]/reset-password` — reset mật khẩu
- [x] UI: bảng nhân viên + form tạo

### 1.8 Settings

- [x] Model `ShopSettings` (singleton): tên quán, địa chỉ, SĐT, giờ mở cửa, phí ship cơ bản
- [x] `GET/PATCH /api/admin/settings`
- [x] UI: form cài đặt cơ bản

### 1.9 Dashboard (sau khi có orders — có thể làm cuối Phase 1)

- [x] `GET /api/admin/dashboard/stats` — doanh thu hôm nay, số đơn, đơn chờ xử lý
- [x] `GET /api/admin/dashboard/top-products` — top 5 món bán chạy
- [x] UI: stat cards + bảng đơn gần đây

### ✅ Definition of Done — Phase 1

- [x] Admin login → CRUD đầy đủ categories, drinks, products, toppings
- [x] Tạo được nhân viên mới với role STAFF
- [x] Xem và đổi trạng thái đơn hàng (test bằng seed hoặc API thủ công)
- [x] Seed data: ≥ 3 categories, ≥ 10 đồ uống, ≥ 5 sản phẩm đóng gói
- [x] `npm run lint:strict` + `check-types` pass

---

## Phase 2 — Customer

**Mục tiêu:** Khách đặt nước online + mua sản phẩm đóng gói trên web.  
**Ước tính:** 2–3 tuần  
**Phụ thuộc:** Phase 1 (cần menu từ Admin)

### 2.1 Customer Shell & Homepage

- [ ] Layout customer: header (logo, nav), footer (thông tin quán)
- [ ] Homepage: hero + 2 CTA chính — **Đặt nước** | **Mua sản phẩm**
- [ ] Section món bán chạy (đồ uống)
- [ ] Section sản phẩm nổi bật (đóng gói)
- [ ] Metadata SEO cơ bản

**Routes:**

```
/                       → Homepage
/order                  → Đặt nước (menu đồ uống)
/shop                   → Mua sản phẩm đóng gói
/cart/drinks            → Giỏ đồ uống
/cart/products          → Giỏ sản phẩm
/checkout/drinks        → Thanh toán đồ uống
/checkout/products      → Thanh toán sản phẩm
/orders/[id]            → Theo dõi đơn
/account                → Tài khoản (optional)
/account/orders         → Lịch sử đơn
```

### 2.2 Public Catalog API

- [ ] `GET /api/catalog/categories?type=DRINK|PACKAGED`
- [ ] `GET /api/catalog/drinks` — list đồ uống active + variants + toppings
- [ ] `GET /api/catalog/drinks/[slug]` — chi tiết
- [ ] `GET /api/catalog/products` — list sản phẩm đóng gói + SKUs còn hàng
- [ ] `GET /api/catalog/products/[slug]` — chi tiết
- [ ] `GET /api/shop/settings` — thông tin quán public (giờ mở cửa, phí ship)

### 2.3 Đặt nước online — Browse & Customize

- [ ] Trang `/order`: sidebar categories + grid sản phẩm
- [ ] Modal/sheet chi tiết món: chọn size, topping, ghi chú
- [ ] Tùy chọn nhanh: đường (100/70/50/0%), đá (nhiều/ít/không)
- [ ] Hiển thị giá realtime khi đổi size/topping
- [ ] Mobile-first responsive

### 2.4 Giỏ hàng đồ uống

- [ ] State giỏ: localStorage hoặc Zustand (`drinkCart`)
- [ ] Trang `/cart/drinks`: list items, sửa số lượng, xóa
- [ ] Tính subtotal, phí ship (nếu giao hàng)
- [ ] **Giỏ tách biệt** — không mix với sản phẩm đóng gói

### 2.5 Checkout đồ uống

- [ ] Chọn fulfillment: **Giao hàng** | **Đến lấy**
- [ ] Form: tên, SĐT, địa chỉ (nếu giao), ghi chú
- [ ] Chọn giờ đến lấy / giao (time slots — optional MVP: ASAP)
- [ ] Payment method: COD / Chuyển khoản (MVP)
- [ ] `POST /api/orders/drinks` — tạo `DRINK_ORDER`, channel `ONLINE`
- [ ] Redirect → `/orders/[id]` trang theo dõi

### 2.6 Shop sản phẩm đóng gói

- [ ] Trang `/shop`: grid sản phẩm, filter category
- [ ] Trang chi tiết: mô tả, chọn SKU (250g/500g), số lượng
- [ ] Hiển thị "Hết hàng" khi stock = 0
- [ ] Giỏ riêng: `productCart` (localStorage/Zustand)

### 2.7 Checkout sản phẩm

- [ ] Form giao hàng: tên, SĐT, địa chỉ đầy đủ
- [ ] `POST /api/orders/products` — tạo `PRODUCT_ORDER`
- [ ] Validate stock trước khi tạo đơn (server-side)
- [ ] Trừ stock khi admin xác nhận (đã có ở Phase 1) — không trừ lúc checkout

### 2.8 Order Tracking

- [ ] `GET /api/orders/[id]/public` — xem đơn bằng orderNumber + phone (guest)
- [ ] Trang `/orders/[id]`: trạng thái, timeline, chi tiết items
- [ ] Badge trạng thái có màu rõ ràng
- [ ] Polling hoặc refetch 30s để cập nhật trạng thái

### 2.9 Customer Account (optional nhưng khuyến nghị)

- [ ] Đăng ký / đăng nhập khách (role CUSTOMER) — tái dùng auth hiện có
- [ ] `/account/orders` — lịch sử đơn của user đã login
- [ ] Guest checkout vẫn hoạt động không cần account

### ✅ Definition of Done — Phase 2

- [ ] Khách vào web → đặt được 1 ly nước, chọn giao/lấy, tạo đơn thành công
- [ ] Khách mua được sản phẩm đóng gói, tạo đơn thành công
- [ ] Admin thấy đơn mới trong `/admin/orders`
- [ ] Hai giỏ hàng hoàn toàn tách biệt
- [ ] Mobile usable trên viewport 375px
- [ ] `npm run lint:strict` + `check-types` pass

---

## Phase 3 — Staff (POS)

**Mục tiêu:** Nhân viên quầy order nước tại quán, thu tiền, xử lý đơn online.  
**Ước tính:** 2 tuần  
**Phụ thuộc:** Phase 1 (menu), Phase 2 (đơn online)

### 3.1 POS Shell & Auth

- [ ] Layout POS: full-screen, tối ưu tablet (min 1024px)
- [ ] Login staff → redirect `/pos`
- [ ] Header: tên nhân viên, đồng hồ, nút logout
- [ ] Tab chính: **Bán hàng** | **Hàng chờ** | **Đơn online**

### 3.2 POS Catalog (read-only từ Admin)

- [ ] `GET /api/pos/catalog` — categories + drinks active (reuse catalog logic)
- [ ] Sidebar categories dọc
- [ ] Grid món: ảnh + tên + giá min — nút lớn, dễ chạm
- [ ] Tap món → panel tùy chọn size/topping/đường/đá

### 3.3 POS Cart & Payment

- [ ] Panel giỏ bên phải: items, tổng tiền
- [ ] Nút +/- số lượng, xóa item
- [ ] Ghi chú đơn, tên khách (optional)
- [ ] Thanh toán: Tiền mặt | Chuyển khoản
- [ ] `POST /api/pos/orders` — tạo `DRINK_ORDER`, channel `POS`
- [ ] Sau thanh toán: clear giỏ, hiện mã đơn (#042)

### 3.4 Kitchen Queue (Hàng chờ)

- [ ] `GET /api/pos/queue` — đơn status PENDING + PREPARING + READY
- [ ] UI queue: card đơn — mã, món, tùy chọn, ghi chú, thời gian
- [ ] Nút: **Bắt đầu làm** → PREPARING | **Xong** → READY | **Đã giao** → COMPLETED
- [ ] `PATCH /api/pos/orders/[id]/status`
- [ ] Auto-refresh 10–15s (React Query `refetchInterval`)
- [ ] Sort: FIFO (cũ nhất trước)
- [ ] Âm thanh / notification khi có đơn online mới (optional)

### 3.5 Đơn online trên POS

- [ ] Tab **Đơn online**: filter `channel=ONLINE`, `type=DRINK_ORDER`
- [ ] Hiển thị: tên khách, SĐT, giao/lấy, địa chỉ
- [ ] Cùng flow status như queue
- [ ] Phân biệt visual: badge "Online" vs "Tại quầy"

### 3.6 In phiếu / Receipt

- [ ] Trang print-friendly `/pos/receipt/[id]`
- [ ] Nội dung: mã đơn, món, tùy chọn, tổng, thời gian
- [ ] Nút "In" trigger `window.print()`
- [ ] Auto-print sau tạo đơn (optional, configurable)

### 3.7 POS Quick Actions

- [ ] Tắt/bật món hết hàng nhanh (gọi API admin drinks status — staff only)
- [ ] Hủy đơn (chỉ PENDING, cần confirm)
- [ ] Xem doanh thu ca làm việc đơn giản (tổng đơn POS hôm nay)

### ✅ Definition of Done — Phase 3

- [ ] Staff login → bán được 1 ly tại quầy, tạo đơn POS
- [ ] Đơn xuất hiện trong Kitchen Queue
- [ ] Đổi trạng thái PENDING → PREPARING → READY → COMPLETED
- [ ] Đơn online từ Customer hiện trên POS, xử lý được
- [ ] In được phiếu order
- [ ] Usable trên tablet 10" landscape
- [ ] `npm run lint:strict` + `check-types` pass

---

## Phase 4 — Polish & Launch

**Mục tiêu:** Hoàn thiện trước khai trương.  
**Ước tính:** 1–2 tuần  
**Phụ thuộc:** Phase 1–3

### 4.1 Thanh toán online

- [ ] Tích hợp VNPay hoặc MoMo (chọn 1)
- [ ] Webhook xác nhận thanh toán
- [ ] Cập nhật `paymentStatus` → PAID

### 4.2 Báo cáo Admin nâng cao

- [ ] Doanh thu theo ngày/tuần/tháng
- [ ] Chart đơn giản (doanh thu 7 ngày)
- [ ] Export CSV đơn hàng

### 4.3 UX & Performance

- [ ] Loading skeletons cho catalog
- [ ] Error boundaries + toast notifications
- [ ] Image optimization (next/image)
- [ ] 404 / error pages cho từng section

### 4.4 Security & Production

- [ ] Rate limit API auth + checkout
- [ ] Validate env production (.env.example đầy đủ)
- [ ] CORS / cookie secure flags production
- [ ] Review RBAC toàn bộ API routes

### 4.5 Launch Checklist

- [ ] Seed menu thật của quán (không dùng data mẫu)
- [ ] Tạo tài khoản admin + staff thật
- [ ] Test E2E: Customer đặt → POS nhận → hoàn thành
- [ ] Test E2E: POS bán tại quầy → in phiếu
- [ ] Test E2E: Customer mua hạt → Admin xử lý → trừ stock
- [ ] Deploy production (Vercel + Neon)
- [ ] Domain + SSL

### ✅ Definition of Done — Phase 4

- [ ] Production deploy stable
- [ ] Full flow tested trên thiết bị thật (phone + tablet)
- [ ] Chủ quán tự vận hành được không cần dev

---

## Data Model Reference

```prisma
enum Role { ADMIN STAFF CUSTOMER }
enum ProductType { DRINK PACKAGED }
enum OrderType { DRINK_ORDER PRODUCT_ORDER }
enum OrderChannel { ONLINE POS }
enum OrderStatus { PENDING CONFIRMED PREPARING READY COMPLETED CANCELLED }
enum PaymentMethod { CASH BANK_TRANSFER COD VNPAY MOMO }
enum PaymentStatus { PENDING PAID REFUNDED }
enum FulfillmentType { DELIVERY PICKUP }

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  phone        String?
  role         Role     @default(CUSTOMER)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  sessions     Session[]
  orders       Order[]  @relation("CustomerOrders")
}

model Category {
  id        String      @id @default(cuid())
  name      String
  slug      String      @unique
  type      ProductType
  sortOrder Int         @default(0)
  isActive  Boolean     @default(true)
  products  Product[]
}

model Product {
  id          String           @id @default(cuid())
  name        String
  slug        String           @unique
  type        ProductType
  description String?
  image       String?
  isActive    Boolean          @default(true)
  categoryId  String
  category    Category         @relation(fields: [categoryId], references: [id])
  variants    ProductVariant[]
  toppings    ProductTopping[]
  skus        ProductSku[]
  orderItems  OrderItem[]
}

model ProductVariant {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  name      String   // S, M, L
  price     Int      // VND
}

model Topping {
  id       String           @id @default(cuid())
  name     String
  price    Int
  isActive Boolean          @default(true)
  products ProductTopping[]
}

model ProductTopping {
  productId String
  toppingId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  topping   Topping @relation(fields: [toppingId], references: [id], onDelete: Cascade)
  @@id([productId, toppingId])
}

model ProductSku {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  label     String   // 250g, 500g
  sku       String?
  price     Int
  stock     Int      @default(0)
}

model Order {
  id              String          @id @default(cuid())
  orderNumber     String          @unique
  type            OrderType
  channel         OrderChannel
  status          OrderStatus     @default(PENDING)
  paymentMethod   PaymentMethod?
  paymentStatus   PaymentStatus   @default(PENDING)
  customerName    String?
  customerPhone   String?
  userId          String?
  user            User?           @relation("CustomerOrders", fields: [userId], references: [id])
  createdById     String?         // staff tạo đơn POS
  fulfillment     FulfillmentType?
  pickupTime      DateTime?
  deliveryAddress String?
  shippingAddress String?
  note            String?
  subtotal        Int
  shippingFee     Int             @default(0)
  discount        Int             @default(0)
  total           Int
  items           OrderItem[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model OrderItem {
  id         String             @id @default(cuid())
  orderId    String
  order      Order              @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId  String
  product    Product            @relation(fields: [productId], references: [id])
  variantId  String?
  skuId      String?
  quantity   Int
  unitPrice  Int
  note       String?
  options    Json?              // { sugar: "50%", ice: "less" }
  toppings   OrderItemTopping[]
}

model OrderItemTopping {
  id          String    @id @default(cuid())
  orderItemId String
  orderItem   OrderItem @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
  toppingId   String
  name        String
  price       Int
}

model ShopSettings {
  id           String @id @default("default")
  shopName     String
  address      String?
  phone        String?
  openTime     String?  // "07:00"
  closeTime    String?  // "22:00"
  baseShipping Int      @default(15000)
}
```

---

## API Routes Summary

```
# Auth (đã có)
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

# Admin
GET|POST        /api/admin/categories
PATCH|DELETE    /api/admin/categories/[id]
GET|POST        /api/admin/drinks
GET|PATCH       /api/admin/drinks/[id]
GET|POST        /api/admin/products
GET|PATCH       /api/admin/products/[id]
GET|POST        /api/admin/toppings
GET             /api/admin/orders
GET|PATCH       /api/admin/orders/[id]
GET|POST        /api/admin/staff
GET|PATCH       /api/admin/settings
GET             /api/admin/dashboard/stats

# Customer (public)
GET    /api/catalog/categories
GET    /api/catalog/drinks
GET    /api/catalog/drinks/[slug]
GET    /api/catalog/products
GET    /api/catalog/products/[slug]
GET    /api/shop/settings
POST   /api/orders/drinks
POST   /api/orders/products
GET    /api/orders/[id]/public

# POS (staff)
GET    /api/pos/catalog
POST   /api/pos/orders
GET    /api/pos/queue
PATCH  /api/pos/orders/[id]/status
```

---

## Ghi chú & Quyết định thiết kế

| # | Quyết định | Lý do |
|---|-----------|-------|
| 1 | Giỏ hàng tách: drinks / products | Khác fulfillment, trạng thái, thời gian xử lý |
| 2 | Trừ stock khi admin xác nhận, không lúc checkout | Tránh oversell khi khách abandon cart |
| 3 | Guest checkout OK | Giảm friction, phù hợp đặt nước nhanh |
| 4 | POS chỉ xử lý đồ uống | Sản phẩm đóng gói do Admin xử lý |
| 5 | `orderNumber` dạng `#042` | Dễ gọi khách tại quán |
| 6 | Giá lưu integer (VND) | Tránh lỗi floating point |

---

## Nhật ký tiến độ

| Ngày | Phase | Ghi chú |
|------|-------|---------|
| 2026-07-08 | — | Tạo implementation plan |
| 2026-07-08 | 0 | Hoàn thành Phase 0 — schema, seed, RBAC layout guards, modules scaffold, shared UI |
| 2026-07-09 | 1 | Hoàn thành Phase 1 — admin shell, CRUD APIs/UI, settings migration, dashboard, seed mở rộng |
| | | |

---

## Bước tiếp theo

**Bắt đầu Phase 2** — Customer shell, public catalog, carts, checkout, order tracking.

```bash
# Khi sẵn sàng implement Phase 2:
npm run db:migrate
npm run db:seed
npm run dev
```
