import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateDrinkSchema } from "@/server/product/product.schema";
import { getDrinkById, updateDrinkService } from "@/server/product/product.service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const drink = await getDrinkById(id);
    return jsonOk({ drink });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/drinks/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = updateDrinkSchema.parse(await request.json());
    const drink = await updateDrinkService(id, input);
    return jsonOk({ drink });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/drinks/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}
