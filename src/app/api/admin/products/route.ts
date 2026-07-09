import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { createPackagedProductSchema } from "@/server/product/product.schema";
import { createPackagedProductService, listPackagedProducts } from "@/server/product/product.service";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const products = await listPackagedProducts({ categoryId, search });
    return jsonOk({ products });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/products failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = createPackagedProductSchema.parse(await request.json());
    const product = await createPackagedProductService(input);
    return jsonOk({ product });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/products failed", error);
    return jsonError("Internal server error", 500);
  }
}
