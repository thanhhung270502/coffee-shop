import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type { DashboardStatsResponse, DashboardTopProductsResponse } from "./dashboard-model";

export const API_ADMIN_DASHBOARD_STATS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/dashboard/stats",
  requestBody: {} as Record<string, never>,
  responseBody: {} as DashboardStatsResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/dashboard/stats`,
};

export const API_ADMIN_DASHBOARD_TOP_PRODUCTS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/dashboard/top-products",
  requestBody: {} as Record<string, never>,
  responseBody: {} as DashboardTopProductsResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/dashboard/top-products`,
};
