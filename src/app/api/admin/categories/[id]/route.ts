import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateCategorySchema } from "@/server/category/category.schema";
import {
  deleteCategoryService,
  updateCategoryService,
} from "@/server/category/category.service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = updateCategorySchema.parse(await request.json());
    const category = await updateCategoryService(id, input);
    return jsonOk({ category });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/categories/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const result = await deleteCategoryService(id);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("DELETE /api/admin/categories/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}
