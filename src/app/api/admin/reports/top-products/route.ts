import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { topProductsQuerySchema } from "@/server/report/report.schema";
import { getTopProductsReportService } from "@/server/report/report.service";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const input = topProductsQuerySchema.parse({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    const result = await getTopProductsReportService(input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/reports/top-products failed", error);
    return jsonError("Internal server error", 500);
  }
}
