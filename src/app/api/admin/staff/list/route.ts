import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listStaffSchema } from "@/server/staff/staff.schema";
import { listStaff } from "@/server/staff/staff.service";

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = listStaffSchema.parse(await request.json());
    const result = await listStaff(input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/staff/list failed", error);
    return jsonError("Internal server error", 500);
  }
}
