export enum APIMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const APIBaseRoutes = {
  AUTH: "/api/auth",
  ADMIN: "/api/admin",
  CATALOG: "/api/catalog",
  ORDERS: "/api/orders",
  SHOP: "/api/shop",
} as const;

export type APIDefinition = {
  method: APIMethod;
  baseUrl: string;
  subUrl: string;
  requestBody: unknown;
  responseBody: unknown;
  buildUrlPath: (...args: string[]) => string;
};
