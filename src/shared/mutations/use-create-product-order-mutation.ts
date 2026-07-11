"use client";

import type {
  CreateProductOrderRequest,
  CreateProductOrderResponse,
} from "@common/models/order";
import { API_CREATE_PRODUCT_ORDER } from "@common/models/order";
import { useMutation } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";

export function useCreateProductOrderMutation() {
  return useMutation({
    mutationFn: async (data: CreateProductOrderRequest) => {
      return (await postRequest<CreateProductOrderRequest>({
        path: API_CREATE_PRODUCT_ORDER.buildUrlPath(),
        data,
      })) as CreateProductOrderResponse;
    },
  });
}
