import { first } from "lodash-es";

import { ClientRoutePatterns } from "../constants/routes.constant";
import type { RouteKey } from "../enums";

export const compileRoutePattern = (route: string) => {
  const compiled = route.replace(/:[^/]+/g, "[^/]+");
  return new RegExp(`^${compiled}$`);
};

export const generateRoutePatterns = (route: Record<string, string>): Record<string, RegExp> => {
  return Object.fromEntries(
    Object.entries(route).map(([key, value]) => [key, compileRoutePattern(value)])
  );
};

export const getDetailRoute = (route: string, id: string) => {
  // Check if the route contains dynamic segments (e.g., :id, :contactId)
  if (!/:[^/]+/.test(route)) {
    throw new Error(`Route "${route}" does not contain any dynamic segments for detail view`);
  }
  return route.replace(/:[^/]+/g, id);
};

export const getRouteKey = (pathname: string): RouteKey => {
  const route = Object.entries(ClientRoutePatterns).find(([, value]) => value.test(pathname));
  return first(route) as RouteKey;
};

// export const isDetailRoute = (pathname: string): boolean => {
//   const routeKey = getRouteKey(pathname);
//   if (!routeKey) return false;
//   return ClientRouteDetailKeys.includes(routeKey);
// };

export const getMainRoute = (pathname: string): string => {
  const pathnameParts = pathname.split("/").filter(Boolean);
  return pathnameParts[0] ? `/${pathnameParts[0]}` : "/";
};
