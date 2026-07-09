import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type {
  GetOrderResponse,
  ListOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "./order-model";

export const API_ADMIN_ORDERS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/orders",
  requestBody: {} as Record<string, never>,
  responseBody: {} as ListOrdersResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/orders`,
};

export const API_ADMIN_ORDER_BY_ID: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/orders/[id]",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetOrderResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/orders/${id}`,
};

export const API_ADMIN_ORDER_STATUS: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/orders/[id]",
  requestBody: {} as UpdateOrderStatusRequest,
  responseBody: {} as UpdateOrderStatusResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/orders/${id}`,
};
