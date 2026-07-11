import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateOrderStatusSchema } from "@/server/order/order.schema";
import { updatePosOrderStatusService } from "@/server/order/order.service";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(["ADMIN", "STAFF"]);
    const { id } = await context.params;
    const input = updateOrderStatusSchema.parse(await request.json());
    const order = await updatePosOrderStatusService(id, input);
    return jsonOk({ order });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error(`PATCH /api/pos/orders/${String(context)}/status failed`, error);
    return jsonError("Internal server error", 500);
  }
}
