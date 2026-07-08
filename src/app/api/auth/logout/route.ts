import { jsonError, jsonOk } from "@/libs/auth/http";
import { logoutUser } from "@/server/auth/auth.service";

export async function POST() {
  try {
    const result = await logoutUser();
    return jsonOk(result);
  } catch (error) {
    console.error("POST /api/auth/logout failed", error);
    return jsonError("Internal server error", 500);
  }
}
