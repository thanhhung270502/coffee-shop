# Project Context

> Implementation plan (Vietnamese): [docs/IMPLEMENTATION_PLAN.md](../../docs/IMPLEMENTATION_PLAN.md)

## Current Delivery Status

- Phase 0: completed
- Phase 1 (Admin): completed
- Next target: Phase 2 (Customer)

## Prisma

- **Schema**: `prisma/schema.prisma`
- **Client singleton**: `src/libs/prisma.ts` (repository layer only)
- **Generated client**: `src/generated/prisma/` (do not edit manually)
- **Migrations**: `npm run db:migrate` (do not edit migration SQL manually)
- **Generate**: `npm run db:generate` after schema changes

### Current models

- Auth: `User`, `Session`
- Catalog: `Category`, `Product`, `ProductVariant`, `Topping`, `ProductTopping`, `ProductSku`
- Orders: `Order`, `OrderItem`, `OrderItemTopping`
- Shop config: `ShopSettings` (singleton, id = `default`)
- Enums: `Role`, `ProductType`, `OrderType`, `OrderChannel`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `FulfillmentType`

### Seed

- Run: `npm run db:seed`
- Dev accounts:
  - `admin@coffee.local` / `Password123!`
  - `staff@coffee.local` / `Password123!`
- Seed includes:
  - >= 3 categories
  - >= 10 drinks
  - >= 5 packaged products
  - sample orders and default shop settings

## Auth & Session

- Session strategy: opaque DB token in cookie (no JWT)
- Cookie name: `session_token` (`src/libs/auth/cookies.ts`)
- Cookie type: `httpOnly`, `sameSite=lax`, secure in production

| File | Responsibility |
| ---- | -------------- |
| `src/libs/auth/session.ts` | `createSession`, `getSessionUser`, `deleteSession`, `toPublicUser` |
| `src/libs/auth/guards.ts` | `requireAuth`, `requireRole`, `requireAuthOrRedirect`, `requireRoleOrRedirect` |
| `src/libs/auth/role-home.ts` | Role-based home path |
| `src/libs/auth/password.ts` | bcrypt hash/verify |
| `src/libs/auth/http.ts` | `jsonOk`, `jsonError`, `zodErrorResponse` |
| `src/libs/errors.ts` | `AppError` |

`PublicUser` = `Pick<User, "id" | "email" | "name" | "phone" | "role" | "isActive" | "createdAt" | "updatedAt">`

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Admin (Phase 1 complete)

- Categories
  - `GET|POST /api/admin/categories`
  - `PATCH|DELETE /api/admin/categories/[id]`
- Toppings
  - `GET|POST /api/admin/toppings`
  - `PATCH|DELETE /api/admin/toppings/[id]`
- Drinks
  - `GET|POST /api/admin/drinks`
  - `GET|PATCH /api/admin/drinks/[id]`
  - `PATCH /api/admin/drinks/[id]/status`
- Packaged products
  - `GET|POST /api/admin/products`
  - `GET|PATCH /api/admin/products/[id]`
  - `PATCH /api/admin/products/[id]/stock`
- Orders
  - `GET /api/admin/orders`
  - `GET|PATCH /api/admin/orders/[id]`
- Staff
  - `GET|POST /api/admin/staff`
  - `PATCH /api/admin/staff/[id]`
  - `PATCH /api/admin/staff/[id]/reset-password`
- Settings
  - `GET|PATCH /api/admin/settings`
- Dashboard
  - `GET /api/admin/dashboard/stats`
  - `GET /api/admin/dashboard/top-products`

## Route protection & RBAC

- API routes: `requireRole(...)` from `src/libs/auth/guards.ts`
- Layout guards:
  - `/admin/*` => `ADMIN` (`src/app/(admin)/admin/layout.tsx`)
  - `/pos/*` => `ADMIN | STAFF` (`src/app/(pos)/pos/layout.tsx`)
- Role home mapping:
  - `ADMIN` => `/admin`
  - `STAFF` => `/pos`
  - `CUSTOMER` => `/`

## System Roles

| Role | Route prefix | Description |
| ---- | ------------ | ----------- |
| Admin | `/admin` | Manage menu, products, orders, staff, settings |
| Customer | `/` | Browse catalog and place online orders (Phase 2) |
| Staff (POS) | `/pos` | In-store POS and queue operations (Phase 3) |

## Language Rule (Important)

All user-facing text in application code must be English:

- UI labels, titles, buttons, empty states
- `confirm()` / `prompt()` strings
- Zod validation messages
- `AppError` messages returned to clients

Planning documents can remain Vietnamese; app runtime text cannot.
