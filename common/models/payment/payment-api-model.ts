import { APIBaseRoutes, type APIDefinition, APIMethod } from "../api-base";

import type { InitiatePaymentResponse } from "./payment-model";

export const API_INITIATE_MOMO_PAYMENT: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.ORDERS,
  subUrl: "/[id]/payment/initiate",
  requestBody: {} as Record<string, never>,
  responseBody: {} as InitiatePaymentResponse,
  buildUrlPath: (id: string) => `${APIBaseRoutes.ORDERS}/${id}/payment/initiate`,
};
