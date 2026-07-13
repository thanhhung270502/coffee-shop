import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type {
  CreateStaffRequest,
  CreateStaffResponse,
  ListStaffPayload,
  ListStaffResponse,
  ResetStaffPasswordRequest,
  ResetStaffPasswordResponse,
  UpdateStaffRequest,
  UpdateStaffResponse,
} from "./staff-model";

export const API_ADMIN_STAFF: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/staff/list",
  requestBody: {} as ListStaffPayload,
  responseBody: {} as ListStaffResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/staff/list`,
};

export const API_ADMIN_STAFF_CREATE: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/staff",
  requestBody: {} as CreateStaffRequest,
  responseBody: {} as CreateStaffResponse,
  buildUrlPath: () => `${APIBaseRoutes.ADMIN}/staff`,
};

export const API_ADMIN_STAFF_BY_ID: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/staff/[id]",
  requestBody: {} as UpdateStaffRequest,
  responseBody: {} as UpdateStaffResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/staff/${id}`,
};

export const API_ADMIN_STAFF_RESET_PASSWORD: APIDefinition = {
  method: APIMethod.PATCH,
  baseUrl: APIBaseRoutes.ADMIN,
  subUrl: "/staff/[id]/reset-password",
  requestBody: {} as ResetStaffPasswordRequest,
  responseBody: {} as ResetStaffPasswordResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ADMIN}/staff/${id}/reset-password`,
};
