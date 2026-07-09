import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type {
  GetShopSettingsResponse,
  UpdateShopSettingsRequest,
  UpdateShopSettingsResponse,
} from "./settings-model";

export const API_ADMIN_SETTINGS: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/settings",
  requestBody: {} as Record<string, never>,
  responseBody: {} as GetShopSettingsResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/settings`,
};

export const API_ADMIN_SETTINGS_UPDATE: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/settings",
  requestBody: {} as UpdateShopSettingsRequest,
  responseBody: {} as UpdateShopSettingsResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/settings`,
};
