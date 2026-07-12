import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type { RevenueSeriesResponse, TopProductsReportResponse } from "./report-model";

export const API_ADMIN_REVENUE: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/reports/revenue",
  requestBody: {} as Record<string, never>,
  responseBody: {} as RevenueSeriesResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/reports/revenue`,
};

export const API_ADMIN_REPORT_TOP_PRODUCTS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/reports/top-products",
  requestBody: {} as Record<string, never>,
  responseBody: {} as TopProductsReportResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/reports/top-products`,
};

export const API_ADMIN_EXPORT_ORDERS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/reports/orders/export",
  requestBody: {} as Record<string, never>,
  responseBody: {} as Record<string, never>,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/reports/orders/export`,
};
