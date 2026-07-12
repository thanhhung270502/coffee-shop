import { z } from "zod";

export const momoIpnSchema = z.object({
  partnerCode: z.string(),
  orderId: z.string(),
  requestId: z.string(),
  amount: z.number(),
  orderInfo: z.string(),
  orderType: z.string(),
  transId: z.number(),
  resultCode: z.number(),
  message: z.string(),
  payType: z.string(),
  responseTime: z.number(),
  extraData: z.string(),
  signature: z.string(),
});

export type MoMoIpnInput = z.infer<typeof momoIpnSchema>;
