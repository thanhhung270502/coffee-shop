import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { revenueQuerySchema } from "@/server/report/report.schema";
import { getRevenueSeriesService } from "@/server/report/report.service";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const input = revenueQuerySchema.parse({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      groupBy: searchParams.get("groupBy") ?? undefined,
    });
    const result = await getRevenueSeriesService(input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/reports/revenue failed", error);
    return jsonError("Internal server error", 500);
  }
}
