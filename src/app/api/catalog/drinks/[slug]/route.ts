import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { getPublicDrinkBySlug } from "@/server/product/product.service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const drink = await getPublicDrinkBySlug(slug);
    return jsonOk({ drink });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/catalog/drinks/[slug] failed", error);
    return jsonError("Internal server error", 500);
  }
}
