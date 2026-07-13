# Admin Module Migration — Reference

File mapping from the **admin-order** migration. Use as a template when migrating other admin pages.

## Before → After

| Before (monolith) | After (dedicated module) |
|-------------------|--------------------------|
| `src/modules/admin/pages/admin-orders.page.tsx` | `src/modules/admin-order/pages/admin-orders.page.tsx` |
| Inline columns + tabs + query | Split into components + hooks |
| `AdminPageHeader` | `PageHeader` |
| Fixed `limit: 50`, no pagination | `useTablePagination` + server-side pagination |
| Local `useState` tabs | `FILTER_TABS` constant + `activeTab` in data hook |
| No search/filters | `nuqs` URL params + RHF filter popover |
| Desktop-only table | `OrdersTable` / `OrdersMobile` via `useSmaller("sm")` |

## File Map (admin-order)

```
src/modules/admin-order/
├── pages/admin-orders.page.tsx          # 33 lines — layout only
├── hooks/
│   ├── use-admin-orders.ts              # payload build + query + pagination reset
│   ├── use-admin-orders-request.ts      # nuqs: q, type, status, channel, from, to
│   └── use-admin-orders-filter.ts       # RHF filter form → URL
├── components/
│   ├── orders-toolbar.tsx               # DebouncedInput + filter button
│   ├── orders-toolbar-filter.tsx        # Popover wrapper
│   ├── order-toolbar-filter-content.tsx # RHFSelect fields + actions
│   ├── orders-table.tsx                 # ColumnDef + manual pagination
│   ├── orders-mobile.tsx                # SkeletonListMobile + Pagination
│   ├── order-item-mobile.tsx            # Single card
│   ├── order-number.tsx                 # Link cell
│   └── order-status.tsx                 # Badge cell
├── constants/index.ts                   # FILTER_TABS, STATUS_LABELS
└── utils/search-params.util.ts          # nuqs parsers for enums
```

## API Layer Changes (orders)

### common/models/order/order-model.ts

```ts
export interface ListOrdersPayload extends PaginationQueryParams {
  search?: string;
  types?: EOrderType[];
  statuses?: EOrderStatus[];
  channels?: EOrderChannel[];
  fromDate?: string;
  toDate?: string;
}

export type ListOrdersResponse = PageableResponse<OrderObject>;
```

### common/models/order/order-api-model.ts

```ts
export const API_ADMIN_ORDERS: APIDefinition = {
  method: APIMethod.POST,  // was GET-style — now POST with body
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/orders",
  requestBody: {} as ListOrdersPayload,
  responseBody: {} as ListOrdersResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/orders`,
};
```

### Server

| File | Change |
|------|--------|
| `order.schema.ts` | `listOrdersSchema` with limit/offset/search/filters |
| `order.repository.ts` | `findOrders()` with `buildOrderListWhere`, count + findMany |
| `order.service.ts` | `listOrders()` → `{ total_record, data }` |
| `app/api/admin/orders/route.ts` | `POST` + `listOrdersSchema.parse(body)` |

## Hook Templates

### use-admin-<domain>s-request.ts

```ts
"use client";

import { useQueryStates } from "nuqs";
import { SearchParams } from "@/shared/enums";
import { <DOMAIN>_SEARCH_PARAMS } from "../utils/search-params.util";

export const useAdmin<Domain>sRequest = () => {
  const [{ q: search, ...filters }, setRequest] = useQueryStates(<DOMAIN>_SEARCH_PARAMS);

  const onSearchChange = (value: string) => {
    setRequest({ [SearchParams.Query]: value });
  };

  const isFiltering = /* check non-default filter values */;

  return { search, ...filters, onSearchChange, setRequest, isFiltering };
};
export type UseAdmin<Domain>sRequestReturn = ReturnType<typeof useAdmin<Domain>sRequest>;
```

### use-admin-<domain>s.ts

```ts
"use client";

import { useEffect, useMemo } from "react";
import { useTablePagination } from "@/shared/hooks";
import { useQueryAdmin<Domain>s } from "@/shared/queries";
import { useAdmin<Domain>sRequest } from "./use-admin-<domain>s-request";

export const useAdmin<Domain>s = () => {
  const filters = useAdmin<Domain>sRequest();
  const { pagination, setPagination } = useTablePagination();

  const payload = useMemo(() => ({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: filters.search.trim() || undefined,
    // map filter fields...
  }), [filters, pagination]);

  const { data, isLoading, isFetching } = useQueryAdmin<Domain>s({ input: payload });

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [/* filter deps */, setPagination]);

  return {
    items: data?.data ?? [],
    totalItems: data?.total_record ?? 0,
    isLoading,
    isFetching,
    pagination,
    setPagination,
  };
};
```

### search-params.util.ts

```ts
import { createParser, parseAsArrayOf, parseAsString } from "nuqs";
import { SearchParams } from "@/shared/enums";

// createParser for enum validation when needed

export const <DOMAIN>_SEARCH_PARAMS = {
  [SearchParams.Query]: parseAsString.withDefault(""),
  // domain-specific parsers...
};
```

Reuse `SearchParams` enum from `src/shared/enums/routes.enum.ts`. Add new keys there if the domain needs params not yet defined.

## Component Split Guidelines

| Extract when page has... | Component |
|--------------------------|-----------|
| Column definitions | `<domain>-table.tsx` |
| Row link/badge/formatting | `<domain>-<field>.tsx` |
| Search bar | `<domain>s-toolbar.tsx` |
| Filter popover/sheet | `<domain>s-toolbar-filter.tsx` + `-content.tsx` |
| Mobile card layout | `<domain>-item-mobile.tsx` |
| Create/edit dialog | `<domain>-form-dialog.tsx` |

Keep each file under ~200 lines.

## Pages That Differ

Not every admin page is a paginated list. Adapt the pattern:

| Page type | Skip | Keep |
|-----------|------|------|
| **List** (categories, drinks, staff) | — | Full pattern |
| **Detail** (order-detail) | Table/mobile split | Module extraction, PageHeader |
| **Dashboard** | URL filters, pagination | Module extraction, stat components |
| **Settings form** | Table, pagination | Module extraction, useForm hook |
| **Reports** | Mobile list | Module extraction, chart components |

## Import Path Updates

```ts
// ❌ Old
import { AdminCategoriesPage } from "@/modules/admin/pages/admin-categories.page";

// ✅ New
import { AdminCategoriesPage } from "@/modules/admin-category/pages/admin-categories.page";
```

App routes stay thin — only re-export the page component.

## Shared Utilities Used

| Utility | Location | Purpose |
|---------|----------|---------|
| `useTablePagination` | `@/shared/hooks` | Table page state |
| `useSmaller` / `useGreater` | `@/shared/hooks` | Responsive switch |
| `DebouncedInput` | `@/shared` | Search with debounce |
| `PageHeader` | `@/shared/components/page-header` | Page title + action |
| `SkeletonListMobile` | `@/shared/components` | Mobile loading |
| `SearchParams` enum | `@/shared/enums` | URL param keys |
