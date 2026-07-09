import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type {
  CreateToppingRequest,
  CreateToppingResponse,
  DeleteToppingResponse,
  ListToppingsResponse,
  UpdateToppingRequest,
  UpdateToppingResponse,
} from "./topping-model";

export const API_ADMIN_TOPPINGS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/toppings",
  requestBody: {} as Record<string, never>,
  responseBody: {} as ListToppingsResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/toppings`,
};

export const API_ADMIN_TOPPING_CREATE: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/toppings",
  requestBody: {} as CreateToppingRequest,
  responseBody: {} as CreateToppingResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/toppings`,
};

export const API_ADMIN_TOPPING_BY_ID: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/toppings/[id]",
  requestBody: {} as UpdateToppingRequest,
  responseBody: {} as UpdateToppingResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/toppings/${id}`,
};

export const API_ADMIN_TOPPING_DELETE: APIDefinition = {
  method: APIMethod.DELETE,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/toppings/[id]",
  requestBody: {} as Record<string, never>,
  responseBody: {} as DeleteToppingResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/toppings/${id}`,
};
