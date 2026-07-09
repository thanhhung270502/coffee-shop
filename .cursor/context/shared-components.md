# Shared UI Components

Use shared primitives from `@/shared/components` by default. Do not build ad-hoc UI inside feature modules when equivalent shared components exist.

## Import

```tsx
import { Button, Typography, Input, Table } from "@/shared/components";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/dialog";
```

## Available component groups

| Group | Components |
| ----- | ---------- |
| Typography & layout | `Typography`, `Card`, `Separator`, `Skeleton`, `LinearProgress` |
| Actions | `Button` |
| Forms | `Input`, `Textarea`, `DebouncedInput`, `Checkbox`, `Radio`, `RadioGroup`, `Select`, `DateInput`, `DatePicker`, `DateRangeInput`, `Toggle`, `ToggleGroup` |
| Overlays | `Dialog`, `Sheet`, `Popover`, `Tooltip`, `Collapsible` |
| Data display | `Badge`, `Table`, `TableFooter`, `TablePagination`, `SortDirectionIcon` |
| RHF wrappers | `RHFInput`, `RHFTextarea`, `RHFCheckbox`, `RHFCheckboxGroup`, `RHFRadio`, `RHFRadioGroup`, `RHFSelect`, `RHFDebounceInput`, `RHFDateInput`, `RHFDateRangeInput`, `RHFToggle` |

> Source of truth: `src/shared/components/index.ts`

## Mapping: use shared instead of native

| Need | Use | Avoid |
| ---- | --- | ----- |
| Text/headings | `<Typography />` | raw `<p>`, `<h1>...<h6>` |
| Buttons | `<Button />` | raw `<button>` |
| Input | `<Input />`, `<Textarea />` | raw `<input>`, `<textarea>` |
| Selector | `<Select />`, `<Toggle />`, `<ToggleGroup />` | custom selectors |
| Modal/Drawer | `<Dialog />`, `<Sheet />` | custom overlays |
| Table | `<Table />` + pagination components | raw `<table>` implementation |
| Status chip | `<Badge />` | custom badge spans |

## Form pattern

For multi-field forms, use React Hook Form + Zod:

1. Schema + inferred type in hook (`z.infer`)
2. `useForm` + `zodResolver`
3. Shared `FormProvider` (`src/shared/providers/form.provider.tsx`)
4. `RHF*` components from `@/shared/components`

## Copy and language requirement

All user-facing text rendered by components must be English:

- labels, placeholders, button text
- table headers and empty states
- dialog titles/descriptions
- aria labels and tooltips

```tsx
// ✅ GOOD
<Typography variant="heading-md">Orders</Typography>
<Button variant="primary">Add Category</Button>
<Input label="Category Name" placeholder="Enter category name" />

// ❌ BAD
<Typography variant="heading-md">Đơn hàng</Typography>
<Button variant="primary">Thêm danh mục</Button>
<input placeholder="Nhập tên danh mục" />
```
