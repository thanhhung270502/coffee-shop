import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { createPosOrderSchema } from "@/server/order/order.schema";
import { createPosOrderService } from "@/server/order/order.service";

export async function POST(request: Request) {
  try {
    const staff = await requireRole(["ADMIN", "STAFF"]);
    const input = createPosOrderSchema.parse(await request.json());
    const order = await createPosOrderService(input, staff.id);
    return jsonOk({ order });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/pos/orders failed", error);
    return jsonError("Internal server error", 500);
  }
}
