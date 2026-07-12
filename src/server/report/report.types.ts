export type RevenuePoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type TopProductItem = {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
};

export type GroupBy = "day" | "week" | "month";
