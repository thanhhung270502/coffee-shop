import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listCategoriesSchema } from "@/server/category/category.schema";
import { listCategories } from "@/server/category/category.service";

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = listCategoriesSchema.parse(await request.json());
    const result = await listCategories(input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/categories/list failed", error);
    return jsonError("Internal server error", 500);
  }
}
