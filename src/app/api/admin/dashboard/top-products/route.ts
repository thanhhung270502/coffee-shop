import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { getDashboardTopProducts } from "@/server/order/order.service";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const products = await getDashboardTopProducts();
    return jsonOk({ products });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/dashboard/top-products failed", error);
    return jsonError("Internal server error", 500);
  }
}
