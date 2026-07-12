import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listOrdersSchema } from "@/server/order/order.schema";
import { listOrders } from "@/server/order/order.service";

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = listOrdersSchema.parse(await request.json());
    const result = await listOrders(input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/orders failed", error);
    return jsonError("Internal server error", 500);
  }
}
