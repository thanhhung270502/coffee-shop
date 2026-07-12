/** Payment Initiation */
export type InitiatePaymentRequest = {
  orderId: string;
};

export type InitiatePaymentResponse = {
  orderId: string;
  payUrl: string;
};
