import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { resetStaffPasswordSchema } from "@/server/staff/staff.schema";
import { resetStaffPasswordService } from "@/server/staff/staff.service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(["ADMIN"]);
    const { id } = await context.params;
    const input = resetStaffPasswordSchema.parse(await request.json());
    const result = await resetStaffPasswordService(id, input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("PATCH /api/admin/staff/[id]/reset-password failed", error);
    return jsonError("Internal server error", 500);
  }
}
