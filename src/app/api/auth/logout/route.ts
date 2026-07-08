import { deleteSession } from "@/libs/auth";
import { jsonError, jsonOk } from "@/libs/auth/http";

export async function POST() {
  try {
    await deleteSession();
    return jsonOk({ ok: true });
  } catch (error) {
    console.error("POST /api/auth/logout failed", error);
    return jsonError("Internal server error", 500);
  }
}
