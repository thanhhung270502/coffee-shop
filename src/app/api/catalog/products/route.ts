import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listPublicProducts } from "@/server/product/product.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug") ?? undefined;
    const products = await listPublicProducts(categorySlug);
    return jsonOk({ products });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/catalog/products failed", error);
    return jsonError("Internal server error", 500);
  }
}
