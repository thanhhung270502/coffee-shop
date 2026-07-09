# Coffee Shop — Project Guide

> Detailed implementation plan (Vietnamese): [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)
>
> Reference context: [.cursor/context/](.cursor/context/)

## Architecture Rules

**When implementing code, you must follow the two Cursor rules below.** They are the source of truth for conventions — do not change patterns on your own.

| Rule                    | File                                                                             | Applies to                                              |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Server Architecture** | [.cursor/rules/server-architecture.mdc](.cursor/rules/server-architecture.mdc) | `src/server/**`, `src/app/api/**`, `src/app/actions/**` |
| **Module Architecture** | [.cursor/rules/module-architecture.mdc](.cursor/rules/module-architecture.mdc) | `src/modules/**`, `common/models/**`                    |

### Quick summary

**Backend** — `src/server/<domain>/` has 4 files: `repository` → `service` → `schema` → `types`.

```
API route / Server Action
  → Zod validate (schema)
  → service (business logic, throw AppError)
  → repository (only layer that calls prisma)
```

**Frontend** — feature modules in `src/modules/<module>/`, shared API contracts in `common/models/<domain>/`, UI primitives in `src/shared/components/`.

```
common/models/<domain>/     # types + APIDefinition (client ↔ server contract)
src/modules/<module>/       # hooks, pages, components, layouts — consume shared UI + hooks
src/shared/components/      # design-system primitives — prefer these before building custom UI
src/shared/                 # mutations/queries, hooks, utils (barrel: @/shared)
```

### Layer responsibilities

| Layer                  | Location                                 | Responsibility                                                             |
| ---------------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| API contract (shared)  | `common/models/<domain>/`                | `*Request`, `*Response`, `*Object`, `API_*` constants                      |
| Server types (private) | `src/server/<domain>/<domain>.types.ts`  | Service return types, DB shapes — do not duplicate frontend contracts    |
| Server validation      | `src/server/<domain>/<domain>.schema.ts` | Zod schemas for API input                                                  |
| Infra (cross-cutting)  | `src/libs/`                              | prisma singleton, errors, auth session/cookies/password, http helpers      |
| Shared UI primitives   | `src/shared/components/`                 | Button, Input, Table, Dialog, … — **required instead of native HTML**      |
| Client data fetching   | `src/shared/mutations`, `queries/`       | TanStack Query hooks (`useLoginMutation`, `useQueryMe`, …)                 |
| Feature UI             | `src/modules/<module>/`                  | Pages, hooks, components — use `@/shared/components` + `@/shared` hooks  |

## Stack

Next.js 16 · React 19 · Prisma · PostgreSQL (Neon) · Tailwind CSS · TanStack Query · Zod · axios

## Context (details)

| Topic                          | File                                                                 |
| ------------------------------ | -------------------------------------------------------------------- |
| Prisma, Auth, API routes, RBAC | [.cursor/context/project.md](.cursor/context/project.md)           |
| Shared UI components           | [.cursor/context/shared-components.md](.cursor/context/shared-components.md) |

## TypeScript Rules

- **Strict mode** — no `any`; use `unknown` + type guards.
- Prefer `type` over `interface` unless declaration merging is needed.
- Co-locate types near usage; move to shared only when reused.
- Explicit return types for public/exported functions.

## Language & Copy

**All user-facing text in code must be English.** Planning docs (e.g. `docs/IMPLEMENTATION_PLAN.md`) may stay Vietnamese — that does not apply to the app.

| Scope | Language | Examples |
| ----- | -------- | -------- |
| UI labels, buttons, nav, table headers | English | `Add Category`, `Edit`, `Cancel`, `Active` |
| Page titles & descriptions | English | `Categories`, `Manage drink menu` |
| Empty / loading states | English | `No orders yet`, `Loading...` |
| `confirm()` / `prompt()` dialogs | English | `Delete this category?` |
| Zod `.min()` / custom validation messages | English | `"Category name is required"` |
| `AppError` messages (returned to client) | English | `"Category not found"` |
| `aria-label`, tooltips, badge text | English | `Expand sidebar` |

```ts
// ✅ GOOD
throw new AppError("Category not found", 404);
name: z.string().min(1, "Category name is required"),
<Button>Edit</Button>
if (!confirm("Delete this category?")) return;

// ❌ BAD — Vietnamese in user-facing strings
throw new AppError("Danh mục không tồn tại", 404);
<Button>Sửa</Button>
if (!confirm("Xóa danh mục này?")) return;
```

Applies to: `src/modules/**`, `src/shared/components/**`, `src/server/**` (schemas + services), `src/app/**` (pages with UI).

## Code Quality

- Run `npm run lint` before committing.
- No unused imports/variables.
- Named exports (except Next.js page/layout files).
- Keep files under ~200 lines — split when needed.
