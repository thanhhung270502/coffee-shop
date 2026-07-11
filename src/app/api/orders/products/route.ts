import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { getSessionUser } from "@/libs/auth/session";
import { AppError } from "@/libs/errors";
import { createProductOrderSchema } from "@/server/order/order.schema";
import { createProductOrderService } from "@/server/order/order.service";

export async function POST(request: Request) {
  try {
    const input = createProductOrderSchema.parse(await request.json());
    const user = await getSessionUser();
    const order = await createProductOrderService(input, user?.id);
    return jsonOk({ order });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/orders/products failed", error);
    return jsonError("Internal server error", 500);
  }
}
