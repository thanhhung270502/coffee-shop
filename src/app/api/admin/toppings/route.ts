import { ZodError } from "zod";

import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { createToppingSchema } from "@/server/topping/topping.schema";
import { createToppingService, listToppings } from "@/server/topping/topping.service";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const toppings = await listToppings();
    return jsonOk({ toppings });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/toppings failed", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const input = createToppingSchema.parse(await request.json());
    const topping = await createToppingService(input);
    return jsonOk({ topping });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/admin/toppings failed", error);
    return jsonError("Internal server error", 500);
  }
}
