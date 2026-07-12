import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { rateLimit } from "@/libs/rate-limit";
import { loginSchema } from "@/server/auth/auth.schema";
import { loginUser } from "@/server/auth/auth.service";

export async function POST(request: Request) {
  try {
    await rateLimit(request, "auth:login", { requests: 5, window: "15 m" });
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
