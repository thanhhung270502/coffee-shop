import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";
import type { GetShopSettingsResponse } from "../settings/settings-model";

import type {
  GetPublicDrinkResponse,
  GetPublicProductResponse,
  ListPublicCategoriesResponse,
  ListPublicDrinksResponse,
  ListPublicProductsResponse,
} from "./catalog-model";

export const API_CATALOG_CATEGORIES: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.CATALOG,
  subUrl: "/categories",
  requestBody: {} as Record<string, never>,
  responseBody: {} as ListPublicCategoriesResponse,
  buildUrlPath: () => `${APIBaseRoutes.CATALOG}/categories`,
};

export const API_CATALOG_DRINKS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.CATALOG,
  subUrl: "/drinks",
  requestBody: {} as Record<string, never>,
  responseBody: {} as ListPublicDrinksResponse,
  buildUrlPath: () => `${APIBaseRoutes.CATALOG}/drinks`,
};

export const API_CATALOG_DRINK_DETAIL: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.CATALOG,
  subUrl: "/drinks/[slug]",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetPublicDrinkResponse,
  buildUrlPath: (slug: string) => `${APIBaseRoutes.CATALOG}/drinks/${slug}`,
};

export const API_CATALOG_PRODUCTS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.CATALOG,
  subUrl: "/products",
  requestBody: {} as Record<string, never>,
  responseBody: {} as ListPublicProductsResponse,
  buildUrlPath: () => `${APIBaseRoutes.CATALOG}/products`,
};

export const API_CATALOG_PRODUCT_DETAIL: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.CATALOG,
  subUrl: "/products/[slug]",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetPublicProductResponse,
  buildUrlPath: (slug: string) => `${APIBaseRoutes.CATALOG}/products/${slug}`,
};

export const API_SHOP_SETTINGS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.SHOP,
  subUrl: "/settings",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetShopSettingsResponse,
  buildUrlPath: () => `${APIBaseRoutes.SHOP}/settings`,
};
