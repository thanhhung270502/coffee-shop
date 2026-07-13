import type { EReportGroupBy } from "@common/models/report";

import { toYYYYMMDD } from "@/shared/utils/date.util";

function getDefaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return { from: toYYYYMMDD(from), to: toYYYYMMDD(to) };
}

export const DEFAULT_DATE_RANGE = getDefaultRange();

export const DEFAULT_GROUP_BY: EReportGroupBy = "day";

export const TOP_PRODUCTS_LIMIT = 10;

export const GROUP_BY_OPTIONS: { label: string; value: EReportGroupBy }[] = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
];
