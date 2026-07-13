import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listDrinksSchema } from "@/server/product/product.schema";
import { listDrinks } from "@/server/product/product.service";

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = listDrinksSchema.parse(await request.json());
    const result = await listDrinks(input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/drinks/list failed", error);
    return jsonError("Internal server error", 500);
  }
}
