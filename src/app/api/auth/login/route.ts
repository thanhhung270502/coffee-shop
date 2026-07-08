import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { loginSchema } from "@/server/auth/auth.schema";
import { loginUser } from "@/server/auth/auth.service";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const result = await loginUser(input);
    return jsonOk(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(error);
    }

    if (error instanceof AppError) {
      return jsonError(error.message, error.statusCode);
    }

    console.error("POST /api/auth/login failed", error);
    return jsonError("Internal server error", 500);
  }
}
