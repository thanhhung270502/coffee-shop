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
  POS: "/api/pos",
} as const;

export type APIDefinition = {
  method: APIMethod;
  baseUrl: string;
  subUrl: string;
  requestBody: unknown;
  responseBody: unknown;
  buildUrlPath: (...args: string[]) => string;
};

export interface PaginationQueryParams {
  limit: number;
  offset: number;
}

export interface PageableResponse<T> {
  total_record: number;
  data: T[];
}
