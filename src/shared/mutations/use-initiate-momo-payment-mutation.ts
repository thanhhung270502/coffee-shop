"use client";

import type { InitiatePaymentResponse } from "@common/models/payment";
import { API_INITIATE_MOMO_PAYMENT } from "@common/models/payment";
import { useMutation } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";

export function useInitiateMoMoPaymentMutation() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      return (await postRequest({
        path: API_INITIATE_MOMO_PAYMENT.buildUrlPath(orderId),
        data: {},
      })) as InitiatePaymentResponse;
    },
  });
}
