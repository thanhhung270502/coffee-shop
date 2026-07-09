import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { createStaffSchema } from "@/server/staff/staff.schema";
import { createStaffService, listStaff } from "@/server/staff/staff.service";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const staff = await listStaff();
    return jsonOk({ staff });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/staff failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = createStaffSchema.parse(await request.json());
    const staff = await createStaffService(input);
    return jsonOk({ staff });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/staff failed", error);
    return jsonError("Internal server error", 500);
  }
}
