import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type {
  CreatePosOrderRequest,
  CreatePosOrderResponse,
  GetPosReceiptResponse,
  ListPosQueueResponse,
  POSCatalogResponse,
  UpdatePosOrderStatusRequest,
  UpdatePosOrderStatusResponse,
} from "./pos-model";

export const API_POS_CATALOG: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.POS,
  subUrl: "/catalog",
  requestBody: {} as Record<string, never>,
  responseBody: {} as POSCatalogResponse,
  buildUrlPath: () => `${APIBaseRoutes.POS}/catalog`,
};

export const API_POS_CREATE_ORDER: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.POS,
  subUrl: "/orders",
  requestBody: {} as CreatePosOrderRequest,
  responseBody: {} as CreatePosOrderResponse,
  buildUrlPath: () => `${APIBaseRoutes.POS}/orders`,
};

export const API_POS_QUEUE: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.POS,
  subUrl: "/queue",
  requestBody: {} as Record<string, never>,
  responseBody: {} as ListPosQueueResponse,
  buildUrlPath: () => `${APIBaseRoutes.POS}/queue`,
};

export const API_POS_UPDATE_ORDER_STATUS: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.POS,
  subUrl: "/orders/[id]/status",
  requestBody: {} as UpdatePosOrderStatusRequest,
  responseBody: {} as UpdatePosOrderStatusResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.POS}/orders/${id}/status`,
};

export const API_POS_RECEIPT: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.POS,
  subUrl: "/orders/[id]/receipt",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetPosReceiptResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.POS}/orders/${id}/receipt`,
};
