import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type {
  CreateDrinkRequest,
  CreateDrinkResponse,
  CreatePackagedProductRequest,
  CreatePackagedProductResponse,
  GetDrinkResponse,
  GetPackagedProductResponse,
  ListDrinksPayload,
  ListDrinksResponse,
  ListPackagedProductsPayload,
  ListPackagedProductsResponse,
  UpdateDrinkRequest,
  UpdateDrinkResponse,
  UpdateDrinkStatusRequest,
  UpdateDrinkStatusResponse,
  UpdatePackagedProductRequest,
  UpdatePackagedProductResponse,
  UpdateProductStockRequest,
  UpdateProductStockResponse,
} from "./product-model";

export const API_ADMIN_DRINKS: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/drinks/list",
  requestBody: {} as ListDrinksPayload,
  responseBody: {} as ListDrinksResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/drinks/list`,
};

export const API_ADMIN_DRINK_CREATE: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/drinks",
  requestBody: {} as CreateDrinkRequest,
  responseBody: {} as CreateDrinkResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/drinks`,
};

export const API_ADMIN_DRINK_BY_ID: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/drinks/[id]",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetDrinkResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/drinks/${id}`,
};

export const API_ADMIN_DRINK_UPDATE: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/drinks/[id]",
  requestBody: {} as UpdateDrinkRequest,
  responseBody: {} as UpdateDrinkResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/drinks/${id}`,
};

export const API_ADMIN_DRINK_STATUS: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/drinks/[id]/status",
  requestBody: {} as UpdateDrinkStatusRequest,
  responseBody: {} as UpdateDrinkStatusResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/drinks/${id}/status`,
};

export const API_ADMIN_PRODUCTS: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/products/list",
  requestBody: {} as ListPackagedProductsPayload,
  responseBody: {} as ListPackagedProductsResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/products/list`,
};

export const API_ADMIN_PRODUCT_CREATE: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/products",
  requestBody: {} as CreatePackagedProductRequest,
  responseBody: {} as CreatePackagedProductResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/products`,
};

export const API_ADMIN_PRODUCT_BY_ID: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/products/[id]",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetPackagedProductResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/products/${id}`,
};

export const API_ADMIN_PRODUCT_UPDATE: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/products/[id]",
  requestBody: {} as UpdatePackagedProductRequest,
  responseBody: {} as UpdatePackagedProductResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/products/${id}`,
};

export const API_ADMIN_PRODUCT_STOCK: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/products/[id]/stock",
  requestBody: {} as UpdateProductStockRequest,
  responseBody: {} as UpdateProductStockResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/products/${id}/stock`,
};
