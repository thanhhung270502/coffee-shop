import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateProductStockSchema } from "@/server/product/product.schema";
import { updateProductStockService } from "@/server/product/product.service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = updateProductStockSchema.parse(await request.json());
    const product = await updateProductStockService(id, input);
    return jsonOk({ product });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/products/[id]/stock failed", error);
    return jsonError("Internal server error", 500);
  }
}
