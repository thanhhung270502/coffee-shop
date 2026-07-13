import { toYYYYMMDD } from "@/shared/utils/date.util";

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const TOP_PRODUCTS_LIMIT = 5;

export const REVENUE_CHART_DAYS = 7;

export function getLast7DaysRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (REVENUE_CHART_DAYS - 1));
  return {
    from: toYYYYMMDD(from),
    to: toYYYYMMDD(to),
  };
}
