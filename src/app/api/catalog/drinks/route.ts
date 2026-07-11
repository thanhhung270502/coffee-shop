import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listPublicDrinks } from "@/server/product/product.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug") ?? undefined;
    const drinks = await listPublicDrinks(categorySlug);
    return jsonOk({ drinks });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/catalog/drinks failed", error);
    return jsonError("Internal server error", 500);
  }
}
