import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { getPosQueueService } from "@/server/order/order.service";

export async function GET() {
  try {
    await requireRole(["ADMIN", "STAFF"]);
    const orders = await getPosQueueService();
    return jsonOk({ orders });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/pos/queue failed", error);
    return jsonError("Internal server error", 500);
  }
}
