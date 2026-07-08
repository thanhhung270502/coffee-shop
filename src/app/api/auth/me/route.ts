import { getSessionUser } from "@/libs/auth";
import { jsonError, jsonOk } from "@/libs/auth/http";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    return jsonOk({ user });
  } catch (error) {
    console.error("GET /api/auth/me failed", error);
    return jsonError("Internal server error", 500);
  }
}
