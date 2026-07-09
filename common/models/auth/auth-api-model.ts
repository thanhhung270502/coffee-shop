import { APIBaseRoutes, type APIDefinition,APIMethod } from "../api-base";

import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth-model";

export const API_REGISTER: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/register",
  requestBody: {} as RegisterRequest,
  responseBody: {} as RegisterResponse,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/register`,
};

export const API_LOGIN: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/login",
  requestBody: {} as LoginRequest,
  responseBody: {} as LoginResponse,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/login`,
};

export const API_LOGOUT: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/logout",
  requestBody: {} as Record<string, never>,
  responseBody: {} as LogoutResponse,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/logout`,
};

export const API_ME: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/me",
  requestBody: {} as Record<string, never>,
  responseBody: {} as MeResponse,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/me`,
};
