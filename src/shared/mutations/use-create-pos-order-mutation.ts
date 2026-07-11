"use client";

import type { CreatePosOrderRequest, CreatePosOrderResponse } from "@common/models/pos";
import { API_POS_CREATE_ORDER } from "@common/models/pos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";
import { POS_QUEUE_QUERY_KEY } from "@/shared/queries/use-query-pos-queue";

export function useCreatePosOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePosOrderRequest) =>
      (await postRequest<CreatePosOrderRequest>({
        path: API_POS_CREATE_ORDER.buildUrlPath(),
        data,
      })) as CreatePosOrderResponse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_QUEUE_QUERY_KEY });
    },
  });
}
