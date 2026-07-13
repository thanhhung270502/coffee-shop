/** Report Group By */
export type EReportGroupBy = "day" | "week" | "month";

/** Revenue Series */
export type RevenuePoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type RevenueSeriesResponse = {
  series: RevenuePoint[];
};

/** Top Products */
export type TopProductReportItem = {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
};

export type TopProductsReportResponse = {
  products: TopProductReportItem[];
};
