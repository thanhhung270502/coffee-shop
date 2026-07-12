import { jsonError, jsonOk } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { createMoMoPayment } from "@/server/payment/payment.service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await createMoMoPayment(id);
    return jsonOk({ orderId: id, payUrl: result.payUrl });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("POST /api/orders/[id]/payment/initiate failed", error);
    return jsonError("Internal server error", 500);
  }
}
