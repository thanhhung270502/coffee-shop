import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { createDrinkSchema } from "@/server/product/product.schema";
import { createDrinkService, listDrinks } from "@/server/product/product.service";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const drinks = await listDrinks({ categoryId, search });
    return jsonOk({ drinks });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/drinks failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = createDrinkSchema.parse(await request.json());
    const drink = await createDrinkService(input);
    return jsonOk({ drink });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/drinks failed", error);
    return jsonError("Internal server error", 500);
  }
}
