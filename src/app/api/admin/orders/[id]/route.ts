import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateOrderStatusSchema } from "@/server/order/order.schema";
import { getOrderById, updateOrderStatusService } from "@/server/order/order.service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const order = await getOrderById(id);
    return jsonOk({ order });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/orders/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = updateOrderStatusSchema.parse(await request.json());
    const order = await updateOrderStatusService(id, input);
    return jsonOk({ order });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/orders/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}
