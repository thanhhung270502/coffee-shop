import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { updateStaffSchema } from "@/server/staff/staff.schema";
import { updateStaffService } from "@/server/staff/staff.service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = updateStaffSchema.parse(await request.json());
    const staff = await updateStaffService(id, input);
    return jsonOk({ staff });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/staff/[id] failed", error);
    return jsonError("Internal server error", 500);
  }
}
