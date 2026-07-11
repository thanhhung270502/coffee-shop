import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type {
  CreateDrinkOrderRequest,
  CreateDrinkOrderResponse,
  CreateProductOrderRequest,
  CreateProductOrderResponse,
  GetOrderResponse,
  GetPublicOrderResponse,
  ListCustomerOrdersResponse,
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

export const API_CREATE_DRINK_ORDER: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ORDERS,
  subUrl: "/drinks",
  requestBody: {} as CreateDrinkOrderRequest,
  responseBody: {} as CreateDrinkOrderResponse,
  buildUrlPath: () => `${APIBaseRoutes.ORDERS}/drinks`,
};

export const API_CREATE_PRODUCT_ORDER: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ORDERS,
  subUrl: "/products",
  requestBody: {} as CreateProductOrderRequest,
  responseBody: {} as CreateProductOrderResponse,
  buildUrlPath: () => `${APIBaseRoutes.ORDERS}/products`,
};

export const API_PUBLIC_ORDER: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ORDERS,
  subUrl: "/[id]/public",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetPublicOrderResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ORDERS}/${id}/public`,
};

export const API_CUSTOMER_ORDERS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ORDERS,
  subUrl: "/mine",
  requestBody: {} as Record<string, never>,
  responseBody: {} as ListCustomerOrdersResponse,
  buildUrlPath: () => `${APIBaseRoutes.ORDERS}/mine`,
};
