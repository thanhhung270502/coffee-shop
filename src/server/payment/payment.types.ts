export type MoMoCreatePaymentResult = {
  payUrl: string;
  requestId: string;
};

export type MoMoIpnPayload = {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
};
