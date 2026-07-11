import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listPublicCategories } from "@/server/category/category.service";
import { listPublicDrinks } from "@/server/product/product.service";

export async function GET() {
  try {
    await requireRole(["ADMIN", "STAFF"]);
    const [categories, drinks] = await Promise.all([
      listPublicCategories("DRINK"),
      listPublicDrinks(),
    ]);
    return jsonOk({ categories, drinks });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/pos/catalog failed", error);
    return jsonError("Internal server error", 500);
  }
}
