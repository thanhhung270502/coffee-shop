import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { getDashboardStats } from "@/server/order/order.service";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const stats = await getDashboardStats();
    return jsonOk(stats);
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/dashboard/stats failed", error);
    return jsonError("Internal server error", 500);
  }
}
