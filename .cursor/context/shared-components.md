# Shared UI Components

**Required preference:** When building UI in `src/modules/`, always use components from `@/shared/components` instead of native HTML or custom primitives. Add new components to `src/shared/components/` only when reused in ≥ 2 places — do not duplicate UI inside modules.

## Import

```tsx
import { Button, Typography, Input, Table } from "@/shared/components";
// or import directly from a specific file for clearer tree-shaking
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/dialog";
```

## Available components

See the full list in `src/shared/components/index.ts`:

| Group               | Components                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Typography & layout | `Typography`, `Card`, `Separator`, `Skeleton`, `LinearProgress`                                   |
| Actions             | `Button`                                                                                          |
| Forms               | `Input`, `DebouncedInput`, `Checkbox`, `Radio`, `RadioGroup`, `Select`, `DateInput`, `DatePicker` |
| Overlays            | `Dialog`, `Sheet`, `Popover`, `Tooltip`, `Collapsible`                                            |
| Data display        | `Badge`, `Table`, `TableFooter`, `TablePagination`, `SortDirectionIcon`                           |
| Icons               | `ExternalIcons`                                                                                   |

## Quick mapping

Use shared components, not raw HTML:

| Need             | Use                                                 | Do not use                              |
| ---------------- | --------------------------------------------------- | --------------------------------------- |
| Text / heading   | `<Typography variant="..." />`                      | `<p>`, `<h1>`–`<h6>`, `<span>` (unstyled) |
| Clickable action | `<Button variant="..." size="..." />`               | `<button>`                              |
| Text input       | `<Input />`, `<DebouncedInput />` (search/filter)   | `<input>`                               |
| Checkbox / radio | `<Checkbox />`, `<Radio />`, `<RadioGroup />`       | `<input type="checkbox/radio">`         |
| Dropdown         | `<Select />`                                        | `<select>`                              |
| Date             | `<DateInput />`, `<DatePicker />`                   | Custom date picker                      |
| Modal / drawer   | `<Dialog>`, `<Sheet>`                               | Custom overlay                          |
| Tooltip / popover| `<Tooltip />`, `<Popover />`                        | Custom floating UI                      |
| Data table       | `<Table />` + `TablePagination`                     | Raw `<table>` + custom pagination       |
| Loading          | `<Skeleton />`, `<LinearProgress />`                | Custom shimmer divs                     |
| Status chip      | `<Badge />`                                         | Custom badge spans                      |
| Divider          | `<Separator />`                                   | `<hr>`                                  |

## Variants

**Typography:** `heading-xl`, `heading-lg`, `heading-md`, `heading-sm`, `body-lg`, `body-md`, `body-sm`, `body-xs` — plus `color` and `weight` props.

**Button:** `primary`, `gradient`, `secondary-gray`, `secondary-color`, `tertiary-gray`, `tertiary-color`, `link`, `link-gray`, `destructive-primary`, `destructive-secondary`, `destructive-tertiary`, `destructive-link` — sizes: `xs`–`xl`.

**Icons:** Use `iconsax-reactjs` — pass via `startIcon`/`endIcon` on `Button`, `leadingElement`/`trailingElement` on `Input`.

```tsx
// ✅ GOOD
<Typography variant="heading-md">Orders</Typography>
<Button variant="primary" size="md">Confirm</Button>
<DebouncedInput placeholder="Search..." onChange={setQuery} />

// ❌ BAD
<h3 className="text-lg font-semibold">Orders</h3>
<button className="bg-black text-white px-4 py-2">Confirm</button>
<input className="border rounded" onChange={...} />
```

> When unsure whether a component already exists — check `src/shared/components/index.ts` before creating a new one.
