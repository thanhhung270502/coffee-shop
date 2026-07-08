import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { registerSchema } from "@/server/auth/auth.schema";
import { registerUser } from "@/server/auth/auth.service";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const result = await registerUser(input);
    return jsonOk(result, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(error);
    }

    if (error instanceof AppError) {
      return jsonError(error.message, error.statusCode);
    }

    console.error("POST /api/auth/register failed", error);
    return jsonError("Internal server error", 500);
  }
}
