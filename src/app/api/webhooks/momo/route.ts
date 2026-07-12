import { ZodError } from "zod";

import { jsonError, jsonOk, zodErrorResponse } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { momoIpnSchema } from "@/server/payment/payment.schema";
import { verifyMoMoIpn } from "@/server/payment/payment.service";

export async function POST(request: Request) {
  try {
    const body = momoIpnSchema.parse(await request.json());
    await verifyMoMoIpn(body);
    return jsonOk({ message: "OK" });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/webhooks/momo failed", error);
    return jsonError("Internal server error", 500);
  }
}
