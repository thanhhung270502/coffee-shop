import { jsonError, jsonOk } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { getCurrentUser } from "@/server/auth/auth.service";

export async function GET() {
  try {
    const result = await getCurrentUser();
    return jsonOk(result);
  } catch (error) {
    if (error instanceof AppError) {
      return jsonError(error.message, error.statusCode);
    }

    console.error("GET /api/auth/me failed", error);
    return jsonError("Internal server error", 500);
  }
}
