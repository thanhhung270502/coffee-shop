import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updatePackagedProductSchema } from "@/server/product/product.schema";
import {
  getPackagedProductById,
  updatePackagedProductService,
} from "@/server/product/product.service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const product = await getPackagedProductById(id);
    return jsonOk({ product });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/products/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = updatePackagedProductSchema.parse(await request.json());
    const product = await updatePackagedProductService(id, input);
    return jsonOk({ product });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/products/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}
