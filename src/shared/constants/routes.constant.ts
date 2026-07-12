import { RouteKey } from "../enums";
import { generateRoutePatterns } from "../utils/routes.util";

// V1 Base URL - Production only
export const V1_BASE_URL = "https://app.joinreviva.com";

// V1 Routes for Coming Soon pages
export const ClientV1Routes = {
  UsersSettings: `${V1_BASE_URL}/settings/users`,
  BookingBuilderSettings: `${V1_BASE_URL}/settings/booking-builder`,
  PackagesSettings: `${V1_BASE_URL}/settings/packages`,
  PackageBuilderSettings: `${V1_BASE_URL}/settings/packages/new`,
  PackageDetailSettings: (packageId: string) => `${V1_BASE_URL}/settings/packages/${packageId}`,
  PackageEditSettings: (packageId: string) => `${V1_BASE_URL}/settings/packages/${packageId}/edit`,
  MembershipBuilderSettings: `${V1_BASE_URL}/settings/memberships/builder`,
  WorkflowsSettings: `${V1_BASE_URL}/settings/automatic-messages`,
};

export const ClientRoutes: Record<RouteKey, string> = {
  [RouteKey.AdminDashboard]: "/admin",
  [RouteKey.AdminCategories]: "/admin/categories",
  [RouteKey.AdminDrinks]: "/admin/drinks",
  [RouteKey.AdminPackagedProducts]: "/admin/products",
  [RouteKey.AdminReports]: "/admin/reports",
  [RouteKey.AdminStaff]: "/admin/staff",
  [RouteKey.AdminSettings]: "/admin/settings",

  // Admin Order pages
  [RouteKey.AdminOrders]: "/admin/orders",
  [RouteKey.AdminOrderDetail]: "/admin/orders/:id",
};

export const ClientRoutePatterns = generateRoutePatterns(ClientRoutes);
