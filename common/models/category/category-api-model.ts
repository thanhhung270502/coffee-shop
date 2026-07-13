import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  ListCategoriesPayload,
  ListCategoriesResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "./category-model";

export const API_ADMIN_CATEGORIES: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/categories/list",
  requestBody: {} as ListCategoriesPayload,
  responseBody: {} as ListCategoriesResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/categories/list`,
};

export const API_ADMIN_CATEGORY_CREATE: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/categories",
  requestBody: {} as CreateCategoryRequest,
  responseBody: {} as CreateCategoryResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/categories`,
};

export const API_ADMIN_CATEGORY_BY_ID: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/categories/[id]",
  requestBody: {} as UpdateCategoryRequest,
  responseBody: {} as UpdateCategoryResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/categories/${id}`,
};

export const API_ADMIN_CATEGORY_DELETE: APIDefinition = {
  method: APIMethod.DELETE,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/categories/[id]",
  requestBody: {} as Record<string, never>,
  responseBody: {} as DeleteCategoryResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/categories/${id}`,
};
