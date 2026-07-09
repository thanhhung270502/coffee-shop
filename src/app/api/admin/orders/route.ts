
import type { OrderChannel, OrderStatus, OrderType } from "@/generated/prisma";
import { requireRole } from "@/libs/auth/guards";
import { jsonError, jsonOk } from "@/libs/auth/http";
import { AppError } from "@/libs/errors";
import { listOrders } from "@/server/order/order.service";

export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as OrderType | null;
    const status = searchParams.get("status") as OrderStatus | null;
    const channel = searchParams.get("channel") as OrderChannel | null;
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;
    const orders = await listOrders({
      type: type ?? undefined,
      status: status ?? undefined,
      channel: channel ?? undefined,
      from,
      to,
    });
    return jsonOk({ orders });
  } catch (error) {
    if (error instanceof AppError) return jsonError(error.message, error.statusCode);
    console.error("GET /api/admin/orders failed", error);
    return jsonError("Internal server error", 500);
  }
}
