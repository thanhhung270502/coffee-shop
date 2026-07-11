import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { getSettingsService } from "@/server/settings/settings.service";

export async function GET() {
  try {
    const settings = await getSettingsService();
    return jsonOk({ settings });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/shop/settings failed", error);
    return jsonError("Internal server error", 500);
  }
}
