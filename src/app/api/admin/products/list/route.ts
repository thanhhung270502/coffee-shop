import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listPackagedProductsSchema } from "@/server/product/product.schema";
import { listPackagedProducts } from "@/server/product/product.service";

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = listPackagedProductsSchema.parse(await request.json());
    const result = await listPackagedProducts(input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/products/list failed", error);
    return jsonError("Internal server error", 500);
  }
}
