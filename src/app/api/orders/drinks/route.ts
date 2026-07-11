import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { getSessionUser } from "@/libs/auth/session";
import { AppError } from "@/libs/errors";
import { createDrinkOrderSchema } from "@/server/order/order.schema";
import { createDrinkOrderService } from "@/server/order/order.service";

export async function POST(request: Request) {
  try {
    const input = createDrinkOrderSchema.parse(await request.json());
    const user = await getSessionUser();
    const order = await createDrinkOrderService(input, user?.id);
    return jsonOk({ order });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/orders/drinks failed", error);
    return jsonError("Internal server error", 500);
  }
}
