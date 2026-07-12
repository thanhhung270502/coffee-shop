import crypto from "crypto";

import { AppError } from "@/libs/errors";

import { findOrderForPayment, updateOrderPayment } from "./payment.repository";
import type { MoMoCreatePaymentResult, MoMoIpnPayload } from "./payment.types";

const MOMO_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://payment.momo.vn/v2/gateway/api/create"
    : "https://test-payment.momo.vn/v2/gateway/api/create";

function getMoMoCredentials() {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const redirectUrl = process.env.MOMO_REDIRECT_URL;
  const ipnUrl = process.env.MOMO_IPN_URL;

  if (!partnerCode || !accessKey || !secretKey || !redirectUrl || !ipnUrl) {
    throw new AppError("MoMo payment is not configured", 503);
  }

  return { partnerCode, accessKey, secretKey, redirectUrl, ipnUrl };
}

function createHmacSignature(rawSignature: string, secretKey: string): string {
  return crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
}

export async function createMoMoPayment(orderId: string): Promise<MoMoCreatePaymentResult> {
  const order = await findOrderForPayment(orderId);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.paymentStatus === "PAID") {
    throw new AppError("Order is already paid", 400);
  }

  const { partnerCode, accessKey, secretKey, redirectUrl, ipnUrl } = getMoMoCredentials();

  const requestId = `${orderId}-${Date.now()}`;
  const amount = order.total;
  const orderInfo = `Payment for order ${order.orderNumber}`;
  const requestType = "payWithMethod";
  const extraData = "";
  const autoCapture = true;
  const lang = "en";

  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl.replace("[id]", orderId)}` +
    `&requestId=${requestId}` +
    `&requestType=${requestType}`;

  const signature = createHmacSignature(rawSignature, secretKey);

  const requestBody = {
    partnerCode,
    partnerName: "Coffee Shop",
    storeId: partnerCode,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: redirectUrl.replace("[id]", orderId),
    ipnUrl,
    requestType,
    extraData,
    autoCapture,
    lang,
    signature,
  };

  const response = await fetch(MOMO_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    console.error("MoMo API request failed", await response.text());
    throw new AppError("Payment gateway error", 502);
  }

  const result = (await response.json()) as {
    resultCode: number;
    message: string;
    payUrl?: string;
  };

  if (result.resultCode !== 0 || !result.payUrl) {
    console.error("MoMo payment creation failed", result);
    throw new AppError(`Payment initiation failed: ${result.message}`, 400);
  }

  return { payUrl: result.payUrl, requestId };
}

export async function verifyMoMoIpn(payload: MoMoIpnPayload): Promise<void> {
  const { partnerCode, accessKey, secretKey } = getMoMoCredentials();

  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${payload.amount}` +
    `&extraData=${payload.extraData}` +
    `&message=${payload.message}` +
    `&orderId=${payload.orderId}` +
    `&orderInfo=${payload.orderInfo}` +
    `&orderType=${payload.orderType}` +
    `&partnerCode=${partnerCode}` +
    `&payType=${payload.payType}` +
    `&requestId=${payload.requestId}` +
    `&responseTime=${payload.responseTime}` +
    `&resultCode=${payload.resultCode}` +
    `&transId=${payload.transId}`;

  const expectedSignature = createHmacSignature(rawSignature, secretKey);

  if (expectedSignature !== payload.signature) {
    throw new AppError("Invalid IPN signature", 400);
  }

  if (payload.resultCode !== 0) {
    console.error("MoMo payment failed", payload.resultCode, payload.message);
    return;
  }

  await updateOrderPayment(payload.orderId, {
    paymentStatus: "PAID",
    paymentReference: String(payload.transId),
    status: "CONFIRMED",
  });
}
