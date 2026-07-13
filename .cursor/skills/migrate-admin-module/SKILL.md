---
name: migrate-admin-module
description: >-
  Migrates a monolithic admin page from src/modules/admin/ into a dedicated
  src/modules/admin-<domain>/ feature module with updated list API, pagination,
  URL filters, and responsive UI. Use when refactoring admin pages (categories,
  drinks, products, staff, settings, reports, order detail), extracting admin
  features into separate modules, or applying the admin-order migration pattern.
---

# Migrate Admin Module

Extract one admin feature from `src/modules/admin/` into `src/modules/admin-<domain>/`, following the **admin-order** reference implementation.

## Before You Start

1. Read architecture rules: `.cursor/rules/module-architecture.mdc`, `.cursor/rules/server-architecture.mdc`
2. Read the reference module: `src/modules/admin-order/`
3. Identify source page: `src/modules/admin/pages/admin-<domain>.page.tsx`
4. Identify app route: `src/app/(admin)/admin/<route>/page.tsx`

## Target Module Structure

```
src/modules/admin-<domain>/
├── components/
│   ├── index.ts
│   ├── <domain>-table.tsx          # desktop table
│   ├── <domain>s-mobile.tsx        # mobile list (if list page)
│   ├── <domain>-item-mobile.tsx    # single mobile card
│   ├── <domain>s-toolbar.tsx       # search + filter trigger
│   └── <domain>s-toolbar-filter.tsx
├── constants/
│   └── index.ts                    # labels, tabs, status maps
├── hooks/
│   ├── use-admin-<domain>s.ts              # data + pagination
│   ├── use-admin-<domain>s-request.ts      # URL search params (nuqs)
│   └── use-admin-<domain>s-filter.ts       # RHF filter form (if filters)
├── pages/
│   └── admin-<domain>s.page.tsx    # thin page only
└── utils/
    └── search-params.util.ts       # nuqs parsers
```

Root `index.ts` exports hooks, pages, types only — **not** components.

## Migration Checklist

Copy and track progress:

```
- [ ] 1. Audit old page — list states, queries, columns, actions, filters
- [ ] 2. Update common/models/<domain>/ (payload, PageableResponse)
- [ ] 3. Update server (schema → repository → service → route)
- [ ] 4. Update/create shared query hook in @/shared/queries
- [ ] 5. Scaffold admin-<domain>/ module
- [ ] 6. Implement hooks (request → filter → data)
- [ ] 7. Split UI into components (toolbar, table, mobile)
- [ ] 8. Write thin page with responsive switch
- [ ] 9. Point app route to new page
- [ ] 10. Remove old page + unused admin imports
- [ ] 11. Run npm run lint
```

## Step-by-Step Workflow

### 1. Audit the Old Page

From `src/modules/admin/pages/admin-<domain>.page.tsx`, extract:

| Concern | Move to |
|---------|---------|
| Table columns | `<domain>-table.tsx` |
| Row actions / dialogs | dedicated components |
| Tab/filter state | `constants/` + hooks |
| Query payload | `use-admin-<domain>s.ts` |
| Inline useState filters | `use-admin-<domain>s-request.ts` (nuqs) |
| Filter form fields | `use-admin-<domain>s-filter.ts` (RHF + Zod) |

### 2. Update API Contract (`common/models/<domain>/`)

For list endpoints, adopt the admin-order pattern:

```ts
// <domain>-model.ts
export interface List<Domain>Payload extends PaginationQueryParams {
  search?: string;
  // domain-specific filter fields
}

export type List<Domain>Response = PageableResponse<<Domain>Object>;
```

