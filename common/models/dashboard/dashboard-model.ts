import type { OrderObject } from "../order/order-model";

export type DashboardStatsResponse = {
  revenueToday: number;
  ordersToday: number;
  pendingOrders: number;
  recentOrders: OrderObject[];
};

export type DashboardTopProductsResponse = {
  products: {
    productId: string;
    productName: string;
    quantitySold: number;
  }[];
};
