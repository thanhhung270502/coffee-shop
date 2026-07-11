import { ZodError } from "zod";

import type { ProductType } from "@/generated/prisma";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listPublicCategories } from "@/server/category/category.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as ProductType | null;
    const categories = await listPublicCategories(type ?? undefined);
    return jsonOk({ categories });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/catalog/categories failed", error);
    return jsonError("Internal server error", 500);
  }
}
