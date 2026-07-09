import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateToppingSchema } from "@/server/topping/topping.schema";
import {
  deleteToppingService,
  updateToppingService,
} from "@/server/topping/topping.service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = updateToppingSchema.parse(await request.json());
    const topping = await updateToppingService(id, input);
    return jsonOk({ topping });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/toppings/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const result = await deleteToppingService(id);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("DELETE /api/admin/toppings/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}
