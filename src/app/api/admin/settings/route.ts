import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateSettingsSchema } from "@/server/settings/settings.schema";
import { getSettingsService, updateSettingsService } from "@/server/settings/settings.service";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const settings = await getSettingsService();
    return jsonOk({ settings });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/settings failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = updateSettingsSchema.parse(await request.json());
    const settings = await updateSettingsService(input);
    return jsonOk({ settings });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/settings failed", error);
    return jsonError("Internal server error", 500);
  }
}
