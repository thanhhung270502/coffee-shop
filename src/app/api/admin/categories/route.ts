import { ZodError } from "zod";

import type { ProductType } from "@/generated/prisma";
import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { createCategorySchema } from "@/server/category/category.schema";
import { createCategoryService, listCategories } from "@/server/category/category.service";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as ProductType | null;
    const categories = await listCategories(type ?? undefined);
    return jsonOk({ categories });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/categories failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = createCategorySchema.parse(await request.json());
    const category = await createCategoryService(input);
    return jsonOk({ category });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/categories failed", error);
    return jsonError("Internal server error", 500);
  }
}
