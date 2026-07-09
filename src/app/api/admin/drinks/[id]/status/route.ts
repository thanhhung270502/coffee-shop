import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateDrinkStatusSchema } from "@/server/product/product.schema";
import { updateDrinkStatusService } from "@/server/product/product.service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = updateDrinkStatusSchema.parse(await request.json());
    const drink = await updateDrinkStatusService(id, input.isActive);
    return jsonOk({ drink });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/drinks/[id]/status failed", error);
    return jsonError("Internal server error", 500);
  }
}
