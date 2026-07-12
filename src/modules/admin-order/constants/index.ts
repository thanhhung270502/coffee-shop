export const FILTER_TABS = [
  { label: "All", filters: {} },
  { label: "Drinks", filters: { type: "DRINK_ORDER" } },
  { label: "Products", filters: { type: "PRODUCT_ORDER" } },
  { label: "Online", filters: { channel: "ONLINE" } },
  { label: "POS", filters: { channel: "POS" } },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
