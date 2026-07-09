# Project Context

> Implementation plan (Vietnamese): [docs/IMPLEMENTATION_PLAN.md](../../docs/IMPLEMENTATION_PLAN.md)

## Prisma

- **Schema**: `prisma/schema.prisma`
- **Client singleton**: `src/libs/prisma.ts` — import only from here
- **Generated client**: `src/generated/prisma/` — do not edit manually
- **Migrations**: `npm run db:migrate` — do not edit SQL manually
- **Neon adapter**: pooled `DATABASE_URL`, direct `DIRECT_URL`
- After schema changes: run `npm run db:generate` before starting the server

### Current models

Expanded in Phase 0 — see full schema in `prisma/schema.prisma` and [Data Model Reference](../../docs/IMPLEMENTATION_PLAN.md).

- `User` (+ `role`, `phone`, `isActive`), `Session`
- Catalog: `Category`, `Product`, `ProductVariant`, `Topping`, `ProductTopping`, `ProductSku`
- Orders: `Order`, `OrderItem`, `OrderItemTopping`
- Enums: `Role`, `ProductType`, `OrderType`, `OrderChannel`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `FulfillmentType`

**Dev seed:** `npm run db:seed` — `admin@coffee.local` / `staff@coffee.local` (password: `Password123!`)

## Auth & Session

Session uses an opaque DB token in an `httpOnly` cookie (`session`) — no JWT.

| File                         | Role                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `src/libs/auth/session.ts`   | `createSession`, `getSessionUser`, `deleteSession`, `toPublicUser`                |
| `src/libs/auth/guards.ts`    | `requireAuth`, `requireRole`, `requireAuthOrRedirect`, `requireRoleOrRedirect`    |
| `src/libs/auth/role-home.ts` | `getRoleHomePath` — post-login redirect by role                                   |
| `src/libs/auth/password.ts`  | bcrypt hash/verify                                                                |
| `src/libs/auth/cookies.ts`   | Cookie options                                                                    |
| `src/libs/auth/http.ts`      | `jsonOk`, `jsonError`, `zodErrorResponse`                                         |
| `src/server/auth/`           | Domain logic: login, register, logout, me (repository + service + schema + types) |
| `src/libs/errors.ts`         | `AppError` with `statusCode`                                                      |

`PublicUser` = `Pick<User, "id" | "email" | "name" | "phone" | "role" | "isActive" | "createdAt" | "updatedAt">`

## Current API routes

| Method | Path                 | Service          |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | `registerUser`   |
| POST   | `/api/auth/login`    | `loginUser`      |
| POST   | `/api/auth/logout`   | `logoutUser`     |
| GET    | `/api/auth/me`       | `getCurrentUser` |

## Route protection & RBAC

Layout guards (Server Component) — no middleware:

- `requireAuth()` / `requireRole(roles[])` in `src/libs/auth/guards.ts` — for API routes
- `requireRoleOrRedirect()` in layouts — `/admin/*` (ADMIN), `/pos/*` (ADMIN + STAFF)
- Role home: `ADMIN` → `/admin`, `STAFF` → `/pos`, `CUSTOMER` → `/`

## System roles

| Role        | Route prefix | Description                                      |
| ----------- | ------------ | ------------------------------------------------ |
| Admin       | `/admin`     | Manage menu, products, orders, staff           |
| Customer    | `/`          | Order online                                     |
| Staff (POS) | `/pos`       | In-store point-of-sale                           |
