import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listCustomerOrdersService } from "@/server/order/order.service";

export async function GET() {
  try {
    const user = await requireRole(["CUSTOMER"]);
    const orders = await listCustomerOrdersService(user.id);
    return jsonOk({ orders });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/orders/mine failed", error);
    return jsonError("Internal server error", 500);
  }
}
