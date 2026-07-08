# Coffee Shop — Project Guide

> Kế hoạch triển khai chi tiết: `[docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)`

## Architecture Rules

**Khi implement code, bắt buộc tuân thủ 2 Cursor rules sau.** Đây là source of truth cho conventions — không tự ý đổi pattern.


| Rule                    | File                                                                             | Áp dụng khi                                             |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Server Architecture** | `[.cursor/rules/server-architecture.mdc](.cursor/rules/server-architecture.mdc)` | `src/server/`**, `src/app/api/**`, `src/app/actions/**` |
| **Module Architecture** | `[.cursor/rules/module-architecture.mdc](.cursor/rules/module-architecture.mdc)` | `src/modules/`**, `common/models/**`                    |




### Tóm tắt nhanh

**Backend** — `src/server/<domain>/` gồm 4 file: `repository` → `service` → `schema` → `types`.

```
API route / Server Action
  → Zod validate (schema)
  → service (business logic, throw AppError)
  → repository (duy nhất layer gọi prisma)
```

**Frontend** — feature modules trong `src/modules/<module>/`, shared API contracts trong `common/models/<domain>/`.

```
common/models/<domain>/     # types + APIDefinition (client ↔ server contract)
src/modules/<module>/       # hooks, pages, components, layouts
src/shared/                 # shared mutations/queries, UI components
```



### Ranh giới trách nhiệm


| Layer                  | Vị trí                                   | Trách nhiệm                                                                      |
| ---------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| API contract (shared)  | `common/models/<domain>/`                | `*Request`, `*Response`, `*Object`, `API_*` constants                            |
| Server types (private) | `src/server/<domain>/<domain>.types.ts`  | Service return types, DB shapes — không duplicate frontend contracts             |
| Server validation      | `src/server/<domain>/<domain>.schema.ts` | Zod schemas cho API input                                                        |
| Infra (cross-cutting)  | `src/libs/`                              | prisma singleton, errors, auth session/cookies/password, http helpers            |
| Client data fetching   | `src/shared/`                            | TanStack Query hooks (`useLoginMutation`, `useQueryMe`, …)                       |
| Feature UI             | `src/modules/<module>/`                  | Pages, hooks, components — consume `@/shared` hooks, không gọi `fetch` trực tiếp |


---



## Stack

Next.js 16 · React 19 · Prisma · PostgreSQL (Neon) · Tailwind CSS · TanStack Query · Zod · axios

---



## Project Context



### Prisma

- **Schema**: `prisma/schema.prisma`
- **Client singleton**: `src/libs/prisma.ts` — chỉ import từ đây
- **Generated client**: `src/generated/prisma/` — không sửa thủ công
- **Migrations**: `npm run db:migrate` — không edit SQL thủ công
- **Neon adapter**: pooled `DATABASE_URL`, direct `DIRECT_URL`
- Sau schema change: `npm run db:generate` trước khi start server



#### Models hiện tại

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  sessions     Session[]
}

model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(...)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

> **Planned (Phase 0):** `Role` enum (`ADMIN`, `STAFF`, `CUSTOMER`), `User.role`, RBAC guards, seed script.



### Auth & Session

Session dùng opaque DB token trong `httpOnly` cookie (`session`) — không dùng JWT.


| File                        | Vai trò                                                                           |
| --------------------------- | --------------------------------------------------------------------------------- |
| `src/libs/auth/session.ts`  | `createSession`, `getSessionUser`, `deleteSession`, `toPublicUser`                |
| `src/libs/auth/password.ts` | bcrypt hash/verify                                                                |
| `src/libs/auth/cookies.ts`  | Cookie options                                                                    |
| `src/libs/auth/http.ts`     | `jsonOk`, `jsonError`, `zodErrorResponse`                                         |
| `src/server/auth/`          | Domain logic: login, register, logout, me (repository + service + schema + types) |
| `src/libs/errors.ts`        | `AppError` với `statusCode`                                                       |


`PublicUser` = `Pick<User, "id" | "email" | "name" | "createdAt" | "updatedAt">`

### API Routes hiện có


| Method | Path                 | Service          |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | `registerUser`   |
| POST   | `/api/auth/login`    | `loginUser`      |
| POST   | `/api/auth/logout`   | `logoutUser`     |
| GET    | `/api/auth/me`       | `getCurrentUser` |




### Route Protection & RBAC (Planned)

> Chưa implement. Xem `docs/IMPLEMENTATION_PLAN.md` Phase 0.2.

- `requireAuth()` / `requireRole(roles[])` trong `src/libs/auth/guards.ts`
- Guards cho `/admin/*` (ADMIN), `/pos/*` (ADMIN + STAFF)
- Role home: `ADMIN` → `/admin`, `STAFF` → `/pos`, `CUSTOMER` → `/`



### Ba vai trò hệ thống


| Vai trò     | Route prefix | Mô tả                                       |
| ----------- | ------------ | ------------------------------------------- |
| Admin       | `/admin`     | Quản lý menu, sản phẩm, đơn hàng, nhân viên |
| Customer    | `/`          | Đặt hàng online                             |
| Staff (POS) | `/pos`       | Bán tại quầy                                |


---



## TypeScript Rules

- **Strict mode** — không dùng `any`; dùng `unknown` + type guards.
- Prefer `type` over `interface` trừ khi cần declaration merging.
- Co-locate types gần nơi sử dụng; chỉ move ra shared khi reuse.
- Type return value rõ ràng cho public/exported functions.

---



## Code Quality

- Chạy `npm run lint` trước khi commit.
- Không unused imports/variables.
- Named exports (trừ Next.js page/layout files).
- Giữ file dưới ~200 dòng — split nếu cần.