```ts
// <domain>-api-model.ts — POST list with body payload
export const API_ADMIN_<DOMAIN>S: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/<domain>s",
  requestBody: {} as List<Domain>Payload,
  responseBody: {} as List<Domain>Response,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/<domain>s`,
};
```

Use `PageableResponse<T>` from `common/models/api-base.ts` (`total_record` + `data`).

### 3. Update Server Layer

Follow `src/server/order/` as reference:

**schema** — add/update list schema with pagination + filters:
```ts
export const list<Domain>sSchema = z.object({
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  search: z.string().optional(),
  // filter fields...
});
```

**repository** — `find<Domain>s(filters)` returns `{ total_record, items }`:
- Build `where` from search + filter arrays
- `Promise.all([count, findMany])` with `skip`/`take`

**service** — map DB rows to `<Domain>Object`, return `{ total_record, data }`

**route** — `POST` with `list<Domain>sSchema.parse(await request.json())`

### 4. Shared Query Hook

Create/update `@/shared/queries/use-query-admin-<domain>s.ts`:

```ts
export function useQueryAdmin<Domain>s({ input }: QueryProps<Response, Payload>) {
  return useQuery({
    queryKey: ADMIN_<DOMAIN>_KEYS.list(input),
    queryFn: () => postRequest({ path: API_ADMIN_<DOMAIN>S.buildUrlPath(), data: input }),
  });
}
```

Add query keys to `src/shared/constants/query-keys.constant.ts`.

### 5. Hooks Pattern (3-layer)

**`use-admin-<domain>s-request.ts`** — URL state via `nuqs`:
```ts
export const useAdmin<Domain>sRequest = () => {
  const [{ q: search, ...filters }, setRequest] = useQueryStates(SEARCH_PARAMS);
  return { search, ...filters, onSearchChange, setRequest, isFiltering };
};
```

**`use-admin-<domain>s-filter.ts`** — RHF form synced to URL (only if filters exist):
- Zod schema for filter fields
- `onSubmit` → `setRequest(...)` + close popover
- `onReset` → clear URL params
- `useEffect` to reset form when URL changes

**`use-admin-<domain>s.ts`** — data orchestration:
```ts
export const useAdmin<Domain>s = () => {
  const request = useAdmin<Domain>sRequest();
  const { pagination, setPagination } = useTablePagination();
  const payload = useMemo(() => ({ ...requestFilters, limit, offset }), [...deps]);
  const { data, isLoading, isFetching } = useQueryAdmin<Domain>s({ input: payload });

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [/* filter deps */]);

  return { items: data?.data ?? [], totalItems: data?.total_record ?? 0, ... };
};
```

### 6. UI Components

**Thin page** (`admin-<domain>s.page.tsx`):
```tsx
export const Admin<Domain>sPage = () => {
  const isMobile = useSmaller("sm");
  const hook = useAdmin<Domain>s();
  const ListComponent = isMobile ? <Domain>sMobile : <Domain>Table;

  return (
    <div className="gap-4xl flex flex-col">
      <PageHeader title="..." description="..." action={...} />
      <div className="p-3xl md:p-4xl gap-4xl flex flex-col rounded-xl bg-white">
        <<Domain>sToolbar />
        <ListComponent {...hook} />
      </div>
    </div>
  );
};
```

**Rules:**
- Replace `AdminPageHeader` → `PageHeader` from `@/shared/components/page-header`
- Use `@/shared/components` — never raw `<button>`, `<p>`, `<h*>`
- Use brand spacing tokens (`gap-4xl`, `p-3xl`) — no raw pixels
- All user-facing text in **English**
- Table: `manualPagination={true}`, pass `rowCount={totalItems}`, `isFetching`
- Mobile: `SkeletonListMobile` for loading, `Pagination` component

### 7. Wire App Route

```tsx
// src/app/(admin)/admin/<route>/page.tsx
import { Admin<Domain>sPage } from "@/modules/admin-<domain>/pages/admin-<domain>s.page";
export default function Page() { return <Admin<Domain>sPage />; }
```

### 8. Cleanup

- Remove old page from `src/modules/admin/pages/`
- Remove export from `src/modules/admin/pages/index.ts`
- Move domain-specific components/hooks from `src/modules/admin/` if any
- Grep for old import paths and update

## Remaining Migrations

| Old page | Target module | App route |
|----------|---------------|-----------|
| `admin-categories.page.tsx` | `admin-category` | `/admin/categories` |
| `admin-drinks.page.tsx` | `admin-drink` | `/admin/drinks` |
| `admin-products.page.tsx` | `admin-product` | `/admin/products` |
| `admin-staff.page.tsx` | `admin-staff` | `/admin/staff` |
| `admin-settings.page.tsx` | `admin-setting` | `/admin/settings` |
| `admin-reports.page.tsx` | `admin-report` | `/admin/reports` |
| `admin-dashboard.page.tsx` | `admin-dashboard` | `/admin` |
| `admin-order-detail.page.tsx` | `admin-order` | `/admin/orders/[id]` |

**Done:** `admin-orders.page.tsx` → `src/modules/admin-order/` ✅

Dashboard/reports may not need full list-API pattern — adapt hooks/components but keep module extraction structure.

## Validation

After migration:

```bash
npm run lint
```

Manual checks:
- Desktop table paginates correctly
- Mobile list + pagination works
- URL filters persist on refresh (if applicable)
- Search debounces and resets page index
- Empty/loading states render in English
- App route resolves without importing old admin page

## Additional Resources

- File-by-file reference mapping: [reference.md](reference.md)
- Gold standard module: `src/modules/admin-order/`
- Shared search param enum: `src/shared/enums/routes.enum.ts` → `SearchParams`
