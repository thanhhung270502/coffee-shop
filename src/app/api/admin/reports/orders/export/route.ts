import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { exportOrdersQuerySchema } from "@/server/report/report.schema";
import { exportOrdersCsvService } from "@/server/report/report.service";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const input = exportOrdersQuerySchema.parse({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
    });
    const csv = await exportOrdersCsvService(input);
    const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/reports/orders/export failed", error);
    return jsonError("Internal server error", 500);
  }
}
