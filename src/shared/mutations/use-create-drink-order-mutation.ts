"use client";

import type {
  CreateDrinkOrderRequest,
  CreateDrinkOrderResponse,
} from "@common/models/order";
import { API_CREATE_DRINK_ORDER } from "@common/models/order";
import { useMutation } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";

export function useCreateDrinkOrderMutation() {
  return useMutation({
    mutationFn: async (data: CreateDrinkOrderRequest) => {
      return (await postRequest<CreateDrinkOrderRequest>({
        path: API_CREATE_DRINK_ORDER.buildUrlPath(),
        data,
      })) as CreateDrinkOrderResponse;
    },
  });
}
