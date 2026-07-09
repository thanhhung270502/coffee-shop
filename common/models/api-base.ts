export enum APIMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const APIBaseRoutes = {
  AUTH: "/api/auth",
} as const;

export type APIDefinition = {
  method: APIMethod;
  baseUrl: string;
  subUrl: string;
  requestBody: unknown;
  responseBody: unknown;
  buildUrlPath: (...args: string[]) => string;
};
